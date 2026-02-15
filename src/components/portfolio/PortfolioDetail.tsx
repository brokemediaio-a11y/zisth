import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import type { PortfolioItem } from '../../types/portfolio'
import './PortfolioDetail.css'

// Import the same demo data (in a real app, this would come from an API or storage)
const portfolioItems: PortfolioItem[] = [
  {
    id: 'device-sales-1',
    title: 'Enterprise Device Sales Program',
    description: 'Comprehensive device sales solution for enterprise clients, including consultation, procurement, and deployment services.',
    category: 'Hardware',
    featuredImage: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=600&fit=crop',
    content: `
      <h2>Overview</h2>
      <p>Our Enterprise Device Sales Program provides end-to-end solutions for businesses looking to equip their teams with the latest hardware technology. We work closely with clients to understand their specific needs and deliver tailored device solutions.</p>
      
      <h2>Key Features</h2>
      <ul>
        <li>Comprehensive consultation and needs assessment</li>
        <li>Wide range of enterprise-grade devices</li>
        <li>Bulk procurement with competitive pricing</li>
        <li>Professional deployment and setup services</li>
        <li>Ongoing support and maintenance options</li>
      </ul>
      
      <h2>Services Included</h2>
      <p>Device sales, consultation, procurement, deployment, and support services designed to meet enterprise requirements.</p>
    `,
    technologies: ['Device Procurement', 'Enterprise Solutions', 'Deployment'],
    year: '2024',
  },
  {
    id: 'device-components-1',
    title: 'Component Replacement System',
    description: 'Streamlined component and replacement parts service with inventory management and fast delivery solutions.',
    category: 'Hardware',
    featuredImage: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop',
    content: `
      <h2>Overview</h2>
      <p>Our Component Replacement System ensures businesses have access to genuine replacement parts and components when needed. We maintain extensive inventory and provide fast delivery services.</p>
      
      <h2>Key Features</h2>
      <ul>
        <li>Extensive inventory of genuine components</li>
        <li>Fast delivery and logistics support</li>
        <li>Compatibility verification services</li>
        <li>Technical support for component installation</li>
        <li>Warranty and quality assurance</li>
      </ul>
      
      <h2>Services Included</h2>
      <p>Component sales, inventory management, fast delivery, compatibility verification, and technical support.</p>
    `,
    technologies: ['Component Management', 'Inventory Systems', 'Logistics'],
    year: '2024',
  },
  {
    id: 'device-rental-1',
    title: 'Device Rental Platform',
    description: 'Flexible device rental and deployment programs for short-term and long-term business needs with full support.',
    category: 'Hardware',
    featuredImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    content: `
      <h2>Overview</h2>
      <p>Our Device Rental Platform offers flexible rental solutions for businesses that need temporary or project-based device access. Perfect for events, short-term projects, or testing new technology.</p>
      
      <h2>Key Features</h2>
      <ul>
        <li>Flexible rental terms (daily, weekly, monthly)</li>
        <li>Wide selection of devices available</li>
        <li>Professional deployment and setup</li>
        <li>Full technical support during rental period</li>
        <li>Easy return and pickup services</li>
      </ul>
      
      <h2>Services Included</h2>
      <p>Device rental, deployment programs, setup services, technical support, and return management.</p>
    `,
    technologies: ['Rental Management', 'Deployment Services', 'Support Systems'],
    year: '2023',
  },
  {
    id: 'technical-support-1',
    title: 'Lifecycle Management Service',
    description: 'Complete technical support, maintenance, and lifecycle services ensuring optimal device performance throughout their lifespan.',
    category: 'Hardware',
    featuredImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
    content: `
      <h2>Overview</h2>
      <p>Our Lifecycle Management Service provides comprehensive support throughout the entire lifespan of your devices, from initial deployment to end-of-life management.</p>
      
      <h2>Key Features</h2>
      <ul>
        <li>Proactive maintenance and monitoring</li>
        <li>24/7 technical support</li>
        <li>Regular health checks and updates</li>
        <li>End-of-life planning and device replacement</li>
        <li>Performance optimization services</li>
      </ul>
      
      <h2>Services Included</h2>
      <p>Technical support, maintenance services, lifecycle management, performance optimization, and end-of-life planning.</p>
    `,
    technologies: ['Maintenance', 'Support Systems', 'Lifecycle Management'],
    year: '2024',
  },
  {
    id: 'hardware-integration-1',
    title: 'Hardware Integration Solution',
    description: 'Seamless integration of hardware components with existing enterprise infrastructure and software systems.',
    category: 'Hardware',
    featuredImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
    content: `
      <h2>Overview</h2>
      <p>Our Hardware Integration Solution ensures new hardware components work seamlessly with your existing infrastructure and software systems.</p>
      
      <h2>Key Features</h2>
      <ul>
        <li>Compatibility assessment and planning</li>
        <li>Seamless integration with existing systems</li>
        <li>Minimal downtime deployment</li>
        <li>Comprehensive testing and validation</li>
        <li>Ongoing integration support</li>
      </ul>
      
      <h2>Services Included</h2>
      <p>System integration, infrastructure planning, deployment services, testing, and validation.</p>
    `,
    technologies: ['System Integration', 'Enterprise Hardware', 'Infrastructure'],
    year: '2023',
  },
  {
    id: 'ai-platform-1',
    title: 'AI-Powered Analytics Platform',
    description: 'Advanced machine learning platform for predictive analytics and real-time decision support in enterprise environments.',
    category: 'Software',
    featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
    content: `
      <h2>Overview</h2>
      <p>Our AI-Powered Analytics Platform leverages advanced machine learning algorithms to provide predictive insights and real-time decision support for enterprise operations.</p>
      
      <h2>Key Features</h2>
      <ul>
        <li>Advanced machine learning models</li>
        <li>Real-time analytics and insights</li>
        <li>Predictive analytics capabilities</li>
        <li>Customizable dashboards and reports</li>
        <li>Scalable cloud infrastructure</li>
      </ul>
      
      <h2>Technologies Used</h2>
      <p>Built with Python, TensorFlow, React, and modern cloud technologies for maximum performance and scalability.</p>
    `,
    technologies: ['Machine Learning', 'Python', 'TensorFlow', 'React'],
    year: '2024',
  },
  {
    id: 'web-app-1',
    title: 'Enterprise Web Application',
    description: 'Modern full-stack web application with responsive design, real-time updates, and scalable architecture for business operations.',
    category: 'Software',
    featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    content: `
      <h2>Overview</h2>
      <p>Our Enterprise Web Application provides a comprehensive solution for business operations with modern design, real-time capabilities, and scalable architecture.</p>
      
      <h2>Key Features</h2>
      <ul>
        <li>Responsive design for all devices</li>
        <li>Real-time updates and notifications</li>
        <li>Scalable microservices architecture</li>
        <li>Secure authentication and authorization</li>
        <li>Comprehensive API integration</li>
      </ul>
      
      <h2>Technologies Used</h2>
      <p>Built with React, Node.js, TypeScript, and PostgreSQL for robust performance and reliability.</p>
    `,
    technologies: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
    year: '2024',
  },
  {
    id: 'mobile-app-1',
    title: 'Mobile Business Application',
    description: 'Cross-platform mobile application for business management with offline capabilities and cloud synchronization.',
    category: 'Software',
    featuredImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
    content: `
      <h2>Overview</h2>
      <p>Our Mobile Business Application provides a comprehensive mobile solution for business management with offline capabilities and seamless cloud synchronization.</p>
      
      <h2>Key Features</h2>
      <ul>
        <li>Cross-platform compatibility (iOS & Android)</li>
        <li>Offline functionality</li>
        <li>Cloud synchronization</li>
        <li>Intuitive user interface</li>
        <li>Real-time collaboration features</li>
      </ul>
      
      <h2>Technologies Used</h2>
      <p>Built with React Native, TypeScript, Firebase, and Redux for a seamless mobile experience.</p>
    `,
    technologies: ['React Native', 'TypeScript', 'Firebase', 'Redux'],
    year: '2023',
  },
  {
    id: 'automation-system-1',
    title: 'Workflow Automation System',
    description: 'Intelligent automation system that streamlines business processes, reduces manual work, and improves efficiency.',
    category: 'Software',
    featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    content: `
      <h2>Overview</h2>
      <p>Our Workflow Automation System intelligently automates business processes, reducing manual work and significantly improving operational efficiency.</p>
      
      <h2>Key Features</h2>
      <ul>
        <li>Intelligent process automation</li>
        <li>Customizable workflow builder</li>
        <li>Integration with existing systems</li>
        <li>Real-time monitoring and analytics</li>
        <li>Error handling and recovery</li>
      </ul>
      
      <h2>Technologies Used</h2>
      <p>Built with Python, Django, Celery, and Redis for robust automation capabilities.</p>
    `,
    technologies: ['Python', 'Django', 'Celery', 'Redis'],
    year: '2024',
  },
  {
    id: 'data-platform-1',
    title: 'Data Analytics Platform',
    description: 'Comprehensive data analytics and visualization platform for business intelligence and data-driven decision making.',
    category: 'Software',
    featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    content: `
      <h2>Overview</h2>
      <p>Our Data Analytics Platform provides comprehensive tools for business intelligence, data visualization, and data-driven decision making.</p>
      
      <h2>Key Features</h2>
      <ul>
        <li>Advanced data processing and analysis</li>
        <li>Interactive visualizations and dashboards</li>
        <li>Real-time data streaming</li>
        <li>Custom report generation</li>
        <li>Data export and sharing capabilities</li>
      </ul>
      
      <h2>Technologies Used</h2>
      <p>Built with Python, Pandas, D3.js, and PostgreSQL for powerful data analytics capabilities.</p>
    `,
    technologies: ['Python', 'Pandas', 'D3.js', 'PostgreSQL'],
    year: '2023',
  },
  {
    id: 'cloud-service-1',
    title: 'Cloud Infrastructure Solution',
    description: 'Scalable cloud-based infrastructure solution with microservices architecture and container orchestration.',
    category: 'Software',
    featuredImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
    content: `
      <h2>Overview</h2>
      <p>Our Cloud Infrastructure Solution provides scalable, reliable cloud-based infrastructure with microservices architecture and container orchestration.</p>
      
      <h2>Key Features</h2>
      <ul>
        <li>Scalable microservices architecture</li>
        <li>Container orchestration with Kubernetes</li>
        <li>Auto-scaling and load balancing</li>
        <li>High availability and disaster recovery</li>
        <li>Comprehensive monitoring and logging</li>
      </ul>
      
      <h2>Technologies Used</h2>
      <p>Built with AWS, Docker, Kubernetes, and Node.js for enterprise-grade cloud infrastructure.</p>
    `,
    technologies: ['AWS', 'Docker', 'Kubernetes', 'Node.js'],
    year: '2024',
  },
]

export default function PortfolioDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [shareSuccess, setShareSuccess] = useState(false)

  const portfolioItem = portfolioItems.find((item) => item.id === id)

  if (!portfolioItem) {
    navigate('/portfolio')
    return null
  }

  const handleShare = async () => {
    const portfolioUrl = `${window.location.origin}/portfolio/${id}`
    const shareData = {
      title: portfolioItem.title,
      text: portfolioItem.description || '',
      url: portfolioUrl,
    }

    try {
      // Try Web Share API first (works on mobile and some desktop browsers)
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
        setShareSuccess(true)
        setTimeout(() => setShareSuccess(false), 2000)
      } else {
        // Fallback to copy to clipboard
        await navigator.clipboard.writeText(portfolioUrl)
        setShareSuccess(true)
        setTimeout(() => setShareSuccess(false), 2000)
      }
    } catch (error: any) {
      // If user cancels share, don't show error
      if (error.name !== 'AbortError') {
        // Fallback to copy to clipboard if share fails
        try {
          await navigator.clipboard.writeText(portfolioUrl)
          setShareSuccess(true)
          setTimeout(() => setShareSuccess(false), 2000)
        } catch (clipboardError) {
          console.error('Failed to copy link:', clipboardError)
        }
      }
    }
  }

  return (
    <div className="portfolio-detail">
      <div className="portfolio-detail__container">
        <Link to="/portfolio" className="portfolio-detail__back">
          ← Back to Portfolio
        </Link>

        <article className="portfolio-detail__article">
          <header className="portfolio-detail__header">
            <div className="portfolio-detail__meta">
              <div className="portfolio-detail__meta-left">
                <span className="portfolio-detail__category">{portfolioItem.category}</span>
                {portfolioItem.year && (
                  <span className="portfolio-detail__year">{portfolioItem.year}</span>
                )}
              </div>
              <button
                className="portfolio-detail__share-button"
                onClick={handleShare}
                aria-label="Share portfolio item"
                title="Share this portfolio item"
              >
                <svg
                  className="portfolio-detail__share-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"
                    fill="currentColor"
                  />
                </svg>
                {shareSuccess && (
                  <span className="portfolio-detail__share-success">Link copied!</span>
                )}
              </button>
            </div>
            <h1 className="portfolio-detail__title">{portfolioItem.title}</h1>
            <p className="portfolio-detail__description">{portfolioItem.description}</p>
          </header>

          {portfolioItem.featuredImage && (
            <div className="portfolio-detail__image-wrapper">
              <img
                src={portfolioItem.featuredImage}
                alt={portfolioItem.title}
                className="portfolio-detail__image"
              />
            </div>
          )}

          {portfolioItem.technologies && portfolioItem.technologies.length > 0 && (
            <div className="portfolio-detail__technologies">
              <h3 className="portfolio-detail__technologies-title">Technologies</h3>
              <div className="portfolio-detail__technologies-list">
                {portfolioItem.technologies.map((tech) => (
                  <span key={tech} className="portfolio-detail__tech">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {portfolioItem.content && (
            <div
              className="portfolio-detail__content"
              dangerouslySetInnerHTML={{ __html: portfolioItem.content }}
            />
          )}
        </article>
      </div>
    </div>
  )
}
