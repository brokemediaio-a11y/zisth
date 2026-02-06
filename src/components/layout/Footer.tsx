import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__container">
          <div className="footer__grid">
            <div className="footer__column">
              <h3 className="footer__heading">Company</h3>
              <nav className="footer__nav">
                <Link to="/" className="footer__link">Home</Link>
                <Link to="/about" className="footer__link">About Us</Link>
                <a href="#services" className="footer__link">Services</a>
                <a href="#research" className="footer__link">Research</a>
                <a href="#portfolio" className="footer__link">Portfolio</a>
              </nav>
            </div>

            <div className="footer__column">
              <h3 className="footer__heading">Resources</h3>
              <nav className="footer__nav">
                <Link to="/blogs" className="footer__link">Blogs</Link>
                <a href="#contact" className="footer__link">Contact Us</a>
                <a href="#faq" className="footer__link">FAQ</a>
              </nav>
            </div>

            <div className="footer__column">
              <h3 className="footer__heading">Connect</h3>
              <nav className="footer__nav">
                <a href="mailto:info@zisth.com" className="footer__link">Email</a>
                <a href="https://linkedin.com/company/zisth" target="_blank" rel="noopener noreferrer" className="footer__link">LinkedIn</a>
                <a href="https://twitter.com/zisth" target="_blank" rel="noopener noreferrer" className="footer__link">Twitter</a>
              </nav>
            </div>

            <div className="footer__column">
              <h3 className="footer__heading">Legal</h3>
              <nav className="footer__nav">
                <a href="#privacy" className="footer__link">Privacy Policy</a>
                <a href="#terms" className="footer__link">Terms of Service</a>
              </nav>
            </div>
          </div>

          <div className="footer__bottom">
            <p className="footer__copyright">
              © {new Date().getFullYear()} Zisth Synthesis Lab AB. All rights reserved.
            </p>
            <p className="footer__watermark">
              Made with love by{' '}
              <a 
                href="https://www.nexordis.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer__watermark-link"
              >
                nexordis
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
