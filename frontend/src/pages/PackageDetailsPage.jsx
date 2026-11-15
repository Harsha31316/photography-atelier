import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PackageCard from '../components/PackageCard.jsx'
import RequestState from '../components/RequestState.jsx'
import { getApiErrorMessage, getPackageById } from '../services/packageService.js'

function PackageDetailsPage() {
  const { id } = useParams()
  const [photographyPackage, setPhotographyPackage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [requestNumber, setRequestNumber] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadPackage() {
      setLoading(true)
      setError('')
      setPhotographyPackage(null)
      try {
        const data = await getPackageById(id, { signal: controller.signal })
        setPhotographyPackage(data)
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

    loadPackage()
    return () => controller.abort()
  }, [id, requestNumber])

  return (
    <main className="packages-section page-section">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span /> A closer look</p>
            <h1 className="page-title">Package <em>details.</em></h1>
          </div>
          <Link className="text-link" to="/packages">
            <span aria-hidden="true">←</span> All packages
          </Link>
        </div>

        <RequestState
          loading={loading}
          error={error}
          onRetry={error ? () => setRequestNumber((number) => number + 1) : undefined}
        />
        {!loading && !error && photographyPackage && (
          <div className="row g-4 package-grid">
            <PackageCard photographyPackage={photographyPackage} showDetailsLink={false} />
            <div className="col-md-6 col-lg-8">
              <section className="package-detail-panel">
                <p className="eyebrow"><span /> {photographyPackage.category}</p>
                <h2>{photographyPackage.packageName}</h2>
                <p>{photographyPackage.description}</p>
                <dl className="package-detail-list">
                  <div><dt>Price</dt><dd>${photographyPackage.price.toLocaleString('en-US')}</dd></div>
                  <div><dt>Hours included</dt><dd>{photographyPackage.hoursIncluded}</dd></div>
                  <div><dt>Album available</dt><dd>{photographyPackage.albumAvailable ? 'Yes' : 'No'}</dd></div>
                  <div><dt>Status</dt><dd>{photographyPackage.active ? 'Available' : 'Not available'}</dd></div>
                </dl>
              </section>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default PackageDetailsPage
