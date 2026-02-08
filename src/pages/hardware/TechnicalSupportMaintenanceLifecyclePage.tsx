import { Link } from 'react-router-dom'
import BlurText from '../../components/ui/BlurText'
import VerticalProgressBar from '../../components/ui/VerticalProgressBar'
import type { ProgressStep } from '../../components/ui/VerticalProgressBar'
import TiltedCard from '../../components/ui/TiltedCard'
import './HardwareServicePage.css'

const processSteps: ProgressStep[] = [
  {
    title: 'Initial Assessment',
    description: 'We assess your technical support needs, maintenance requirements, and lifecycle management goals. Our team evaluates your current infrastructure and identifies areas for improvement.',
  },
  {
    title: 'Service Plan Development',
    description: 'We develop a comprehensive service plan tailored to your needs, including support channels, maintenance schedules, and lifecycle management strategies. The plan addresses immediate needs and long-term goals.',
  },
  {
    title: 'Implementation & Setup',
    description: 'We implement support systems, establish maintenance protocols, and set up lifecycle tracking. Our team ensures all processes are properly configured and your team is trained on new procedures.',
  },
  {
    title: 'Ongoing Technical Support',
    description: 'We provide expert technical support through multiple channels including phone, email, and live chat. Our dedicated team resolves issues quickly and efficiently, minimizing downtime and disruption.',
  },
  {
    title: 'Proactive Maintenance',
    description: 'We conduct scheduled inspections, preventive maintenance, and system optimization. Our maintenance programs help extend equipment lifespan, prevent issues, and ensure peak performance.',
  },
  {
    title: 'Lifecycle Management',
    description: 'We manage the complete lifecycle from procurement to disposal, including planning, deployment, upgrades, and responsible retirement. Our approach maximizes value and ensures sustainable technology management.',
  },
]

export default function TechnicalSupportMaintenanceLifecyclePage() {
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
                text="Technical Support, Maintenance, and Life Cycle Services"
                delay={200}
                animateBy="words"
                direction="top"
                className="hardware-service-page__title-text"
              />
            </h1>
            <p className="hardware-service-page__description">
              Comprehensive technical support, proactive maintenance, and complete lifecycle management 
              services for your devices and equipment. We provide expert assistance, scheduled maintenance, 
              and end-to-end lifecycle solutions to maximize value and ensure sustainable technology management.
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
                      title="Expert Technical Support"
                      description="Our dedicated team provides technical support through multiple channels including phone, email, and live chat. We resolve issues quickly and efficiently to minimize downtime."
                      containerHeight="250px"
                      containerWidth="100%"
                      rotateAmplitude={8}
                      scaleOnHover={1.03}
                      showMobileWarning={false}
                      showTooltip={false}
                      displayOverlayContent={false}
                    />
                    <TiltedCard
                      title="Proactive Maintenance"
                      description="We offer scheduled inspections, preventive maintenance, repairs, and system optimization. Our maintenance programs extend equipment lifespan and minimize downtime."
                      containerHeight="250px"
                      containerWidth="100%"
                      rotateAmplitude={8}
                      scaleOnHover={1.03}
                      showMobileWarning={false}
                      showTooltip={false}
                      displayOverlayContent={false}
                    />
                    <TiltedCard
                      title="Lifecycle Management"
                      description="Complete lifecycle management from procurement to disposal. We provide planning, deployment, maintenance, upgrades, and responsible retirement of equipment."
                      containerHeight="250px"
                      containerWidth="100%"
                      rotateAmplitude={8}
                      scaleOnHover={1.03}
                      showMobileWarning={false}
                      showTooltip={false}
                      displayOverlayContent={false}
                    />
                    <TiltedCard
                      title="Comprehensive Solutions"
                      description="Our integrated approach combines technical support, maintenance, and lifecycle management into a seamless service that maximizes value and ensures sustainable operations."
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
              <h2 className="hardware-service-page__cta-title">Need Support & Maintenance?</h2>
              <p className="hardware-service-page__cta-description">
                Let's discuss your technical support, maintenance, and lifecycle management needs. Our team is ready to help you optimize your technology operations.
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
