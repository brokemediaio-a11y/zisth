import { useEffect, useCallback } from 'react'
import { RECAPTCHA_CONFIG } from '../config/emailjs'

/**
 * reCAPTCHA v3 Hook
 * 
 * This hook handles reCAPTCHA v3 verification to prevent spam and abuse.
 * 
 * How it works:
 * 1. Loads reCAPTCHA script on component mount
 * 2. Executes reCAPTCHA when form is submitted
 * 3. Returns a token that proves the user is human
 * 4. Token is sent to EmailJS along with form data
 * 
 * Security:
 * - reCAPTCHA v3 runs invisibly (no checkbox)
 * - Analyzes user behavior to determine if human
 * - Returns a score (0.0 = bot, 1.0 = human)
 * - We reject submissions below threshold
 */

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

export function useRecaptcha() {
  // Load reCAPTCHA script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_CONFIG.SITE_KEY}`
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    return () => {
      // Cleanup: remove script on unmount
      const existingScript = document.querySelector(`script[src="${script.src}"]`)
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [])

  /**
   * Execute reCAPTCHA and get token
   * @returns Promise<string> - reCAPTCHA token
   */
  const executeRecaptcha = useCallback(async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!window.grecaptcha) {
        reject(new Error('reCAPTCHA not loaded. Please check your site key.'))
        return
      }

      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(RECAPTCHA_CONFIG.SITE_KEY, {
            action: RECAPTCHA_CONFIG.ACTION,
          })
          .then((token: string) => {
            resolve(token)
          })
          .catch((error: Error) => {
            reject(error)
          })
      })
    })
  }, [])

  return { executeRecaptcha }
}
