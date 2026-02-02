import { type HTMLAttributes, type ReactNode } from 'react'
import './LiquidGlassButton.css'

export interface LiquidGlassButtonProps extends Omit<HTMLAttributes<HTMLAnchorElement | HTMLButtonElement>, 'children'> {
  children: ReactNode
  as?: 'a' | 'button'
  width?: number
  height?: number
  borderRadius?: number
  innerShadowColor?: string
  innerShadowBlur?: number
  innerShadowSpread?: number
  glassTintColor?: string
  glassTintOpacity?: number
  frostBlurRadius?: number
  noiseFrequency?: number
  noiseStrength?: number
}

export default function LiquidGlassButton({
  children,
  as: Component = 'button',
  width = 169,
  height = 56,
  borderRadius = 33.04,
  innerShadowColor = '#000000',
  innerShadowBlur = 17,
  innerShadowSpread = -15,
  glassTintColor = 'rgba(26, 26, 26, 0.17)',
  frostBlurRadius = 0,
  noiseFrequency = 0.02,
  noiseStrength = 43,
  className = '',
  style,
  ...props
}: LiquidGlassButtonProps) {
  const filterId = `glass-distortion-${Math.random().toString(36).substr(2, 9)}`

  return (
    <>
      {/* SVG filter definition */}
      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
        <defs>
          <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={`${noiseFrequency} ${noiseFrequency}`}
              numOctaves={2}
              seed={92}
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="blurred"
              scale={noiseStrength}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <Component
        className={`liquid-glass ${className}`.trim()}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          borderRadius: `${borderRadius}px`,
          '--filter-url': `url(#${filterId})`,
          '--inner-shadow': `inset 0 0 ${innerShadowBlur}px ${innerShadowSpread}px ${innerShadowColor}`,
          '--glass-tint': glassTintColor,
          ...style,
        } as React.CSSProperties & { '--filter-url': string; '--inner-shadow': string; '--glass-tint': string }}
        {...(props as any)}
      >
        <span className="glass-text">{children}</span>
      </Component>
    </>
  )
}
