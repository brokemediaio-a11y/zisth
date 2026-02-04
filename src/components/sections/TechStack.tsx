import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import './TechStack.css'

export default function TechStack() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const titleRef = useRef(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-50px' })

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 992)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Row 1 - scrolls left to right (→)
  const row1Logos = [
    'n8n.webp',
    'react.webp',
    'mongodb.webp',
    'nextjs.webp',
    'postgresql.webp',
    'python.webp',
    'fastapi.webp',
    'nodejs.webp',
  ]

  // Row 2 - scrolls right to left (←)
  const row2Logos = [
    'jupyter.webp',
    'colab.webp',
    'vuejs.webp',
    'twilio.webp',
    'elevenlabs.webp',
    'cal-com.webp',
    'openai.webp',
    'google-workspace.webp',
    'aws.webp',
    'hostinger.webp',
  ]

  const CarouselRow = ({ logos, direction, speed }: { logos: string[]; direction: 'left' | 'right'; speed: number }) => {
    // Duplicate logos for seamless loop
    const duplicatedLogos = [...logos, ...logos]

    // Calculate animation values
    const logoWidth = isMobile ? 80 : isTablet ? 100 : 120
    const gap = isMobile ? 40 : isTablet ? 50 : 60
    const singleRowWidth = logos.length * (logoWidth + gap)

    // Animation: For left direction (→), animate from 0 to -50%
    // For right direction (←), animate from -50% to 0
    const animateX = direction === 'left' ? [0, -singleRowWidth] : [-singleRowWidth, 0]

    return (
      <div
        className="tech-stack__carousel-row"
        style={{
          height: isMobile ? '100px' : '120px',
          minHeight: isMobile ? '100px' : '120px',
        }}
      >
        <motion.div
          className="tech-stack__carousel-track"
          style={{
            gap: `${gap}px`,
            height: '100%',
          }}
          animate={{
            x: animateX,
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: speed,
              ease: 'linear',
            },
          }}
        >
          {duplicatedLogos.map((logo, index) => {
            const logoName = logo.replace('.webp', '').replace('.svg', '')
            return (
              <div
                key={`${logo}-${index}`}
                className="tech-stack__logo-wrapper"
                style={{
                  minWidth: `${logoWidth}px`,
                  width: `${logoWidth}px`,
                  height: isMobile ? '80px' : '100px',
                }}
              >
                <img
                  src={`/logos/${logo}`}
                  alt={logoName}
                  className="tech-stack__logo"
                  onError={(e) => {
                    // Hide image and show placeholder text
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent && !parent.querySelector('.tech-stack__logo-placeholder')) {
                      const placeholder = document.createElement('div')
                      placeholder.className = 'tech-stack__logo-placeholder'
                      placeholder.textContent = logoName.replace(/-/g, ' ').toUpperCase()
                      parent.appendChild(placeholder)
                    }
                  }}
                />
              </div>
            )
          })}
        </motion.div>
      </div>
    )
  }

  const vignetteWidth = isMobile ? '80px' : isTablet ? '150px' : '200px'

  return (
    <section id="tech-stack" className="tech-stack">
      {/* Subtle Glow Behind Section */}
      <div className="tech-stack__glow" />

      <div className="tech-stack__container">
        <div className="tech-stack__title-wrapper" ref={titleRef}>
          <motion.div
            className="tech-stack__title-inner"
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="tech-stack__heading">
              Tools & <span className="tech-stack__accent">Tech Stack</span>
            </h2>
          </motion.div>
        </div>

        {/* Carousel Container with Vignettes */}
        <div className="tech-stack__carousel-container">
          {/* LEFT VIGNETTE - fades in from left */}
          <div
            className="tech-stack__vignette tech-stack__vignette--left"
            style={{ width: vignetteWidth }}
          />

          {/* RIGHT VIGNETTE - fades in from right */}
          <div
            className="tech-stack__vignette tech-stack__vignette--right"
            style={{ width: vignetteWidth }}
          />

          {/* Row 1 - Left to Right (→) */}
          <CarouselRow logos={row1Logos} direction="left" speed={isMobile ? 50 : isTablet ? 40 : 30} />

          {/* Spacing between rows */}
          <div className="tech-stack__row-spacer" style={{ height: isMobile ? '30px' : '40px' }} />

          {/* Row 2 - Right to Left (←) */}
          <CarouselRow logos={row2Logos} direction="right" speed={isMobile ? 55 : isTablet ? 45 : 35} />
        </div>
      </div>
    </section>
  )
}
