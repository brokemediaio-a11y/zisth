import { useCallback } from 'react'

/**
 * Rate Limiting Hook
 * 
 * Client-side rate limiting to prevent spam and abuse.
 * 
 * IMPORTANT: This is NOT a replacement for server-side rate limiting.
 * It only provides basic protection. EmailJS dashboard rate limits are the primary defense.
 * 
 * How it works:
 * - Stores submission timestamps in localStorage
 * - Limits submissions to X per time period
 * - Clears old entries automatically
 */

const RATE_LIMIT_KEY = 'emailjs_submission_times'
const MAX_SUBMISSIONS = 3 // Maximum submissions
const TIME_WINDOW = 60 * 60 * 1000 // 1 hour in milliseconds

export function useRateLimit() {
  /**
   * Check if user can submit (not rate limited)
   */
  const canSubmit = useCallback((): boolean => {
    try {
      const stored = localStorage.getItem(RATE_LIMIT_KEY)
      if (!stored) return true

      const submissionTimes: number[] = JSON.parse(stored)
      const now = Date.now()

      // Filter out old submissions (outside time window)
      const recentSubmissions = submissionTimes.filter(
        (time) => now - time < TIME_WINDOW
      )

      // Update localStorage with filtered times
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recentSubmissions))

      // Check if under limit
      return recentSubmissions.length < MAX_SUBMISSIONS
    } catch (error) {
      console.error('Rate limit check error:', error)
      // On error, allow submission (fail open)
      return true
    }
  }, [])

  /**
   * Record a submission
   */
  const recordSubmission = useCallback((): void => {
    try {
      const stored = localStorage.getItem(RATE_LIMIT_KEY)
      const submissionTimes: number[] = stored ? JSON.parse(stored) : []
      const now = Date.now()

      // Add current submission
      submissionTimes.push(now)

      // Filter out old submissions
      const recentSubmissions = submissionTimes.filter(
        (time) => now - time < TIME_WINDOW
      )

      // Save to localStorage
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recentSubmissions))
    } catch (error) {
      console.error('Rate limit record error:', error)
    }
  }, [])

  /**
   * Get remaining submissions in current time window
   */
  const getRemainingSubmissions = useCallback((): number => {
    try {
      const stored = localStorage.getItem(RATE_LIMIT_KEY)
      if (!stored) return MAX_SUBMISSIONS

      const submissionTimes: number[] = JSON.parse(stored)
      const now = Date.now()

      // Filter out old submissions
      const recentSubmissions = submissionTimes.filter(
        (time) => now - time < TIME_WINDOW
      )

      return Math.max(0, MAX_SUBMISSIONS - recentSubmissions.length)
    } catch (error) {
      return MAX_SUBMISSIONS
    }
  }, [])

  return {
    canSubmit,
    recordSubmission,
    getRemainingSubmissions,
  }
}
