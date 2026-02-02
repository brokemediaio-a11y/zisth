import { motion, useInView } from 'framer-motion'
import { type ElementType, useRef } from 'react'

export interface BlurInTextProps {
  text: string
  blurAmount?: number
  duration?: number
  stagger?: number
  split?: 'letter' | 'word'
  trigger?: 'mount' | 'inView'
  className?: string
  as?: ElementType
}

export default function BlurInText({
  text,
  blurAmount = 12,
  duration = 1,
  stagger = 0.08,
  split = 'letter',
  trigger = 'mount',
  className = '',
  as: Component = 'span',
}: BlurInTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const Wrapper = Component as ElementType
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  const chunks =
    split === 'letter'
      ? text.split('').map((char) => (char === ' ' ? '\u00A0' : char))
      : text.split(/(\s+)/)

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
      },
    },
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      filter: `blur(${blurAmount}px)`,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        duration,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const shouldAnimate = trigger === 'mount' || isInView

  return (
    <Wrapper ref={ref} className={className} style={{ display: 'inline' }}>
      <motion.span
        style={{ display: 'inline-flex', flexWrap: 'wrap' }}
        variants={containerVariants}
        initial="hidden"
        animate={shouldAnimate ? 'visible' : 'hidden'}
      >
        {chunks.map((chunk, i) => (
          <motion.span
            key={i}
            variants={itemVariants}
            style={{
              display: 'inline-block',
              whiteSpace: chunk === '\u00A0' ? 'pre' : 'normal',
            }}
          >
            {chunk}
          </motion.span>
        ))}
      </motion.span>
    </Wrapper>
  )
}
