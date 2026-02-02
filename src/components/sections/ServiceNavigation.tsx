import { useEffect, useRef } from 'react'
import { FloatingDock } from '../ui/FloatingDock'
import './ServiceNavigation.css'

export interface Service {
  id: string
  title: string
  description: string
  icon: string
}

export interface ServiceNavigationProps {
  services: Service[]
  activeId: string
  onSelect: (id: string) => void
}

export default function ServiceNavigation({ services, activeId, onSelect }: ServiceNavigationProps) {
  const dockRef = useRef<HTMLDivElement>(null)

  const navItems = services.map((service) => ({
    title: service.title,
    href: `#${service.id}`,
  }))

  useEffect(() => {
    const dockElement = dockRef.current
    if (!dockElement) return

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a[href^="#"]')
      if (!link) return

      e.preventDefault()
      const href = link.getAttribute('href')
      if (!href) return

      const serviceId = href.replace('#', '')
      const service = services.find((s) => s.id === serviceId)
      if (service) {
        onSelect(service.id)
      }
    }

    dockElement.addEventListener('click', handleClick)
    return () => {
      dockElement.removeEventListener('click', handleClick)
    }
  }, [services, onSelect])

  // Update active state styling
  useEffect(() => {
    const dockElement = dockRef.current
    if (!dockElement) return

    const links = dockElement.querySelectorAll('a[href^="#"]')
    links.forEach((link) => {
      const href = link.getAttribute('href')
      if (href) {
        const serviceId = href.replace('#', '')
        if (serviceId === activeId) {
          link.classList.add('service-navigation__link--active')
        } else {
          link.classList.remove('service-navigation__link--active')
        }
      }
    })
  }, [activeId])

  return (
    <div className="service-navigation" ref={dockRef}>
      <div className="service-navigation__dock-wrapper">
        <FloatingDock
          items={navItems}
          desktopClassName="service-navigation__dock"
          mobileClassName="service-navigation__dock-mobile"
        />
      </div>
    </div>
  )
}
