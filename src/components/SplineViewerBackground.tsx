/**
 * Renders the Spline viewer web component as a full-bleed background layer.
 * Use in Hero so the 3D scene sits behind content and is positioned on the right.
 */
const HERO_SCENE_URL = 'https://prod.spline.design/eJsdMEmax5uTUNQw/scene.splinecode'

export interface SplineViewerBackgroundProps {
  className?: string
}

export default function SplineViewerBackground({ className = '' }: SplineViewerBackgroundProps) {
  return (
    <div className={`spline-viewer-background ${className}`.trim()} aria-hidden>
      <spline-viewer
        loading-anim-type="spinner-small-dark"
        url={HERO_SCENE_URL}
      />
    </div>
  )
}
