import { type HTMLAttributes } from 'react'
import BlurInText from '../ui/BlurInText'
import './HeroContent.css'

export interface HeroContentProps extends HTMLAttributes<HTMLDivElement> {
  headline: string
  subtext: string
  primaryAction?: { label: string; href: string }
  secondaryAction?: { label: string; href: string }
}

export default function HeroContent({
  headline,
  subtext,
  primaryAction,
  secondaryAction,
  className = '',
  ...props
}: HeroContentProps) {
  return (
    <div className={`hero-content ${className}`.trim()} {...props}>
      <h1 id="hero-headline" className="hero-content__headline">
        <BlurInText
          text={headline}
          blurAmount={12}
          duration={1}
          stagger={0.08}
          split="letter"
          trigger="mount"
        />
      </h1>
      <p className="hero-content__subtext">{subtext}</p>
      {(primaryAction ?? secondaryAction) && (
        <div className="hero-content__actions">
          {primaryAction && (
            <a href={primaryAction.href} className="hero-content__btn hero-content__btn--primary">
              {primaryAction.label}
            </a>
          )}
          {secondaryAction && (
            <a href={secondaryAction.href} className="hero-content__btn hero-content__btn--secondary">
              {secondaryAction.label}
            </a>
          )}
        </div>
      )}
    </div>
  )
}
