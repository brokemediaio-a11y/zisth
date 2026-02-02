import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
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
    icon: '🤖',
  },
  {
    id: 'machine-learning',
    title: 'MACHINE LEARNING & AI DEVELOPMENT',
    description: 'WE BUILD AND TRAIN CUSTOM MACHINE LEARNING AND AI MODELS FOR BUSINESS-SPECIFIC INTELLIGENCE AND AUTOMATION. FROM PREDICTIVE ANALYTICS AND FORECASTING SYSTEMS TO NLP AND COMPUTER VISION, WE ALSO DELIVER AI-POWERED WEB AND MOBILE APPLICATIONS — SUCH AS DATA-DRIVEN PLATFORMS FOR ENERGY PREDICTION, PERFORMANCE ANALYSIS, AND REAL-TIME DECISION SUPPORT POWERED BY ML MODELS.',
    icon: '🧠',
  },
  {
    id: 'business-software',
    title: 'BUSINESS SOFTWARE DEVELOPMENT',
    description: 'WE DEVELOP CUSTOM SOFTWARE SOLUTIONS TAILORED TO YOUR BUSINESS NEEDS. FROM ENTERPRISE APPLICATIONS TO WORKFLOW AUTOMATION TOOLS, WE CREATE SCALABLE, SECURE, AND USER-FRIENDLY SOFTWARE THAT STREAMLINES OPERATIONS AND DRIVES GROWTH.',
    icon: '💼',
  },
  {
    id: 'web-development',
    title: 'WEB DEVELOPMENT',
    description: 'WE CREATE MODERN, RESPONSIVE WEB APPLICATIONS WITH CUTTING-EDGE TECHNOLOGIES. FROM SINGLE-PAGE APPLICATIONS TO FULL-STACK PLATFORMS, WE DELIVER HIGH-PERFORMANCE, SCALABLE WEB SOLUTIONS THAT PROVIDE EXCEPTIONAL USER EXPERIENCES.',
    icon: '🌐',
  },
  {
    id: 'mobile-app',
    title: 'MOBILE APP DEVELOPMENT',
    description: 'WE BUILD NATIVE AND CROSS-PLATFORM MOBILE APPLICATIONS FOR iOS AND ANDROID. FROM CONCEPT TO DEPLOYMENT, WE CREATE INTUITIVE, PERFORMANT MOBILE APPS THAT ENGAGE USERS AND DELIVER MEASURABLE BUSINESS VALUE.',
    icon: '📱',
  },
  {
    id: 'devops-cloud',
    title: 'DEVOPS & CLOUD INFRASTRUCTURE',
    description: 'WE DESIGN AND IMPLEMENT ROBUST CLOUD INFRASTRUCTURE AND DEVOPS PIPELINES THAT ENABLE RAPID, RELIABLE DEPLOYMENTS. FROM CI/CD AUTOMATION TO CONTAINER ORCHESTRATION AND INFRASTRUCTURE AS CODE, WE HELP YOU ACHIEVE SCALABILITY, SECURITY, AND OPERATIONAL EXCELLENCE.',
    icon: '☁️',
  },
]

// Dummy data for Hardware Services
const hardwareServices = [
  {
    id: 'iot-devices',
    title: 'IOT DEVICES & SENSORS',
    description: 'WE DESIGN AND DEVELOP CUSTOM IOT DEVICES AND SENSOR NETWORKS FOR SMART INFRASTRUCTURE. FROM ENVIRONMENTAL MONITORING TO INDUSTRIAL AUTOMATION, WE CREATE CONNECTED DEVICES THAT COLLECT, PROCESS, AND TRANSMIT DATA SEAMLESSLY.',
    icon: '📡',
  },
  {
    id: 'embedded-systems',
    title: 'EMBEDDED SYSTEMS',
    description: 'WE BUILD EMBEDDED SYSTEMS FOR REAL-TIME APPLICATIONS AND CONTROL SYSTEMS. FROM MICROCONTROLLER PROGRAMMING TO FPGA DEVELOPMENT, WE CREATE RELIABLE, EFFICIENT EMBEDDED SOLUTIONS FOR AUTOMOTIVE, INDUSTRIAL, AND CONSUMER ELECTRONICS.',
    icon: '⚙️',
  },
  {
    id: 'robotics',
    title: 'ROBOTICS & AUTOMATION',
    description: 'WE DEVELOP ROBOTIC SYSTEMS AND AUTOMATION SOLUTIONS FOR MANUFACTURING, LOGISTICS, AND SERVICE APPLICATIONS. FROM ROBOT CONTROL SOFTWARE TO COMPUTER VISION INTEGRATION, WE CREATE INTELLIGENT ROBOTS THAT ENHANCE PRODUCTIVITY AND PRECISION.',
    icon: '🤖',
  },
  {
    id: 'pcb-design',
    title: 'PCB DESIGN & PROTOTYPING',
    description: 'WE PROVIDE COMPREHENSIVE PCB DESIGN AND PROTOTYPING SERVICES. FROM SCHEMATIC DESIGN TO LAYOUT AND MANUFACTURING SUPPORT, WE HELP YOU BRING YOUR ELECTRONIC DESIGNS TO LIFE WITH HIGH-QUALITY, RELIABLE PRINTED CIRCUIT BOARDS.',
    icon: '🔌',
  },
  {
    id: 'hardware-integration',
    title: 'HARDWARE-SOFTWARE INTEGRATION',
    description: 'WE SPECIALIZE IN SEAMLESSLY INTEGRATING HARDWARE COMPONENTS WITH SOFTWARE SYSTEMS. FROM DEVICE DRIVERS TO FIRMWARE DEVELOPMENT, WE ENSURE YOUR HARDWARE AND SOFTWARE WORK TOGETHER PERFECTLY TO DELIVER OPTIMAL PERFORMANCE.',
    icon: '🔗',
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
