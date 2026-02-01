import Spline from '@splinetool/react-spline'
import { useCallback, type CSSProperties } from 'react'

const DEFAULT_SCENE_URL = 'https://prod.spline.design/eJsdMEmax5uTUNQw/scene.splinecode'

export interface SplineSceneProps {
  sceneUrl?: string
  className?: string
  style?: CSSProperties
}

export default function SplineScene({
  sceneUrl = DEFAULT_SCENE_URL,
  className = '',
  style,
}: SplineSceneProps) {
  const onLoad = useCallback((_splineApp: unknown) => {
    // Optional: interact with Spline objects via findObjectByName / findObjectById
  }, [])

  return (
    <div
      className={`spline-container ${className}`.trim()}
      style={{ width: '100%', height: '100%', minHeight: 400, ...style }}
    >
      <Spline scene={sceneUrl} onLoad={onLoad} />
    </div>
  )
}
