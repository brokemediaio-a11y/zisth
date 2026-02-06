import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { FloatingDock } from '../ui/FloatingDock'
import LiquidGlassButton from '../ui/LiquidGlassButton'
import './Header.css'

const navLinks = [
  { title: 'Home', href: '/' },
  { title: 'Services', href: '#services' },
  { title: 'About us', href: '/about' },
  { title: 'Blogs', href: '/blogs' },
  { title: 'Research', href: '#research' },
  { title: 'portfolio', href: '#portfolio' },
  { title: 'Contact us', href: '#contact' },
]

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="header">
      <div className="header__bar">
        <Link to="/" className="header__logo" aria-label="Zisth home">
          <img src="/zisthlogo.png" alt="Zisth" className="header__logo-img" />
        </Link>

        <div className="header__dock-wrap">
          <FloatingDock
            items={navLinks}
            desktopClassName="header__dock"
            mobileClassName="header__dock-mobile"
          />
        </div>

        <div className="header__actions">
          <LiquidGlassButton
            as="a"
            href="#contact"
            width={169}
            height={56}
            borderRadius={33.04}
            innerShadowColor="#000000"
            innerShadowBlur={17}
            innerShadowSpread={-15}
            glassTintColor="rgba(26, 26, 26, 0.17)"
            frostBlurRadius={0}
            noiseFrequency={0.02}
            noiseStrength={43}
          >
            Get in touch
          </LiquidGlassButton>
        </div>

        <button
          type="button"
          className="header__menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <X className="header__menu-icon" />
          ) : (
            <Menu className="header__menu-icon" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="header__mobile-overlay"
            aria-hidden
          >
            <nav className="header__mobile-nav" aria-label="Mobile navigation">
              {[...navLinks, { title: 'Get in touch', href: '#contact' }].map((link, idx) => (
                <motion.a
                  key={`${link.href}-${idx}`}
                  href={link.href}
                  className="header__mobile-link"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.title}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
