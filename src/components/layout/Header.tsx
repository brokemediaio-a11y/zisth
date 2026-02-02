import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { FloatingDock } from '../ui/FloatingDock'
import './Header.css'

const navLinks = [
  { title: 'Home', href: '#home' },
  { title: 'Services', href: '#services' },
  { title: 'About us', href: '#about' },
  { title: 'Blogs', href: '#blogs' },
  { title: 'Research', href: '#research' },
  { title: 'portfolio', href: '#portfolio' },
  { title: 'Contact us', href: '#contact' },
]

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="header">
      <div className="header__bar">
        <a href="/" className="header__logo" aria-label="Zisth home">
          Zisth
        </a>

        <div className="header__dock-wrap">
          <FloatingDock
            items={navLinks}
            desktopClassName="header__dock"
            mobileClassName="header__dock-mobile"
          />
        </div>

        <div className="header__actions">
          <a href="#contact" className="header__cta">
            Get in touch
          </a>
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
