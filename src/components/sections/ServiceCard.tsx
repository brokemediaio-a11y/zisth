import { motion } from 'framer-motion'
import { type LucideIcon } from 'lucide-react'
import './ServiceCard.css'

export interface Service {
  id: string
  title: string
  description: string
  icon: LucideIcon
}

export interface ServiceCardProps {
  service: Service
  isHardware?: boolean
}

export default function ServiceCard({ service, isHardware = false }: ServiceCardProps) {
  const IconComponent = service.icon
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
      <div className="service-card__icon">
        <IconComponent size={48} color="#252525" strokeWidth={1.5} />
      </div>
      
      <h3 className="service-card__title">{service.title}</h3>
      
      <p className="service-card__description">{service.description}</p>
      
      <div className="service-card__actions">
        <a href="/contact" className="service-card__btn service-card__btn--primary">
          <span>Book a consultation</span>
        </a>
        {isHardware ? (
          <a href={`/hardware/${service.id}`} className="service-card__btn service-card__btn--secondary">
            <span>View Services →</span>
          </a>
        ) : (
          <a href="/portfolio" className="service-card__btn service-card__btn--secondary">
            <span>VIEW PORTFOLIO →</span>
          </a>
        )}
      </div>
    </motion.div>
  )
}
