import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import emailjs from '@emailjs/browser'
import Stepper, { Step } from '../ui/Stepper'
import FloatingLines from '../ui/FloatingLines'
import { useRecaptcha } from '../../hooks/useRecaptcha'
import { useRateLimit } from '../../hooks/useRateLimit'
import { EMAILJS_CONFIG } from '../../config/emailjs'
import './ContactUs.css'

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    purpose: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const { executeRecaptcha } = useRecaptcha()
  const { canSubmit, recordSubmission, getRemainingSubmissions } = useRateLimit()

  // Initialize EmailJS
  useEffect(() => {
    if (EMAILJS_CONFIG.PUBLIC_KEY && EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY') {
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  /**
   * Validate form data
   */
  const validateForm = (): { valid: boolean; error?: string } => {
    if (!formData.name.trim()) {
      return { valid: false, error: 'Name is required' }
    }
    if (formData.name.trim().length < 2) {
      return { valid: false, error: 'Name must be at least 2 characters' }
    }
    if (formData.name.trim().length > 100) {
      return { valid: false, error: 'Name must not exceed 100 characters' }
    }

    if (!formData.email.trim()) {
      return { valid: false, error: 'Email is required' }
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email.trim())) {
      return { valid: false, error: 'Please enter a valid email address' }
    }
    if (formData.email.trim().length > 255) {
      return { valid: false, error: 'Email must not exceed 255 characters' }
    }

    if (!formData.purpose.trim()) {
      return { valid: false, error: 'Please select a purpose' }
    }

    if (!formData.message.trim()) {
      return { valid: false, error: 'Message is required' }
    }
    if (formData.message.trim().length < 10) {
      return { valid: false, error: 'Message must be at least 10 characters' }
    }
    if (formData.message.trim().length > 5000) {
      return { valid: false, error: 'Message must not exceed 5000 characters' }
    }

    return { valid: true }
  }

  /**
   * Handle form submission with EmailJS and reCAPTCHA protection
   */
  const handleFinalStepCompleted = async () => {
    // Reset status
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      // 1. Validate form data
      const validation = validateForm()
      if (!validation.valid) {
        setSubmitStatus('error')
        setErrorMessage(validation.error || 'Please check your input')
        return
      }

      // 2. Check rate limit
      if (!canSubmit()) {
        const remaining = getRemainingSubmissions()
        setSubmitStatus('error')
        setErrorMessage(
          `Too many submissions. Please wait before trying again. (${remaining} remaining)`
        )
        return
      }

      // 3. Execute reCAPTCHA v3
      let recaptchaToken = ''
      try {
        recaptchaToken = await executeRecaptcha()
      } catch (recaptchaError) {
        console.error('reCAPTCHA error:', recaptchaError)
        setSubmitStatus('error')
        setErrorMessage('Security verification failed. Please refresh and try again.')
        return
      }

      // 4. Check EmailJS configuration
      if (
        EMAILJS_CONFIG.PUBLIC_KEY === 'YOUR_EMAILJS_PUBLIC_KEY' ||
        EMAILJS_CONFIG.SERVICE_ID === 'YOUR_EMAILJS_SERVICE_ID' ||
        EMAILJS_CONFIG.TEMPLATE_ID === 'YOUR_EMAILJS_TEMPLATE_ID'
      ) {
        setSubmitStatus('error')
        setErrorMessage('Email service not configured. Please contact the administrator.')
        console.error('EmailJS not configured. Please update src/config/emailjs.ts')
        return
      }

      // 5. Prepare template parameters for EmailJS
      const templateParams = {
        from_name: formData.name.trim(),
        from_email: formData.email.trim(),
        purpose: formData.purpose.trim(),
        message: formData.message.trim(),
        to_email: EMAILJS_CONFIG.RECEIVER_EMAIL,
        recaptcha_token: recaptchaToken, // Include reCAPTCHA token
      }

      // 6. Send email via EmailJS
      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      )

      // 7. Check response
      if (response.status === 200) {
        // Record successful submission for rate limiting
        recordSubmission()

        // Success - keep form data visible during success state
        setSubmitStatus('success')
        // Don't clear form data immediately - let user see what was submitted
        
        // Clear form data only after success message timeout
        setTimeout(() => {
          setFormData({ name: '', email: '', purpose: '', message: '' })
        }, 5000)
      } else {
        throw new Error('Email service returned an error')
      }
    } catch (error: any) {
      // Handle errors
      console.error('Email submission error:', error)
      setSubmitStatus('error')

      // Provide user-friendly error messages
      if (error?.text) {
        setErrorMessage(error.text)
      } else if (error?.message) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('Failed to send message. Please try again later.')
      }
    } finally {
      setIsSubmitting(false)
      setTimeout(() => {
        setSubmitStatus('idle')
        setErrorMessage('')
      }, 5000)
    }
  }

  return (
    <section id="contact" className="contact-us">
      <div className="contact-us__background">
        <FloatingLines
          enabledWaves={['middle']}
          lineCount={5}
          lineDistance={0.1}
          bendRadius={5}
          bendStrength={-0.5}
          interactive={false}
          parallax={false}
        />
      </div>
      <div className="contact-us__container">
        <motion.div
          className="contact-us__header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="contact-us__heading">Get in Touch</h2>
          <p className="contact-us__subtext">
            Have a project in mind? We'd love to hear from you. Send us a message and we'll respond
            as soon as possible.
          </p>
        </motion.div>

        <motion.div
          className="contact-us__form-wrapper"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="contact-us__form">
            <Stepper
              initialStep={1}
              onStepChange={(step) => {
                console.log('Step changed to:', step)
              }}
              onFinalButtonClick={handleFinalStepCompleted}
              backButtonText="Previous"
              nextButtonText="Next"
              finalButtonText="Send Message"
            >
              <Step>
                <div className="contact-us__step">
                  <h3 className="contact-us__step-title">Let's get started</h3>
                  <p className="contact-us__step-description">
                    We'd love to know who you are and how to reach you
                  </p>
                  <div className="contact-us__field">
                    <label htmlFor="name" className="contact-us__label">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="contact-us__input"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="contact-us__field">
                    <label htmlFor="email" className="contact-us__label">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="contact-us__input"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>
              </Step>

              <Step>
                <div className="contact-us__step">
                  <h3 className="contact-us__step-title">Tell us more</h3>
                  <p className="contact-us__step-description">
                    Share the details and we'll craft the perfect solution
                  </p>
                  <div className="contact-us__field">
                    <label htmlFor="purpose" className="contact-us__label">
                      Purpose of reaching out
                    </label>
                    <select
                      id="purpose"
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                      className="contact-us__select"
                      required
                    >
                      <option value="">Select a purpose</option>
                      <option value="Hardware Service">Hardware Service</option>
                      <option value="Software service">Software service</option>
                      <option value="Collaboration">Collaboration</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="contact-us__field">
                    <label htmlFor="message" className="contact-us__label">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="contact-us__textarea"
                      placeholder="Tell us about your project..."
                      rows={6}
                      required
                    />
                  </div>

                  {isSubmitting && (
                    <div className="contact-us__submitting">
                      <span>Sending your message...</span>
                    </div>
                  )}

                  {submitStatus === 'success' && (
                    <motion.div
                      className="contact-us__status contact-us__status--success"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <CheckCircle2 className="contact-us__status-icon" />
                      Message sent successfully! We'll get back to you soon.
                    </motion.div>
                  )}

                  {submitStatus === 'error' && (
                    <motion.div
                      className="contact-us__status contact-us__status--error"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errorMessage || 'Something went wrong. Please try again.'}
                    </motion.div>
                  )}
                </div>
              </Step>
            </Stepper>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
