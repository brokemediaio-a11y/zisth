import GlassPanel from '../ui/GlassPanel'
import './Header.css'

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Contact', href: '#contact' },
]

export default function Header() {
  return (
    <header className="header">
      <GlassPanel as="div" className="header__inner">
        <a href="/" className="header__logo" aria-label="Zisth home">
          Zisth
        </a>
        <nav className="header__nav" aria-label="Main navigation">
          {navItems.map(({ label, href }) => (
            <a key={href} href={href} className="header__nav-link">
              {label}
            </a>
          ))}
          <a href="#contact" className="header__nav-cta">
            Get in touch
          </a>
        </nav>
      </GlassPanel>
    </header>
  )
}
