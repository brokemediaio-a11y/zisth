import { Link } from 'react-router-dom'
import BlurText from '../../components/ui/BlurText'
import VerticalProgressBar from '../../components/ui/VerticalProgressBar'
import type { ProgressStep } from '../../components/ui/VerticalProgressBar'
import TiltedCard from '../../components/ui/TiltedCard'
import './HardwareServicePage.css'

const processSteps: ProgressStep[] = [
  {
    title: 'Part Identification',
    description: 'We help identify the exact parts needed for your devices. Our team analyzes your equipment specifications and requirements to determine the correct replacement components or upgrade parts.',
  },
  {
    title: 'Inventory Check & Availability',
    description: 'We check our extensive inventory of genuine and compatible parts to confirm availability. If a part is not in stock, we source it from trusted suppliers and provide accurate delivery timelines.',
  },
  {
    title: 'Quote & Order Processing',
    description: 'We provide detailed quotes with pricing, part numbers, and specifications. Once approved, we process your order efficiently, ensuring all parts meet quality standards and compatibility requirements.',
  },
  {
    title: 'Quality Verification',
    description: 'All parts undergo quality verification before shipping. We ensure genuine parts, proper packaging, and compatibility with your devices. Each order is carefully inspected to meet our quality standards.',
  },
  {
    title: 'Fast Shipping & Delivery',
    description: 'We coordinate fast shipping to your location with tracking information. For urgent needs, we offer expedited shipping options to minimize downtime and keep your operations running smoothly.',
  },
  {
    title: 'Installation Support',
    description: 'We provide installation guidance and support documentation. For complex installations, our technical team can assist remotely or on-site to ensure proper part integration and system functionality.',
  },
]

export default function DevicePartsPage() {
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
                text="Device Components and Replacement Parts"
                delay={200}
                animateBy="words"
                direction="top"
                className="hardware-service-page__title-text"
              />
            </h1>
            <p className="hardware-service-page__description">
              We supply genuine and compatible device components and replacement parts for a wide variety 
              of devices and equipment. Our extensive inventory includes replacement components, upgrade kits, 
              and accessories to keep your systems running smoothly. Fast shipping and quality assurance guaranteed.
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
                      title="Genuine Parts"
                      description="We stock genuine manufacturer parts and high-quality compatible alternatives for a wide range of devices, ensuring reliability and performance."
                      containerHeight="250px"
                      containerWidth="100%"
                      rotateAmplitude={8}
                      scaleOnHover={1.03}
                      showMobileWarning={false}
                      showTooltip={false}
                      displayOverlayContent={false}
                    />
                    <TiltedCard
                      title="Extensive Inventory"
                      description="Our comprehensive inventory covers replacement components, upgrade kits, batteries, cables, and accessories for various device types and brands."
                      containerHeight="250px"
                      containerWidth="100%"
                      rotateAmplitude={8}
                      scaleOnHover={1.03}
                      showMobileWarning={false}
                      showTooltip={false}
                      displayOverlayContent={false}
                    />
                    <TiltedCard
                      title="Fast Shipping"
                      description="We offer fast shipping options with tracking information. Expedited delivery available for urgent requirements to minimize your downtime."
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
                      description="All parts undergo quality verification before shipping. We ensure compatibility, proper packaging, and adherence to manufacturer specifications."
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
              <h2 className="hardware-service-page__cta-title">Need Replacement Parts?</h2>
              <p className="hardware-service-page__cta-description">
                Contact us to find the right parts for your devices. Our team is ready to help you identify and source the components you need.
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
