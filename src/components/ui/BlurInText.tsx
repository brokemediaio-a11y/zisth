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

  // Handle newlines before splitting
  const processedText = text.replace(/\n/g, '\u0000NEWLINE\u0000')
  
  const chunks =
    split === 'letter'
      ? (() => {
          // Split by newlines first
          const parts = processedText.split('\u0000NEWLINE\u0000')
          const result: Array<{ type: 'word' | 'space' | 'newline'; letters: string[] }> = []
          parts.forEach((part, index) => {
            // Split by words to keep them together
            const words = part.split(/(\s+)/)
            words.forEach((word) => {
              if (word.trim() === '') {
                // Whitespace
                result.push({ type: 'space', letters: ['\u00A0'] })
              } else {
                // Word - split by character but keep as one unit
                result.push({ type: 'word', letters: word.split('') })
              }
            })
            // Add newline marker between parts (except after last part)
            if (index < parts.length - 1) {
              result.push({ type: 'newline', letters: [] })
            }
          })
          return result
        })()
      : [{ type: 'word' as const, letters: processedText.split(/(\s+)/) }]

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
        {chunks.map((chunk, i) => {
          // Handle newline marker
          if (chunk.type === 'newline') {
            return <br key={`br-${i}`} />
          }
          
          // Wrap each word in a container to prevent breaking within words
          if (chunk.type === 'word') {
            return (
              <span key={`word-${i}`} style={{ display: 'inline', wordBreak: 'keep-all' }}>
                {chunk.letters.map((letter, j) => (
                  <motion.span
                    key={`${i}-${j}`}
                    variants={itemVariants}
                    style={{
                      display: 'inline',
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            )
          }
          
          // Handle space
          return (
            <motion.span
              key={`space-${i}`}
              variants={itemVariants}
              style={{
                display: 'inline-block',
                whiteSpace: 'pre',
              }}
            >
              {chunk.letters[0]}
            </motion.span>
          )
        })}
      </motion.span>
    </Wrapper>
  )
}
