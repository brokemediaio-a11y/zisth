import { motion } from 'framer-motion'
import './ServiceCard.css'

export interface Service {
  id: string
  title: string
  description: string
  icon: string
}

export interface ServiceCardProps {
  service: Service
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <motion.div
      className="service-card"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
        opacity: { duration: 0.25 },
      }}
      layout
    >
      <div className="service-card__icon">{service.icon}</div>
      
      <h3 className="service-card__title">{service.title}</h3>
      
      <p className="service-card__description">{service.description}</p>
      
      <div className="service-card__actions">
        <a href="#contact" className="service-card__btn service-card__btn--primary">
          GET A QUOTE
        </a>
        <a href="#portfolio" className="service-card__btn service-card__btn--secondary">
          VIEW PORTFOLIO →
        </a>
      </div>
    </motion.div>
  )
}
