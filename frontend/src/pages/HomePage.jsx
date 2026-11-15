import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PackageCard from '../components/PackageCard.jsx'
import RequestState from '../components/RequestState.jsx'
import { getApiErrorMessage, getPackages } from '../services/packageService.js'

function HomePage() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadPackages() {
      try {
        const data = await getPackages({ signal: controller.signal })
        setPackages(data)
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setError(getApiErrorMessage(requestError))
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadPackages()
    return () => controller.abort()
  }, [])

  return (
    <main>
      <section className="hero-section" id="home">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 hero-copy">
              <p className="eyebrow"><span /> A little studio for the big moments</p>
              <h1>Good things happen. <span>We make them last.</span></h1>
              <p className="hero-description">
                Thoughtful photography for the days you never want to forget.
                Find the package that feels like you.
              </p>
              <div className="hero-actions">
                <Link className="btn atelier-button" to="/packages">
                  Find your package <span aria-hidden="true">↗</span>
                </Link>
                <Link className="text-link" to="/dashboard">
                  Get to know us <span aria-hidden="true">↓</span>
                </Link>
              </div>
              <div className="hero-note">
                <div className="avatar-stack" aria-hidden="true">
                  <span>J</span><span>M</span><span>A</span>
                </div>
                <p><strong>Good company, lovely photographs.</strong><br />A small team with a big heart.</p>
              </div>
            </div>

            <div className="col-lg-6 hero-visual">
              <div className="hero-image-frame">
                <img
                  className="hero-image"
                  src="https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1400&q=90"
                  alt="A newly married couple celebrating together outdoors"
                />
                <div className="image-caption">
                  <span className="caption-dot" />
                  <span>For the moments that feel like everything</span>
                </div>
              </div>
              <div className="hero-stamp" aria-label="Made with care in every frame">
                <span>MADE WITH CARE</span>
                <strong>♡</strong>
                <span>IN EVERY FRAME</span>
              </div>
              <div className="hero-photo-count">
                <strong>01</strong><span> / 03</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-bottom-line" aria-hidden="true">
          <span>HONEST MOMENTS</span><span>·</span><span>TIMELESS IMAGES</span><span>·</span><span>YOUR STORY, ALWAYS</span>
        </div>
      </section>

      <section className="packages-section" id="packages">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow"><span /> A few ways to remember</p>
              <h2>Find your kind of <em>forever.</em></h2>
            </div>
            <p className="section-intro">
              Every story is different. Start with a little inspiration and
              we’ll make the details yours.
            </p>
          </div>

          <RequestState
            loading={loading}
            error={error}
            emptyMessage={!loading && !error && packages.length === 0
              ? 'No photography packages are available yet.'
              : ''}
          />
          {!loading && !error && packages.length > 0 && (
            <div className="row g-4 package-grid">
              {packages.slice(0, 3).map((photographyPackage, index) => (
                <PackageCard
                  key={photographyPackage.id}
                  photographyPackage={photographyPackage}
                  index={index}
                />
              ))}
            </div>
          )}
          <p className="packages-footnote">
            <Link to="/packages">Explore all photography packages <span aria-hidden="true">↗</span></Link>
          </p>
        </div>
      </section>

      <section className="studio-section" id="dashboard">
        <div className="container">
          <div className="studio-card">
            <div className="studio-copy">
              <p className="eyebrow"><span /> The little things add up</p>
              <h2>Here for the <em>whole story.</em></h2>
              <p>
                From the first hello to the final gallery, we keep the
                experience easy, personal, and full of the good stuff.
              </p>
              <Link className="studio-dashboard-link" to="/dashboard">
                View package statistics <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div className="studio-stats" aria-label="Package highlights">
              <div><strong>{loading ? '—' : packages.length}</strong><span>photography packages</span></div>
              <div><strong>{loading ? '—' : packages.filter((item) => item.active).length}</strong><span>currently available</span></div>
              <div><strong>{loading ? '—' : packages.filter((item) => item.albumAvailable).length}</strong><span>with photo albums</span></div>
            </div>
            <span className="studio-flower" aria-hidden="true">✳</span>
          </div>
        </div>
      </section>
    </main>
  )
}

export default HomePage
