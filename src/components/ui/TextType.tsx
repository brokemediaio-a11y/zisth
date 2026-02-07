import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

interface TextTypeProps {
  text: string[]
  typingSpeed?: number
  pauseDuration?: number
  showCursor?: boolean
  cursorCharacter?: string
  className?: string
}

export default function TextType({
  text,
  typingSpeed = 75,
  pauseDuration = 1500,
  showCursor = true,
  cursorCharacter = '|',
  className = '',
}: TextTypeProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [charIndex, setCharIndex] = useState(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    // Animate cursor blinking
    if (showCursor && cursorRef.current) {
      const cursorAnimation = gsap.to(cursorRef.current, {
        opacity: 0,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
      })

      return () => {
        cursorAnimation.kill()
      }
    }
  }, [showCursor])

  useEffect(() => {
    if (text.length === 0) return

    const currentText = text[currentIndex]

    if (isTyping && !isDeleting) {
      // Typing forward
      if (charIndex < currentText.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayedText(currentText.substring(0, charIndex + 1))
          setCharIndex(charIndex + 1)
        }, typingSpeed)
      } else {
        // Finished typing, pause then start deleting
        timeoutRef.current = setTimeout(() => {
          setIsDeleting(true)
          setIsTyping(false)
        }, pauseDuration)
      }
    } else if (isDeleting && !isTyping) {
      // Deleting backward
      if (charIndex > 0) {
        timeoutRef.current = setTimeout(() => {
          setDisplayedText(currentText.substring(0, charIndex - 1))
          setCharIndex(charIndex - 1)
        }, typingSpeed / 2) // Delete faster than typing
      } else {
        // Finished deleting, move to next text in loop
        timeoutRef.current = setTimeout(() => {
          setIsDeleting(false)
          setCurrentIndex((prevIndex) => (prevIndex + 1) % text.length)
          setCharIndex(0)
          setDisplayedText('')
          setIsTyping(true)
        }, 100) // Small delay before starting next text
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [charIndex, isTyping, isDeleting, currentIndex, text, typingSpeed, pauseDuration])

  return (
    <span className={className}>
      {displayedText}
      {showCursor && (
        <span ref={cursorRef} style={{ display: 'inline-block', marginLeft: '2px' }}>
          {cursorCharacter}
        </span>
      )}
    </span>
  )
}
