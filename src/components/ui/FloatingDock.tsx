import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  type MotionValue,
} from 'framer-motion'
import { Menu } from 'lucide-react'
import { cn } from '../../lib/utils'
import './FloatingDock.css'

const DOCK_DISTANCE = 220
const DOCK_SPRING = { mass: 0.12, stiffness: 120, damping: 18 }

export interface FloatingDockItem {
  title: string
  href: string
  icon?: React.ReactNode
}

export interface FloatingDockProps {
  items: FloatingDockItem[]
  desktopClassName?: string
  mobileClassName?: string
}

function DockItem({
  mouseX,
  title,
  icon,
  href,
}: {
  mouseX: MotionValue<number>
  title: string
  icon?: React.ReactNode
  href: string
}) {
  const ref = useRef<HTMLElement | null>(null)
  const [hovered, setHovered] = useState(false)
  const isTextOnly = icon == null

  const distance = useTransform(mouseX, (val) => {
    if (val === Infinity) return Infinity
    const bounds = ref.current?.getBoundingClientRect()
    if (!bounds) return Infinity
    return val - bounds.left - bounds.width / 2
  })

  /* Text-only: scale (1 → 1.4) for a clear pop; smoother spring for fluid motion. */
  /* When mouseX is Infinity (no hover), scale should be 1 (normal state) */
  const scaleTransform = useTransform(distance, (val) => {
    if (!isFinite(val) || Math.abs(val) > DOCK_DISTANCE) return 1
    const normalized = Math.abs(val) / DOCK_DISTANCE
    return 1 + (0.4 * (1 - normalized))
  })
  const widthTransform = useTransform(distance, [-DOCK_DISTANCE, 0, DOCK_DISTANCE], [40, 56, 40])
  const heightTransform = useTransform(distance, [-DOCK_DISTANCE, 0, DOCK_DISTANCE], [40, 56, 40])
  const iconWidthTransform = useTransform(distance, [-DOCK_DISTANCE, 0, DOCK_DISTANCE], [20, 28, 20])
  const iconHeightTransform = useTransform(distance, [-DOCK_DISTANCE, 0, DOCK_DISTANCE], [20, 28, 20])

  const scale = useSpring(scaleTransform, DOCK_SPRING)
  const width = useSpring(widthTransform, DOCK_SPRING)
  const height = useSpring(heightTransform, DOCK_SPRING)
  const iconWidth = useSpring(iconWidthTransform, DOCK_SPRING)
  const iconHeight = useSpring(iconHeightTransform, DOCK_SPRING)

  // Check if href is a route (starts with /) or hash/anchor link
  const isRoute = href.startsWith('/')

  if (isTextOnly) {
    if (isRoute) {
      return (
        <motion.div style={{ scale }}>
          <Link
            to={href}
            className="floating-dock__link floating-dock__link--text"
            aria-label={title}
          >
            <span className="floating-dock__link-inner">{title}</span>
          </Link>
        </motion.div>
      )
    }
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        style={{ scale }}
        className="floating-dock__link floating-dock__link--text"
        aria-label={title}
      >
        <span className="floating-dock__link-inner">{title}</span>
      </motion.a>
    )
  }

  if (isRoute) {
    return (
      <Link to={href} className="floating-dock__link" aria-label={title}>
        <motion.div
          ref={ref as React.RefObject<HTMLDivElement>}
          style={{ width, height }}
          className="floating-dock__icon-wrapper"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="floating-dock__tooltip"
              >
                {title}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div style={{ width: iconWidth, height: iconHeight }} className="floating-dock__icon">
            {icon}
          </motion.div>
        </motion.div>
      </Link>
    )
  }

  return (
    <a href={href} className="floating-dock__link" aria-label={title}>
      <motion.div
        ref={ref as React.RefObject<HTMLDivElement>}
        style={{ width, height }}
        className="floating-dock__icon-wrapper"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="floating-dock__tooltip"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div style={{ width: iconWidth, height: iconHeight }} className="floating-dock__icon">
          {icon}
        </motion.div>
      </motion.div>
    </a>
  )
}

function FloatingDockDesktop({
  items,
  className,
}: {
  items: FloatingDockItem[]
  className?: string
}) {
  const mouseX = useMotionValue(Infinity)
  const filterId = `glass-distortion-dock-${Math.random().toString(36).substr(2, 9)}`

  return (
    <>
      {/* SVG filter definition for liquid glass effect */}
      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
        <defs>
          <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02 0.02"
              numOctaves={2}
              seed={92}
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="blurred"
              scale="43"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <motion.div
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={cn('floating-dock', 'floating-dock--desktop', className)}
        style={{ '--dock-filter-url': `url(#${filterId})` } as React.CSSProperties & { '--dock-filter-url': string }}
      >
        {items.map((item) => (
          <DockItem mouseX={mouseX} key={item.title} {...item} />
        ))}
      </motion.div>
    </>
  )
}

function FloatingDockMobile({
  items,
  className,
}: {
  items: FloatingDockItem[]
  className?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className={cn('floating-dock-mobile', className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="floating-dock-mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="floating-dock-mobile__menu"
          >
            {items.map((item, idx) => {
              const isRoute = item.href.startsWith('/')
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: (items.length - 1 - idx) * 0.04 }}
                  className="floating-dock-mobile__menu-item"
                >
                  {isRoute ? (
                    <Link to={item.href} onClick={() => setOpen(false)} className="floating-dock-mobile__menu-link">
                      {item.icon && <span className="floating-dock-mobile__menu-icon">{item.icon}</span>}
                      {item.title}
                    </Link>
                  ) : (
                    <a href={item.href} onClick={() => setOpen(false)} className="floating-dock-mobile__menu-link">
                      {item.icon && <span className="floating-dock-mobile__menu-icon">{item.icon}</span>}
                      {item.title}
                    </a>
                  )}
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="floating-dock-mobile__trigger"
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        <Menu className="floating-dock-mobile__trigger-icon" />
      </button>
    </div>
  )
}

export function FloatingDock({ items, desktopClassName, mobileClassName }: FloatingDockProps) {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  )
}
