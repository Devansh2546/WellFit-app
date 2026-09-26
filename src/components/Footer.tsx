import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../assets/CSS/Footer.css'

function Footer() {
  const { user } = useAuth()
  const year = new Date().getFullYear()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogoClick = (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return
    }
    e.preventDefault()
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/')
      window.scrollTo(0, 0)
      requestAnimationFrame(() => {
        window.scrollTo(0, 0)
      })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer" role="contentinfo">
      {/* Top Emerald Accent Line */}
      <div className="footer-top-line" aria-hidden="true" />

      <div className="container footer-container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <Link
              to="/"
              onClick={handleLogoClick}
              className="footer-logo-link"
              aria-label="WellFit Home — Scroll to top"
            >
              <img src="/logo.png" alt="WellFit" className="footer-logo-img footer-logo-light" />
              <img src="/logo_dark.png" alt="WellFit" className="footer-logo-img footer-logo-dark" />
            </Link>

            <p className="footer-brand-bio">
              Precision workouts, evidence-based nutrition, and training calculators built for athletes who train with intent.
            </p>
          </div>

          {/* Column 1: Train */}
          <div className="footer-col">
            <h4 className="footer-col-title">Train</h4>
            <ul className="footer-links-list">
              <li>
                <Link to="/workouts">Workouts</Link>
              </li>
              <li>
                <Link to="/progress">Progress Tracker</Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Tools */}
          <div className="footer-col">
            <h4 className="footer-col-title">Tools</h4>
            <ul className="footer-links-list">
              <li>
                <Link to="/tools">All Tools</Link>
              </li>
              <li>
                <Link to="/tools?tab=bmi">BMI Calculator</Link>
              </li>
              <li>
                <Link to="/tools?tab=1rm">1RM Calculator</Link>
              </li>
              <li>
                <Link to="/tools?tab=macro">Macro Calculator</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="footer-col">
            <h4 className="footer-col-title">Resources</h4>
            <ul className="footer-links-list">
              <li>
                <Link to="/articles">Articles</Link>
              </li>
              <li>
                <Link to="/recipes">Recipes</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Account */}
          <div className="footer-col">
            <h4 className="footer-col-title">Account</h4>
            <ul className="footer-links-list">
              {user ? (
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
              ) : (
                <li>
                  <Link to="/login">Log In</Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-info">
            <span>&copy; {year} WellFit. All rights reserved.</span>
          </div>

          <button
            type="button"
            className="footer-back-to-top"
            onClick={scrollToTop}
            aria-label="Scroll back to top of page"
          >
            <span>Back to top</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer