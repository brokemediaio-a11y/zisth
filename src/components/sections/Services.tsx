import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { 
  Bot, 
  Brain, 
  Briefcase, 
  Globe, 
  Smartphone, 
  Cloud,
  ShoppingCart,
  Package,
  Handshake,
  Headphones,
  Wrench,
  RefreshCw
} from 'lucide-react'
import ToggleSwitch from '../ui/ToggleSwitch'
import ServiceNavigation from './ServiceNavigation'
import ServiceCard from './ServiceCard'
import './Services.css'

// Dummy data for Software Services
const softwareServices = [
  {
    id: 'agentic-ai',
    title: 'AGENTIC AI',
    description: 'WE BUILD INTELLIGENT AUTONOMOUS AGENTS THAT CAN REASON, PLAN, AND EXECUTE COMPLEX TASKS. FROM MULTI-AGENT SYSTEMS TO CONVERSATIONAL AI ASSISTANTS, WE CREATE AI SOLUTIONS THAT UNDERSTAND CONTEXT, LEARN FROM INTERACTIONS, AND ADAPT TO DYNAMIC ENVIRONMENTS.',
    icon: Bot,
  },
  {
    id: 'machine-learning',
    title: 'ML & AI DEVELOPMENT',
    description: 'WE BUILD AND TRAIN CUSTOM MACHINE LEARNING AND AI MODELS FOR BUSINESS-SPECIFIC INTELLIGENCE AND AUTOMATION. FROM PREDICTIVE ANALYTICS AND FORECASTING SYSTEMS TO NLP AND COMPUTER VISION, WE ALSO DELIVER AI-POWERED WEB AND MOBILE APPLICATIONS — SUCH AS DATA-DRIVEN PLATFORMS FOR ENERGY PREDICTION, PERFORMANCE ANALYSIS, AND REAL-TIME DECISION SUPPORT POWERED BY ML MODELS.',
    icon: Brain,
  },
  {
    id: 'business-software',
    title: 'BUSINESS SOFTWARE DEVELOPMENT',
    description: 'WE DEVELOP CUSTOM SOFTWARE SOLUTIONS TAILORED TO YOUR BUSINESS NEEDS. FROM ENTERPRISE APPLICATIONS TO WORKFLOW AUTOMATION TOOLS, WE CREATE SCALABLE, SECURE, AND USER-FRIENDLY SOFTWARE THAT STREAMLINES OPERATIONS AND DRIVES GROWTH.',
    icon: Briefcase,
  },
  {
    id: 'web-development',
    title: 'WEB DEVELOPMENT',
    description: 'WE CREATE MODERN, RESPONSIVE WEB APPLICATIONS WITH CUTTING-EDGE TECHNOLOGIES. FROM SINGLE-PAGE APPLICATIONS TO FULL-STACK PLATFORMS, WE DELIVER HIGH-PERFORMANCE, SCALABLE WEB SOLUTIONS THAT PROVIDE EXCEPTIONAL USER EXPERIENCES.',
    icon: Globe,
  },
  {
    id: 'mobile-app',
    title: 'MOBILE APP DEVELOPMENT',
    description: 'WE BUILD NATIVE AND CROSS-PLATFORM MOBILE APPLICATIONS FOR iOS AND ANDROID. FROM CONCEPT TO DEPLOYMENT, WE CREATE INTUITIVE, PERFORMANT MOBILE APPS THAT ENGAGE USERS AND DELIVER MEASURABLE BUSINESS VALUE.',
    icon: Smartphone,
  },
  {
    id: 'devops-cloud',
    title: 'DEVOPS',
    description: 'WE DESIGN AND IMPLEMENT ROBUST CLOUD INFRASTRUCTURE AND DEVOPS PIPELINES THAT ENABLE RAPID, RELIABLE DEPLOYMENTS. FROM CI/CD AUTOMATION TO CONTAINER ORCHESTRATION AND INFRASTRUCTURE AS CODE, WE HELP YOU ACHIEVE SCALABILITY, SECURITY, AND OPERATIONAL EXCELLENCE.',
    icon: Cloud,
  },
]

// Dummy data for Hardware Services
const hardwareServices = [
  {
    id: 'device-sales',
    title: 'DEVICE SALES',
    description: 'WE OFFER A COMPREHENSIVE RANGE OF HIGH-QUALITY DEVICES AND EQUIPMENT TO MEET YOUR BUSINESS NEEDS. FROM CUTTING-EDGE TECHNOLOGY SOLUTIONS TO SPECIALIZED HARDWARE, WE PROVIDE RELIABLE PRODUCTS WITH COMPETITIVE PRICING AND EXPERT GUIDANCE TO HELP YOU MAKE THE RIGHT CHOICE FOR YOUR ORGANIZATION.',
    icon: ShoppingCart,
  },
  {
    id: 'device-parts',
    title: 'DEVICE PARTS',
    description: 'WE SUPPLY GENUINE AND COMPATIBLE PARTS FOR A WIDE VARIETY OF DEVICES AND EQUIPMENT. OUR EXTENSIVE INVENTORY INCLUDES REPLACEMENT COMPONENTS, UPGRADE KITS, AND ACCESSORIES TO KEEP YOUR SYSTEMS RUNNING SMOOTHLY. FAST SHIPPING AND QUALITY ASSURANCE GUARANTEED.',
    icon: Package,
  },
  {
    id: 'device-rental',
    title: 'DEVICE RENTAL',
    description: 'FLEXIBLE RENTAL SOLUTIONS FOR SHORT-TERM PROJECTS, EVENTS, OR TRIAL PERIODS. WE OFFER A DIVERSE FLEET OF MODERN DEVICES AND EQUIPMENT WITH COMPREHENSIVE SUPPORT. PERFECT FOR BUSINESSES THAT NEED TEMPORARY ACCESS TO TECHNOLOGY WITHOUT THE COMMITMENT OF PURCHASE.',
    icon: Handshake,
  },
  {
    id: 'technical-support',
    title: 'TECHNICAL SUPPORT',
    description: 'EXPERT TECHNICAL SUPPORT TO RESOLVE ISSUES QUICKLY AND EFFICIENTLY. OUR DEDICATED TEAM PROVIDES REMOTE ASSISTANCE, TROUBLESHOOTING, AND GUIDANCE TO HELP YOU GET THE MOST OUT OF YOUR DEVICES. AVAILABLE THROUGH MULTIPLE CHANNELS INCLUDING PHONE, EMAIL, AND LIVE CHAT.',
    icon: Headphones,
  },
  {
    id: 'maintenance',
    title: 'MAINTENANCE',
    description: 'PROACTIVE MAINTENANCE SERVICES TO ENSURE YOUR DEVICES OPERATE AT PEAK PERFORMANCE. WE OFFER SCHEDULED INSPECTIONS, PREVENTIVE MAINTENANCE, REPAIRS, AND SYSTEM OPTIMIZATION. OUR MAINTENANCE PROGRAMS HELP EXTEND EQUIPMENT LIFESPAN AND MINIMIZE DOWNTIME.',
    icon: Wrench,
  },
  {
    id: 'lifecycle-services',
    title: 'LIFE CYCLE SERVICES',
    description: 'COMPREHENSIVE LIFECYCLE MANAGEMENT FROM PROCUREMENT TO DISPOSAL. WE PROVIDE END-TO-END SERVICES INCLUDING PLANNING, DEPLOYMENT, MAINTENANCE, UPGRADES, AND RESPONSIBLE RETIREMENT OF EQUIPMENT. OUR LIFECYCLE APPROACH MAXIMIZES VALUE AND ENSURES SUSTAINABLE TECHNOLOGY MANAGEMENT.',
    icon: RefreshCw,
  },
]

export default function Services() {
  const [isHardware, setIsHardware] = useState(false)
  const [activeServiceId, setActiveServiceId] = useState(
    isHardware ? hardwareServices[0].id : softwareServices[0].id
  )

  const currentServices = isHardware ? hardwareServices : softwareServices
  const activeService = currentServices.find((s) => s.id === activeServiceId) || currentServices[0]

  // Update active service when switching between Software/Hardware
  const handleToggle = (value: boolean) => {
    setIsHardware(value)
    const newServices = value ? hardwareServices : softwareServices
    setActiveServiceId(newServices[0].id)
  }

  return (
    <section className="services" id="services">
      <div className="services__container">
        <h2 className="services__heading">Our Services</h2>

        <div className="services__toggle-wrapper">
          <ToggleSwitch
            value={isHardware}
            onChange={handleToggle}
            leftLabel="Software Services"
            rightLabel="Hardware Services"
          />
        </div>

        <div className="services__content">
          <ServiceNavigation
            services={currentServices}
            activeId={activeServiceId}
            onSelect={setActiveServiceId}
          />

          <AnimatePresence mode="wait">
            <ServiceCard
              key={activeServiceId}
              service={activeService}
            />
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
