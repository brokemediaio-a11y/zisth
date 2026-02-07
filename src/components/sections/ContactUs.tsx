import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import Stepper, { Step } from '../ui/Stepper'
import FloatingLines from '../ui/FloatingLines'
import './ContactUs.css'

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFinalStepCompleted = async () => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    // Simulate form submission
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSubmitStatus('success')
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitStatus('idle'), 3000)
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
          interactive={true}
          parallax={true}
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
                  <h3 className="contact-us__step-title">What's your name?</h3>
                  <p className="contact-us__step-description">
                    Let's start with a friendly introduction
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
                </div>
              </Step>

              <Step>
                <div className="contact-us__step">
                  <h3 className="contact-us__step-title">How can we reach you?</h3>
                  <p className="contact-us__step-description">
                    We'll use this to get back to you
                  </p>
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
                  <h3 className="contact-us__step-title">Tell us about your project</h3>
                  <p className="contact-us__step-description">
                    Share the details and we'll craft the perfect solution
                  </p>
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
                </div>
              </Step>

              <Step>
                <div className="contact-us__step">
                  <h3 className="contact-us__step-title">Review & Submit</h3>
                  <p className="contact-us__step-description">
                    Please review your information before sending
                  </p>
                  <div className="contact-us__review">
                    <div className="contact-us__review-item">
                      <span className="contact-us__review-label">Name:</span>
                      <span className="contact-us__review-value">{formData.name || 'Not provided'}</span>
                    </div>
                    <div className="contact-us__review-item">
                      <span className="contact-us__review-label">Email:</span>
                      <span className="contact-us__review-value">{formData.email || 'Not provided'}</span>
                    </div>
                    <div className="contact-us__review-item">
                      <span className="contact-us__review-label">Message:</span>
                      <span className="contact-us__review-value">
                        {formData.message || 'Not provided'}
                      </span>
                    </div>
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
                      Something went wrong. Please try again.
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
