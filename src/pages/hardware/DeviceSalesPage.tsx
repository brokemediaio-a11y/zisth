import { Link } from 'react-router-dom'
import BlurText from '../../components/ui/BlurText'
import VerticalProgressBar from '../../components/ui/VerticalProgressBar'
import type { ProgressStep } from '../../components/ui/VerticalProgressBar'
import TiltedCard from '../../components/ui/TiltedCard'
import './HardwareServicePage.css'

const processSteps: ProgressStep[] = [
  {
    title: 'Needs Assessment',
    description: 'We begin by understanding your business requirements, budget constraints, and specific device needs. Our team conducts a thorough assessment to identify the optimal hardware solutions for your organization.',
  },
  {
    title: 'Product Selection & Consultation',
    description: 'Based on your needs, we recommend the best devices from our comprehensive catalog. Our experts provide detailed consultations, comparing features, specifications, and pricing to help you make informed decisions.',
  },
  {
    title: 'Quote & Proposal',
    description: 'We prepare a detailed quote with competitive pricing, including bulk discounts where applicable. The proposal outlines all selected devices, specifications, warranties, and support options.',
  },
  {
    title: 'Order Processing',
    description: 'Once approved, we process your order efficiently, handling procurement, quality checks, and inventory management. We keep you informed throughout the process with regular updates.',
  },
  {
    title: 'Delivery & Deployment',
    description: 'We coordinate delivery to your location and can assist with device setup, configuration, and initial deployment. Our team ensures everything is ready for immediate use.',
  },
  {
    title: 'Ongoing Support',
    description: 'After delivery, we provide ongoing support including warranty services, technical assistance, and device management. We remain your partner for future hardware needs and upgrades.',
  },
]

export default function DeviceSalesPage() {
  return (
    <div className="hardware-service-page">
      <div className="hardware-service-page__container">
        <Link to="/" className="hardware-service-page__back" onClick={(e) => {
          e.preventDefault()
          window.location.href = '/#services'
        }}>
          ← Back to Services
        </Link>

        <article className="hardware-service-page__article">
          <header className="hardware-service-page__header">
            <h1 className="hardware-service-page__title">
              <BlurText
                text="Device Sales"
                delay={200}
                animateBy="words"
                direction="top"
                className="hardware-service-page__title-text"
              />
            </h1>
            <p className="hardware-service-page__description">
              We offer a comprehensive range of high-quality devices and equipment to meet your business needs. 
              From cutting-edge technology solutions to specialized hardware, we provide reliable products with 
              competitive pricing and expert guidance to help you make the right choice for your organization.
            </p>
          </header>

          <div className="hardware-service-page__content">
            <div className="hardware-service-page__main">
              <aside className="hardware-service-page__sidebar">
                <h2 className="hardware-service-page__section-title">Our Process</h2>
                <VerticalProgressBar steps={processSteps} />
              </aside>

              <div className="hardware-service-page__main-content">
                <section className="hardware-service-page__section">
                  <h2 className="hardware-service-page__section-title">What We Offer</h2>
                  <div className="hardware-service-page__features">
                    <TiltedCard
                      title="Wide Product Range"
                      description="Access to an extensive catalog of devices from leading manufacturers, including desktops, laptops, tablets, smartphones, and specialized equipment."
                      containerHeight="250px"
                      containerWidth="100%"
                      rotateAmplitude={8}
                      scaleOnHover={1.03}
                      showMobileWarning={false}
                      showTooltip={false}
                      displayOverlayContent={false}
                    />
                    <TiltedCard
                      title="Expert Consultation"
                      description="Our team provides personalized guidance to help you select the right devices based on your specific requirements, budget, and use cases."
                      containerHeight="250px"
                      containerWidth="100%"
                      rotateAmplitude={8}
                      scaleOnHover={1.03}
                      showMobileWarning={false}
                      showTooltip={false}
                      displayOverlayContent={false}
                    />
                    <TiltedCard
                      title="Competitive Pricing"
                      description="We offer competitive pricing with bulk discounts for large orders, ensuring you get the best value for your investment."
                      containerHeight="250px"
                      containerWidth="100%"
                      rotateAmplitude={8}
                      scaleOnHover={1.03}
                      showMobileWarning={false}
                      showTooltip={false}
                      displayOverlayContent={false}
                    />
                    <TiltedCard
                      title="Quality Assurance"
                      description="All devices come with manufacturer warranties and our quality guarantee, ensuring reliable performance and peace of mind."
                      containerHeight="250px"
                      containerWidth="100%"
                      rotateAmplitude={8}
                      scaleOnHover={1.03}
                      showMobileWarning={false}
                      showTooltip={false}
                      displayOverlayContent={false}
                    />
                  </div>
                </section>
              </div>
            </div>
          </div>

          <div className="hardware-service-page__cta">
            <div className="hardware-service-page__cta-content">
              <h2 className="hardware-service-page__cta-title">Ready to Get Started?</h2>
              <p className="hardware-service-page__cta-description">
                Let's discuss your device needs and find the perfect hardware solutions for your business.
              </p>
              <Link to="/contact" className="hardware-service-page__cta-button">
                Book a Consultation
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
