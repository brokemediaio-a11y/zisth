import { useEffect, useRef } from 'react'

/**
 * Renders the Spline viewer web component as a full-bleed background layer.
 * Use in Hero so the 3D scene sits behind content and is positioned on the right.
 */
const HERO_SCENE_URL = 'https://prod.spline.design/eJsdMEmax5uTUNQw/scene.splinecode'

export interface SplineViewerBackgroundProps {
  className?: string
}

// Check if device is mobile
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth <= 768
}

export default function SplineViewerBackground({ className = '' }: SplineViewerBackgroundProps) {
  const viewerRef = useRef<HTMLElement>(null)
  const hasInteractedRef = useRef(false)

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || !isMobileDevice()) return

    const setupMobileCamera = () => {
      const attemptCameraSetup = () => {
        try {
          // Access Spline application - try multiple property paths
          const splineApp = (viewer as any).application || 
                           (viewer as any).spline || 
                           (viewer as any).__spline ||
                           (viewer as any).getApplication?.()
          
          if (!splineApp) return false

          // Get the camera
          const camera = splineApp.camera || 
                        splineApp.scene?.camera ||
                        splineApp.getCamera?.()
          
          if (!camera) return false

          // Set camera to look upward toward the text/CTAs
          // Position camera lower and angle it upward
          if (camera.position) {
            camera.position.set(0, -1.5, 4) // Y negative = lower, Z = distance
          }
          if (camera.rotation) {
            camera.rotation.set(-0.4, 0, 0) // Negative X rotation = look up
          }
          
          // Update camera
          if (typeof camera.updateProjectionMatrix === 'function') {
            camera.updateProjectionMatrix()
          }
          
          // Trigger render if available
          if (typeof splineApp.render === 'function') {
            splineApp.render()
          }
          
          return true
        } catch (error) {
          return false
        }
      }

      // Try immediately
      if (attemptCameraSetup()) return

      // Wait for Spline to load - check periodically
      const checkSpline = setInterval(() => {
        if (attemptCameraSetup()) {
          clearInterval(checkSpline)
        }
      }, 200)

      // Also listen for load event
      const handleLoad = () => {
        setTimeout(() => {
          attemptCameraSetup()
        }, 300)
      }

      viewer.addEventListener('load', handleLoad)

      // Cleanup after 10 seconds
      setTimeout(() => {
        clearInterval(checkSpline)
        viewer.removeEventListener('load', handleLoad)
      }, 10000)

      return () => {
        clearInterval(checkSpline)
        viewer.removeEventListener('load', handleLoad)
      }
    }

    // Listen for user interactions to allow camera movement
    const handleInteraction = () => {
      hasInteractedRef.current = true
    }

    const options = { once: true, passive: true }
    viewer.addEventListener('touchstart', handleInteraction, options)
    viewer.addEventListener('touchmove', handleInteraction, options)
    viewer.addEventListener('mousedown', handleInteraction, options)

    const cleanup = setupMobileCamera()

    return () => {
      viewer.removeEventListener('touchstart', handleInteraction)
      viewer.removeEventListener('touchmove', handleInteraction)
      viewer.removeEventListener('mousedown', handleInteraction)
      if (cleanup) cleanup()
    }
  }, [])

  return (
    <div className={`spline-viewer-background ${className}`.trim()} aria-hidden>
      <spline-viewer
        ref={viewerRef as any}
        loading-anim-type="spinner-small-dark"
        url={HERO_SCENE_URL}
      />
    </div>
  )
}
