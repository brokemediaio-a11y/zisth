import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import './Testimonials.css'

interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  content: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'CTO',
    company: 'TechFlow Solutions',
    content:
      'Nexordis transformed our data infrastructure with their ML models. The predictive analytics system they built has reduced our operational costs by 35% and improved decision-making across all departments. Their team is incredibly knowledgeable and responsive.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Rodriguez',
    role: 'Product Director',
    company: 'InnovateLabs',
    content:
      'Working with Nexordis on our agentic AI assistant was a game-changer. They delivered a sophisticated conversational AI that understands context and learns from interactions. Our customer satisfaction scores increased by 42% within three months.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emily Watson',
    role: 'Founder & CEO',
    company: 'GreenEnergy Analytics',
    content:
      'The custom IoT sensor network and ML-powered energy prediction platform Nexordis developed exceeded our expectations. We can now forecast energy consumption with 94% accuracy, helping our clients optimize their operations significantly.',
    rating: 5,
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Head of Engineering',
    company: 'CloudScale Inc.',
    content:
      'Nexordis built our entire DevOps pipeline and cloud infrastructure. Their expertise in container orchestration and CI/CD automation has enabled us to deploy 10x faster. The infrastructure is scalable, secure, and cost-effective.',
    rating: 5,
  },
  {
    id: 5,
    name: 'Lisa Anderson',
    role: 'VP of Innovation',
    company: 'MedTech Innovations',
    content:
      'Their embedded systems development for our medical devices was outstanding. The real-time control systems they created are reliable, efficient, and meet all regulatory requirements. Nexordis truly understands both hardware and software integration.',
    rating: 5,
  },
  {
    id: 6,
    name: 'James Thompson',
    role: 'Operations Manager',
    company: 'AutoManufacturing Co.',
    content:
      'The robotic automation system Nexordis implemented has revolutionized our production line. Their computer vision integration and robot control software have increased our precision by 60% while reducing manual labor costs. Exceptional work.',
    rating: 5,
  },
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000) // Change testimonial every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, testimonials.length])

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section id="testimonials" className="testimonials">
      <div className="testimonials__container">
        <div className="testimonials__header">
          <h2 className="testimonials__heading">Our Reviews</h2>
          <p className="testimonials__subtext">
            Don't just take our word for it. Here's what real clients are saying about Nexordis
          </p>
        </div>

        <div className="testimonials__carousel-wrapper">
          <button
            type="button"
            className="testimonials__nav-btn testimonials__nav-btn--prev"
            onClick={goToPrevious}
            aria-label="Previous testimonial"
          >
            <ChevronLeft />
          </button>

          <div className="testimonials__carousel">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial.id}
                className="testimonials__card"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="testimonials__rating">
                  {Array.from({ length: currentTestimonial.rating }).map((_, i) => (
                    <span key={i} className="testimonials__star">
                      ★
                    </span>
                  ))}
                </div>
                <p className="testimonials__content">"{currentTestimonial.content}"</p>
                <div className="testimonials__author">
                  <div className="testimonials__author-info">
                    <p className="testimonials__author-name">{currentTestimonial.name}</p>
                    <p className="testimonials__author-role">
                      {currentTestimonial.role}, {currentTestimonial.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            type="button"
            className="testimonials__nav-btn testimonials__nav-btn--next"
            onClick={goToNext}
            aria-label="Next testimonial"
          >
            <ChevronRight />
          </button>
        </div>

        <div className="testimonials__indicators">
          {testimonials.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`testimonials__indicator ${index === currentIndex ? 'testimonials__indicator--active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
