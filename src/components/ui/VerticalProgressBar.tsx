import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import './VerticalProgressBar.css'

export interface ProgressStep {
  title: string
  description: string
}

export interface VerticalProgressBarProps {
  steps: ProgressStep[]
  className?: string
}

export default function VerticalProgressBar({ steps, className = '' }: VerticalProgressBarProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2']
  })

  // Transform scroll progress to fill height (0% to 100%)
  const fillHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <div ref={containerRef} className={`vertical-progress ${className}`}>
      <div className="vertical-progress__line">
        <motion.div
          className="vertical-progress__line-fill"
          style={{ height: fillHeight }}
        />
      </div>
      {steps.map((step, index) => (
        <div key={index} className="vertical-progress__step">
          <motion.div
            className="vertical-progress__step-marker"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: index * 0.2, duration: 0.3 }}
          >
            <div className="vertical-progress__step-dot" />
          </motion.div>
          <motion.div
            className="vertical-progress__step-content"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: index * 0.2 + 0.1, duration: 0.4 }}
          >
            <h3 className="vertical-progress__step-title">{step.title}</h3>
            <p className="vertical-progress__step-description">{step.description}</p>
          </motion.div>
        </div>
      ))}
    </div>
  )
}
