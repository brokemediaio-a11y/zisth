import { motion } from 'framer-motion'
import { useState } from 'react'
import HeroContent from './HeroContent'
import Robot3D from '../Robot3D'
import TextType from '../ui/TextType'
import './Hero.css'

export default function Hero() {
  const [introComplete, setIntroComplete] = useState(false)

  return (
    <section className="hero" aria-labelledby="hero-headline">
      {/* Full-section 3D robot background, positioned on the right */}
      <div className="hero__spline-bg">
        <div className="hero__spline-bg-inner">
          <Robot3D onIntroComplete={() => setIntroComplete(true)} />
          {/* Robot greeting text - appears after intro animation */}
          {introComplete && (
            <motion.div
              className="hero__robot-greeting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <TextType
                text={['Hi, I am Zisth']}
                typingSpeed={80}
                showCursor={true}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Content overlay – left side with padding */}
      <div className="hero__content">
        <motion.div
          className="hero__content-inner"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <HeroContent
            headline="Where Curiosity Becomes Intelligent Systems"
            subtext="A living research lab uniting science, design, and technology to transform ideas into evolving, real-world solutions."
            primaryAction={{ label: 'Get started', href: '#contact' }}
            secondaryAction={{ label: 'Learn more', href: '#about' }}
          />
        </motion.div>
      </div>
    </section>
  )
}
