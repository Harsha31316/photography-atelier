import { Link } from 'react-router-dom'

const packageImages = [
  {
    match: 'wedding',
    image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'A couple sharing a quiet moment on their wedding day',
  },
  {
    match: 'portrait',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'A softly lit editorial portrait',
  },
  {
    match: 'event',
    image:
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Friends celebrating together at an outdoor event',
  },
]

function getImageForCategory(category) {
  const normalizedCategory = category.toLowerCase()
  return packageImages.find(({ match }) => normalizedCategory.includes(match)) ?? packageImages[0]
}

function PackageCard({ photographyPackage, index = 0, showDetailsLink = true }) {
  const image = getImageForCategory(photographyPackage.category)
  const details = [
    `${photographyPackage.hoursIncluded} hours of coverage`,
    photographyPackage.albumAvailable ? 'Photo album included' : 'Digital photo package',
  ]

  return (
    <div className="col-md-6 col-lg-4">
      <article className={`package-card${index === 0 ? ' package-card-featured' : ''}`}>
        <div className="package-image-wrap">
          <img src={image.image} alt={image.imageAlt} loading="lazy" />
          <span className="package-number">
            {String(index + 1).padStart(2, '0')}
          </span>
          {index === 0 && photographyPackage.active && (
            <span className="package-badge">Available</span>
          )}
          {!photographyPackage.active && (
            <span className="package-badge">Not available</span>
          )}
        </div>
        <div className="package-content">
          <div className="package-meta">
            <span>{photographyPackage.category}</span>
            <span>From ${photographyPackage.price.toLocaleString('en-US')}</span>
          </div>
          <h3>{photographyPackage.packageName}</h3>
          <p className="package-description">{photographyPackage.description}</p>
          <ul className="package-details">
            {details.map((detail) => (
              <li key={detail}><span aria-hidden="true">✳</span>{detail}</li>
            ))}
          </ul>
          <div className="package-card-actions">
            {showDetailsLink && (
              <Link className="package-link" to={`/packages/${photographyPackage.id}`}>
                View details <span aria-hidden="true">↗</span>
              </Link>
            )}
            <Link
              className="package-edit-link"
              to={`/packages?edit=${encodeURIComponent(photographyPackage.id)}`}
              aria-label={`Edit ${photographyPackage.packageName}`}
            >
              Edit
            </Link>
            <Link
              className="package-delete-link"
              to={`/packages?delete=${encodeURIComponent(photographyPackage.id)}`}
              aria-label={`Delete ${photographyPackage.packageName}`}
            >
              Delete
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}

export default PackageCard
