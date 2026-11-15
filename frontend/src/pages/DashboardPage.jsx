import { useEffect, useState } from 'react'
import RequestState from '../components/RequestState.jsx'
import { getApiErrorMessage, getDashboardStats } from '../services/packageService.js'

function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [requestNumber, setRequestNumber] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadDashboard() {
      setLoading(true)
      setError('')
      try {
        const data = await getDashboardStats({ signal: controller.signal })
        setStats(data)
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

    loadDashboard()
    return () => controller.abort()
  }, [requestNumber])

  const statistics = stats
    ? [
        { label: 'Total packages', value: stats.totalPackages },
        {
          label: 'Average package price',
          value: `$${Number(stats.averagePackagePrice).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
        },
        { label: 'Packages with albums', value: stats.packagesWithAlbums },
        { label: 'Total photography hours', value: stats.totalPhotographyHours },
      ]
    : []
  const albumCoverage = stats?.totalPackages
    ? Math.min(100, Math.round(stats.packagesWithAlbums / stats.totalPackages * 100))
    : 0
  const packagesWithoutAlbums = stats
    ? Math.max(0, stats.totalPackages - stats.packagesWithAlbums)
    : 0

  return (
    <main className="packages-section page-section">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span /> The studio at a glance</p>
            <h1 className="page-title">Package <em>dashboard.</em></h1>
          </div>
          <p className="section-intro">
            A summary of your photography packages, provided by the backend.
          </p>
        </div>

        <RequestState
          loading={loading}
          error={error}
          onRetry={error ? () => setRequestNumber((number) => number + 1) : undefined}
        />
        {!loading && !error && stats && (
          <>
            <div className="row g-4 dashboard-grid">
              {statistics.map((statistic) => (
                <div className="col-sm-6 col-lg-3" key={statistic.label}>
                  <article className="dashboard-stat">
                    <span>{statistic.label}</span>
                    <strong>{statistic.value}</strong>
                  </article>
                </div>
              ))}
            </div>
            <section className="dashboard-coverage" aria-labelledby="album-coverage-title">
              <div className="dashboard-coverage-heading">
                <div>
                  <p className="eyebrow"><span /> Package collection</p>
                  <h2 id="album-coverage-title">Album <em>coverage.</em></h2>
                </div>
                <strong>{albumCoverage}%</strong>
              </div>
              <div
                className="dashboard-coverage-track"
                role="progressbar"
                aria-label="Share of packages that include albums"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={albumCoverage}
              >
                <span style={{ width: `${albumCoverage}%` }} />
              </div>
              <p>
                {stats.packagesWithAlbums} {stats.packagesWithAlbums === 1 ? 'package includes' : 'packages include'} an album;
                {' '}{packagesWithoutAlbums} {packagesWithoutAlbums === 1 ? 'does' : 'do'} not.
              </p>
            </section>
          </>
        )}
      </div>
    </main>
  )
}

export default DashboardPage
