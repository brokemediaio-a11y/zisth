import { useEffect, useState } from 'react'

export function useScrollToBottom(threshold = 100) {
  const [isAtBottom, setIsAtBottom] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const scrollBottom = scrollTop + windowHeight

      // Check if we're near the bottom (within threshold)
      if (documentHeight - scrollBottom <= threshold) {
        setIsAtBottom(true)
      } else {
        setIsAtBottom(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check initial state

    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  return isAtBottom
}
