import { Link } from 'react-router-dom'
import BlurText from '../../components/ui/BlurText'
import VerticalProgressBar from '../../components/ui/VerticalProgressBar'
import type { ProgressStep } from '../../components/ui/VerticalProgressBar'
import TiltedCard from '../../components/ui/TiltedCard'
import './HardwareServicePage.css'

const processSteps: ProgressStep[] = [
  {
    title: 'Requirements Assessment',
    description: 'We assess your rental needs including device types, quantities, duration, and specific requirements. Our team helps determine the optimal rental solution for your project or event.',
  },
  {
    title: 'Device Selection & Configuration',
    description: 'We select appropriate devices from our diverse fleet and configure them according to your specifications. All devices are tested and prepared for immediate deployment.',
  },
  {
    title: 'Rental Agreement & Terms',
    description: 'We provide a clear rental agreement with flexible terms, pricing, and duration options. Our agreements are designed to accommodate short-term projects, events, or trial periods.',
  },
  {
    title: 'Delivery & Deployment',
    description: 'We coordinate delivery to your location and assist with device setup and deployment. Our team ensures everything is configured correctly and ready for use upon arrival.',
  },
  {
    title: 'Ongoing Support During Rental',
    description: 'We provide comprehensive support throughout the rental period, including technical assistance, troubleshooting, and device management. Our team is available to address any issues promptly.',
  },
  {
    title: 'Collection & Return',
    description: 'At the end of the rental period, we coordinate device collection. We handle all logistics, including data wiping and device inspection, ensuring a smooth return process.',
  },
]

export default function DeviceRentalPage() {
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
                text="Device Rental and Deployment Programs"
                delay={200}
                animateBy="words"
                direction="top"
                className="hardware-service-page__title-text"
              />
            </h1>
            <p className="hardware-service-page__description">
              Flexible device rental and deployment programs for short-term projects, events, or trial periods. 
              We offer a diverse fleet of modern devices and equipment with comprehensive support and full deployment 
              services. Perfect for businesses that need temporary access to technology without the commitment of purchase.
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
                      title="Flexible Rental Terms"
                      description="We offer flexible rental periods from days to months, with customizable terms to suit your project timeline and budget requirements."
                      containerHeight="250px"
                      containerWidth="100%"
                      rotateAmplitude={8}
                      scaleOnHover={1.03}
                      showMobileWarning={false}
                      showTooltip={false}
                      displayOverlayContent={false}
                    />
                    <TiltedCard
                      title="Diverse Device Fleet"
                      description="Our fleet includes the latest devices across various categories - desktops, laptops, tablets, smartphones, and specialized equipment for different use cases."
                      containerHeight="250px"
                      containerWidth="100%"
                      rotateAmplitude={8}
                      scaleOnHover={1.03}
                      showMobileWarning={false}
                      showTooltip={false}
                      displayOverlayContent={false}
                    />
                    <TiltedCard
                      title="Full Deployment Support"
                      description="We handle delivery, setup, configuration, and deployment. Our team ensures devices are ready for immediate use with all necessary configurations applied."
                      containerHeight="250px"
                      containerWidth="100%"
                      rotateAmplitude={8}
                      scaleOnHover={1.03}
                      showMobileWarning={false}
                      showTooltip={false}
                      displayOverlayContent={false}
                    />
                    <TiltedCard
                      title="Comprehensive Support"
                      description="Throughout the rental period, we provide technical support, troubleshooting, and device management to ensure smooth operations and minimal downtime."
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
              <h2 className="hardware-service-page__cta-title">Ready to Rent Devices?</h2>
              <p className="hardware-service-page__cta-description">
                Let's discuss your rental needs and find the perfect solution for your project or event.
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
