import { useState } from 'react'
import { Link } from 'react-router-dom'
import BlurText from '../ui/BlurText'
import ToggleSwitch from '../ui/ToggleSwitch'
import type { PortfolioItem, PortfolioCategory } from '../../types/portfolio'
import './PortfolioList.css'

// Demo portfolio data
const portfolioItems: PortfolioItem[] = [
  // Hardware Projects
  {
    id: 'device-sales-1',
    title: 'Enterprise Device Sales Program',
    description: 'Comprehensive device sales solution for enterprise clients, including consultation, procurement, and deployment services.',
    category: 'Hardware',
    featuredImage: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=600&fit=crop',
    technologies: ['Device Procurement', 'Enterprise Solutions', 'Deployment'],
    year: '2024',
  },
  {
    id: 'device-components-1',
    title: 'Component Replacement System',
    description: 'Streamlined component and replacement parts service with inventory management and fast delivery solutions.',
    category: 'Hardware',
    featuredImage: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop',
    technologies: ['Component Management', 'Inventory Systems', 'Logistics'],
    year: '2024',
  },
  {
    id: 'device-rental-1',
    title: 'Device Rental Platform',
    description: 'Flexible device rental and deployment programs for short-term and long-term business needs with full support.',
    category: 'Hardware',
    featuredImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    technologies: ['Rental Management', 'Deployment Services', 'Support Systems'],
    year: '2023',
  },
  {
    id: 'technical-support-1',
    title: 'Lifecycle Management Service',
    description: 'Complete technical support, maintenance, and lifecycle services ensuring optimal device performance throughout their lifespan.',
    category: 'Hardware',
    featuredImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
    technologies: ['Maintenance', 'Support Systems', 'Lifecycle Management'],
    year: '2024',
  },
  {
    id: 'hardware-integration-1',
    title: 'Hardware Integration Solution',
    description: 'Seamless integration of hardware components with existing enterprise infrastructure and software systems.',
    category: 'Hardware',
    featuredImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
    technologies: ['System Integration', 'Enterprise Hardware', 'Infrastructure'],
    year: '2023',
  },
  // Software Projects
  {
    id: 'ai-platform-1',
    title: 'AI-Powered Analytics Platform',
    description: 'Advanced machine learning platform for predictive analytics and real-time decision support in enterprise environments.',
    category: 'Software',
    featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
    technologies: ['Machine Learning', 'Python', 'TensorFlow', 'React'],
    year: '2024',
  },
  {
    id: 'web-app-1',
    title: 'Enterprise Web Application',
    description: 'Modern full-stack web application with responsive design, real-time updates, and scalable architecture for business operations.',
    category: 'Software',
    featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    technologies: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
    year: '2024',
  },
  {
    id: 'mobile-app-1',
    title: 'Mobile Business Application',
    description: 'Cross-platform mobile application for business management with offline capabilities and cloud synchronization.',
    category: 'Software',
    featuredImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
    technologies: ['React Native', 'TypeScript', 'Firebase', 'Redux'],
    year: '2023',
  },
  {
    id: 'automation-system-1',
    title: 'Workflow Automation System',
    description: 'Intelligent automation system that streamlines business processes, reduces manual work, and improves efficiency.',
    category: 'Software',
    featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    technologies: ['Python', 'Django', 'Celery', 'Redis'],
    year: '2024',
  },
  {
    id: 'data-platform-1',
    title: 'Data Analytics Platform',
    description: 'Comprehensive data analytics and visualization platform for business intelligence and data-driven decision making.',
    category: 'Software',
    featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    technologies: ['Python', 'Pandas', 'D3.js', 'PostgreSQL'],
    year: '2023',
  },
  {
    id: 'cloud-service-1',
    title: 'Cloud Infrastructure Solution',
    description: 'Scalable cloud-based infrastructure solution with microservices architecture and container orchestration.',
    category: 'Software',
    featuredImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
    technologies: ['AWS', 'Docker', 'Kubernetes', 'Node.js'],
    year: '2024',
  },
]

export default function PortfolioList() {
  const [selectedCategory, setSelectedCategory] = useState<PortfolioCategory>('Hardware')
  const isHardware = selectedCategory === 'Hardware'

  const handleToggle = (value: boolean) => {
    setSelectedCategory(value ? 'Hardware' : 'Software')
  }

  const filteredItems = portfolioItems.filter(
    (item) => item.category === selectedCategory
  )

  return (
    <div className="portfolio-list">
      <div className="portfolio-list__container">
        <header className="portfolio-list__header">
          <h1 className="portfolio-list__title">
            <BlurText
              text="OUR WORK"
              delay={200}
              animateBy="words"
              direction="top"
              className="portfolio-list__title-text"
            />
          </h1>
          <p className="portfolio-list__subtitle">
            Explore our portfolio of hardware and software solutions
          </p>
        </header>

        <div className="portfolio-list__toggle-wrapper">
          <ToggleSwitch
            value={isHardware}
            onChange={handleToggle}
            leftLabel="Software"
            rightLabel="Hardware"
          />
        </div>

        {filteredItems.length === 0 ? (
          <div className="portfolio-list__empty">
            <p>No portfolio items found in this category.</p>
          </div>
        ) : (
          <div className="portfolio-list__grid">
            {filteredItems.map((item) => (
              <Link
                key={item.id}
                to={`/portfolio/${item.id}`}
                className="portfolio-card"
              >
                <div className="portfolio-card__image-wrapper">
                  <img
                    src={item.featuredImage}
                    alt={item.title}
                    className="portfolio-card__image"
                    loading="lazy"
                  />
                </div>
                <div className="portfolio-card__content">
                  <div className="portfolio-card__meta">
                    <span className="portfolio-card__category">{item.category}</span>
                    {item.year && (
                      <span className="portfolio-card__year">{item.year}</span>
                    )}
                  </div>
                  <h2 className="portfolio-card__title">{item.title}</h2>
                  <p className="portfolio-card__description">{item.description}</p>
                  {item.technologies && item.technologies.length > 0 && (
                    <div className="portfolio-card__technologies">
                      {item.technologies.slice(0, 3).map((tech) => (
                        <span key={tech} className="portfolio-card__tech">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
