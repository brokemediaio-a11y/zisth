import { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import './Robot3D.css'

interface Robot3DProps {
  className?: string
  onIntroComplete?: () => void
}

function RobotModel({ mousePositionRef, onIntroComplete }: { mousePositionRef: React.MutableRefObject<{ x: number; y: number }>, onIntroComplete?: () => void }) {
  const { scene } = useGLTF('/mini_robot/scene.gltf')
  const headGroupRef = useRef<THREE.Object3D | null>(null)
  const headBaseRotation = useRef<THREE.Euler>(new THREE.Euler())
  const eyeMeshesRef = useRef<THREE.Object3D[]>([])
  const blinkState = useRef({ nextBlink: 3, phase: 0, active: false })

  const armGroupRef = useRef<THREE.Group | null>(null)
  const armBaseRot = useRef(new THREE.Euler())
  const armAnim = useRef({
    phase: 0,
    phaseTime: 0,
    timer: 5,
    cycleCount: 0,
  })

  const isSetup = useRef(false)
  const cameraIntro = useRef({ progress: 0, done: false, started: false })
  const [modelScale, setModelScale] = useState(1)
  const [modelPosY, setModelPosY] = useState(0)
  const [modelReady, setModelReady] = useState(false)

  // FIX 1: Track opacity for a smooth fade-in so the model doesn't "pop" in
  const modelGroupRef = useRef<THREE.Group>(null)
  const fadeIn = useRef({ progress: 0, done: false })

  const [clone] = useState(() => {
    const c = scene.clone()
    c.rotation.x = Math.PI * 2
    return c
  })

  // Auto-compute correct scale and vertical position from actual bounding box
  useEffect(() => {
    clone.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(clone)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)

    const maxDim = Math.max(size.x, size.y, size.z)
    const targetHeight = 5.5
    const scale = targetHeight / maxDim

    const posY = -(center.y * scale) + 0.3

    setModelScale(scale)
    setModelPosY(posY)
    setModelReady(true)
  }, [clone])

  // Fix material lighting after model loads
  useEffect(() => {
    if (!modelReady) return

    clone.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const material = child.material as THREE.MeshStandardMaterial

        if (material.isMeshStandardMaterial) {
          if (material.aoMap) {
            material.aoMapIntensity = 0.3
          }
          if (material.emissive) {
            material.emissiveIntensity = 1.0
          }

          // FIX 2: Enable transparency for the fade-in effect
          material.transparent = true
          material.opacity = 0
          material.needsUpdate = true
        }
      }
    })
  }, [clone, modelReady])

  useEffect(() => {
    if (isSetup.current) return

    const headPartNames = ['head', 'screen', 'ears', 'ears_part_1', 'ears_part_2', 'cap', 'neck']

    let rootGroup: THREE.Object3D | null = null
    clone.traverse((child) => {
      if (child.name === 'Collada_visual_scene_group') {
        rootGroup = child
      }
    })

    if (!rootGroup) {
      console.warn('Could not find Collada_visual_scene_group')
      isSetup.current = true
      return
    }

    const headParts: THREE.Object3D[] = []
    ;(rootGroup as THREE.Object3D).children.forEach((child) => {
      if (headPartNames.includes(child.name)) {
        headParts.push(child)
      }
    })

    if (headParts.length === 0) {
      console.warn('No head parts found')
      isSetup.current = true
      return
    }

    const neckPart = headParts.find(p => p.name === 'neck')
    const pivotPoint = neckPart
      ? neckPart.position.clone()
      : new THREE.Vector3(0, 482, 0)

    const headGroup = new THREE.Group()
    headGroup.name = 'head_group'
    headGroup.position.copy(pivotPoint)

    const partsToMove = [...headParts]
    partsToMove.forEach(part => {
      const originalPos = part.position.clone()
      ;(rootGroup as THREE.Object3D).remove(part)
      headGroup.add(part)
      part.position.copy(originalPos.sub(pivotPoint))
    })

    ;(rootGroup as THREE.Object3D).add(headGroup)

    headGroupRef.current = headGroup
    headBaseRotation.current = headGroup.rotation.clone()

    const eyeMeshes: THREE.Object3D[] = []
    let screenNode: THREE.Object3D | null = null
    headGroup.traverse((child) => {
      if (child.name === 'screen') screenNode = child
    })
    if (screenNode) {
      const meshes: THREE.Mesh[] = []
      ;(screenNode as THREE.Object3D).traverse((child) => {
        if (child instanceof THREE.Mesh) meshes.push(child)
      })
      if (meshes.length > 1) {
        eyeMeshes.push(...meshes.slice(1))
      }
    }
    eyeMeshesRef.current = eyeMeshes

    // Arm group setup
    const armPartNames = [
      'arm_joint_part', 'arm_joints', 'arm_joints_2',
      'arms_high', 'arms_high002', 'arms_high003',
      'Cube001', 'Cylinder010', 'Cylinder008',
    ]
    const armParts: THREE.Object3D[] = []
    ;(rootGroup as THREE.Object3D).children.forEach((child) => {
      if (armPartNames.includes(child.name)) {
        armParts.push(child)
      }
    })

    if (armParts.length > 0) {
      let pivotY = -Infinity
      armParts.forEach(p => {
        if (p.position.y > pivotY) {
          pivotY = p.position.y
        }
      })
      const pivot = new THREE.Vector3(0, pivotY, 0)

      const armGroup = new THREE.Group()
      armGroup.name = 'arm_group'
      armGroup.position.copy(pivot)

      const toMove = [...armParts]
      toMove.forEach(part => {
        const origPos = part.position.clone()
        ;(rootGroup as THREE.Object3D).remove(part)
        armGroup.add(part)
        part.position.copy(origPos.sub(pivot))
      })

      ;(rootGroup as THREE.Object3D).add(armGroup)
      armGroupRef.current = armGroup
      armBaseRot.current = armGroup.rotation.clone()
    }

    isSetup.current = true
  }, [clone])

  const ease = (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

  useFrame((state, delta) => {
    // FIX 3: Clamp delta to prevent large spikes on first frame or tab-refocus.
    // Without this, a single 200ms+ delta jumps the animation forward abruptly.
    const dt = Math.min(delta, 1 / 30) // Cap at ~33ms (30fps minimum)

    // === FADE-IN: smoothly transition opacity so model doesn't "pop" in ===
    const fi = fadeIn.current
    if (!fi.done) {
      const FADE_DURATION = 0.6 // seconds
      fi.progress += dt
      const t = Math.min(fi.progress / FADE_DURATION, 1)
      const opacity = t * t // quadratic ease-in for smooth appearance

      clone.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const mat = child.material as THREE.MeshStandardMaterial
          if (mat.isMeshStandardMaterial) {
            mat.opacity = opacity
          }
        }
      })

      if (t >= 1) {
        // Clean up: disable transparency for better rendering performance
        clone.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            const mat = child.material as THREE.MeshStandardMaterial
            if (mat.isMeshStandardMaterial) {
              mat.transparent = false
              mat.opacity = 1
              mat.needsUpdate = true
            }
          }
        })
        fi.done = true
      }
    }

    // === INTRO CAMERA ZOOM-OUT ===
    const intro = cameraIntro.current
    if (!intro.done) {
      const START_Z = 3.5  // FIX 4: Start closer but not clipping-close
      const END_Z = 6
      const DURATION = 2.0

      // FIX 5: Use the clamped dt instead of raw delta
      intro.progress += dt
      const t = Math.min(intro.progress / DURATION, 1)

      // FIX 6: Use a smoother easing — cubic ease-in-out prevents both
      // the harsh start AND harsh end that ease-out alone causes
      const eased = t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2

      state.camera.position.z = START_Z + (END_Z - START_Z) * eased

      if (t >= 1) {
        state.camera.position.z = END_Z
        intro.done = true
        if (onIntroComplete && !intro.started) {
          intro.started = true
          onIntroComplete()
        }
      }
    }

    // === HEAD TRACKING ===
    const head = headGroupRef.current
    if (head) {
      const { x: mx, y: my } = mousePositionRef.current
      const base = headBaseRotation.current
      // FIX 7: Use clamped dt for lerp factor to prevent jumpy head tracking
      // during the intro. The lerp factor should be frame-rate independent.
      const lerpFactor = 1 - Math.pow(0.001, dt) // ~0.08 at 60fps, stable at any fps
      head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, base.y + mx * (Math.PI / 5), lerpFactor)
      head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, base.x - my * (Math.PI / 7), lerpFactor)
    }

    // === EYE BLINK ===
    const eyes = eyeMeshesRef.current
    if (eyes.length > 0) {
      const b = blinkState.current
      b.nextBlink -= dt
      if (b.nextBlink <= 0 && !b.active) {
        b.active = true
        b.phase = 0
      }
      if (b.active) {
        b.phase += dt
        if (b.phase < 0.15) {
          eyes.forEach(eye => { eye.visible = false })
        } else {
          eyes.forEach(eye => { eye.visible = true })
          b.active = false
          b.nextBlink = 2 + Math.random() * 3
        }
      }
    }

    // === ARM ANIMATION ===
    const ag = armGroupRef.current
    if (ag) {
      const a = armAnim.current
      const base = armBaseRot.current

      const BEND_ANGLE = Math.PI / 6
      const RAISE_ANGLE = Math.PI / 5
      const MOVE_TIME = 1.3
      const HOLD_TIME = 0.5

      if (a.phase === 0) {
        a.timer -= dt
        if (a.timer <= 0) { a.phase = 1; a.phaseTime = 0 }
      } else if (a.phase === 1) {
        a.phaseTime += dt
        const t = Math.min(a.phaseTime / MOVE_TIME, 1)
        ag.rotation.x = base.x - BEND_ANGLE * ease(t)
        if (t >= 1) { a.phase = 2; a.phaseTime = 0 }
      } else if (a.phase === 2) {
        a.phaseTime += dt
        if (a.phaseTime >= HOLD_TIME) { a.phase = 3; a.phaseTime = 0 }
      } else if (a.phase === 3) {
        a.phaseTime += dt
        const t = Math.min(a.phaseTime / MOVE_TIME, 1)
        ag.rotation.x = base.x - BEND_ANGLE * (1 - ease(t))
        if (t >= 1) { ag.rotation.x = base.x; a.phase = 4; a.phaseTime = 0; a.timer = 20 }
      } else if (a.phase === 4) {
        a.timer -= dt
        if (a.timer <= 0) { a.phase = 5; a.phaseTime = 0 }
      } else if (a.phase === 5) {
        a.phaseTime += dt
        const t = Math.min(a.phaseTime / MOVE_TIME, 1)
        ag.rotation.z = base.z + RAISE_ANGLE * ease(t)
        if (t >= 1) { a.phase = 6; a.phaseTime = 0 }
      } else if (a.phase === 6) {
        a.phaseTime += dt
        if (a.phaseTime >= HOLD_TIME) { a.phase = 7; a.phaseTime = 0 }
      } else if (a.phase === 7) {
        a.phaseTime += dt
        const t = Math.min(a.phaseTime / MOVE_TIME, 1)
        ag.rotation.z = base.z + RAISE_ANGLE * (1 - ease(t))
        if (t >= 1) {
          ag.rotation.z = base.z
          a.phase = 0
          a.phaseTime = 0
          a.timer = 15
        }
      }
    }
  })

  if (!modelReady) return null

  return (
    <primitive object={clone} scale={3} position={[0, -3.5, 0]} />
  )
}

function Scene({ mousePositionRef, onIntroComplete }: { mousePositionRef: React.MutableRefObject<{ x: number; y: number }>, onIntroComplete?: () => void }) {
  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 8, 5]} intensity={2} />
      <directionalLight position={[-5, 8, -5]} intensity={1.5} />
      <directionalLight position={[0, 10, 0]} intensity={1} />
      <pointLight position={[0, 5, 0]} intensity={1.5} />
      <Suspense fallback={null}>
        <RobotModel mousePositionRef={mousePositionRef} onIntroComplete={onIntroComplete} />
      </Suspense>
    </>
  )
}

export default function Robot3D({ className = '', onIntroComplete }: Robot3DProps) {
  const mousePositionRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mousePositionRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className={`robot-3d-container ${className}`.trim()} aria-hidden>
      <Canvas
        camera={{ position: [0, 0.5, 3.5], fov: 45 }}  // FIX 8: Match START_Z so there's no jump on first frame
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 8
        }}
      >
        <Scene mousePositionRef={mousePositionRef} onIntroComplete={onIntroComplete} />
      </Canvas>
    </div>
  )
}

useGLTF.preload('/mini_robot/scene.gltf')