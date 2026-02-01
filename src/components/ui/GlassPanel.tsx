import { type HTMLAttributes, forwardRef } from 'react'
import './GlassPanel.css'

export interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'section' | 'header'
}

const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ as: Component = 'div', className = '', children, ...props }, ref) => {
    return (
      <Component ref={ref as never} className={`glass-panel ${className}`.trim()} {...props}>
        {children}
      </Component>
    )
  }
)

GlassPanel.displayName = 'GlassPanel'

export default GlassPanel
