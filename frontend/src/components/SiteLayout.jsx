import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'

const navigation = [
  { label: 'Home', to: '/', end: true },
  { label: 'Packages', to: '/packages' },
  { label: 'Dashboard', to: '/dashboard' },
]

function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <>
      <header className="site-header">
        <nav className="navbar navbar-expand-lg atelier-navbar" aria-label="Main navigation">
          <div className="container">
            <Link className="navbar-brand atelier-brand" to="/" onClick={closeMenu}>
              <span className="brand-mark" aria-hidden="true">
                <svg viewBox="0 0 32 32" fill="none">
                  <path
                    d="M5 10.5h5l2-3h8l2 3h5v15H5v-15Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />
                  <circle cx="16" cy="17.5" r="4.5" stroke="currentColor" strokeWidth="1.7" />
                  <circle cx="24" cy="14" r="1" fill="currentColor" />
                </svg>
              </span>
              <span>The Photography <em>Atelier</em></span>
            </Link>

            <button
              className="navbar-toggler atelier-toggler"
              type="button"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              aria-controls="primary-navigation"
              onClick={() => setMenuOpen((isOpen) => !isOpen)}
            >
              <span className="navbar-toggler-icon" />
            </button>

            <div
              className={`collapse navbar-collapse${menuOpen ? ' show' : ''}`}
              id="primary-navigation"
            >
              <ul className="navbar-nav ms-auto align-items-lg-center">
                {navigation.map((item) => (
                  <li className="nav-item" key={item.label}>
                    <NavLink
                      className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                      to={item.to}
                      end={item.end}
                      onClick={closeMenu}
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
                <li className="nav-item ms-lg-3">
                  <Link
                    className="btn atelier-button atelier-button-small"
                    to="/packages"
                    onClick={closeMenu}
                  >
                    Explore packages <span aria-hidden="true">↗</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <Outlet />

      <footer className="site-footer">
        <div className="container footer-inner">
          <Link className="footer-brand" to="/">
            The Photography <em>Atelier</em>
          </Link>
          <span>Made with care, and a little bit of light.</span>
          <a href="mailto:hello@photographyatelier.example">
            Say hello <span aria-hidden="true">↗</span>
          </a>
        </div>
      </footer>
    </>
  )
}

export default SiteLayout
