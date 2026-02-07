import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TypewriterTextProps {
  text: string
  speed?: number // milliseconds per character
  className?: string
  showCursor?: boolean
  cursorChar?: string
  onComplete?: () => void
}

export default function TypewriterText({
  text,
  speed = 100,
  className = '',
  showCursor = true,
  cursorChar = '|',
  onComplete,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    setDisplayedText('')
    
    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(interval)
        if (onComplete) {
          onComplete()
        }
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed, onComplete])

  return (
    <span className={className} style={{ display: 'inline-block' }}>
      {displayedText}
      {showCursor && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
          style={{ display: 'inline-block', marginLeft: '2px' }}
        >
          {cursorChar}
        </motion.span>
      )}
    </span>
  )
}
