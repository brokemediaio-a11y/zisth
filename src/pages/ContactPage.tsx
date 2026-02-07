import { motion } from 'framer-motion'
import ContactUs from '../components/sections/ContactUs'
import BlurText from '../components/ui/BlurText'
import './ContactPage.css'

export default function ContactPage() {
  return (
    <main className="contact-page">
      <div className="contact-page__header-wrapper">
        <motion.div
          className="contact-page__header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <BlurText
            text="Get in Touch"
            delay={200}
            animateBy="words"
            direction="top"
            className="contact-page__heading"
          />
          <p className="contact-page__subtext">
            Have a project in mind? We'd love to hear from you. Send us a message and we'll respond
            as soon as possible.
          </p>
        </motion.div>
      </div>
      <div className="contact-page__content">
        <ContactUs />
      </div>
    </main>
  )
}
