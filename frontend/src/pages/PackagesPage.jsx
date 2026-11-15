import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PackageCard from '../components/PackageCard.jsx'
import PackageForm from '../components/PackageForm.jsx'
import RequestState from '../components/RequestState.jsx'
import {
  createPackage,
  deletePackage,
  getApiErrorMessage,
  getPackages,
  searchPackagesByName,
  updatePackage,
} from '../services/packageService.js'

function PackagesPage() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [requestNumber, setRequestNumber] = useState(0)
  const [searchParams, setSearchParams] = useSearchParams()
  const [addFormOpen, setAddFormOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [actionError, setActionError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchedTerm, setSearchedTerm] = useState('')
  const [searchedRevision, setSearchedRevision] = useState(-1)
  const [searchError, setSearchError] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [activeFilter, setActiveFilter] = useState('')
  const [albumFilter, setAlbumFilter] = useState('')
  const [sortBy, setSortBy] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadPackages() {
      setLoading(true)
      setError('')
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
  }, [requestNumber])

  useEffect(() => {
    const query = searchTerm.trim()
    if (!query) {
      return undefined
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(async () => {
      setSearchError('')
      try {
        const results = await searchPackagesByName(query, { signal: controller.signal })
        if (!controller.signal.aborted) {
          setSearchResults(results)
          setSearchedTerm(query)
          setSearchedRevision(requestNumber)
        }
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setSearchError(getApiErrorMessage(requestError))
          setSearchedTerm(query)
          setSearchedRevision(requestNumber)
        }
      }
    }, 250)

    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [requestNumber, searchTerm])

  const editingId = searchParams.get('edit')
  const editingPackage = packages.find(
    (photographyPackage) => String(photographyPackage.id) === editingId,
  )
  const deleteId = searchParams.get('delete')
  const packageToDelete = packages.find(
    (photographyPackage) => String(photographyPackage.id) === deleteId,
  )
  const formMode = editingPackage ? 'edit' : 'create'
  const formOpen = addFormOpen || Boolean(editingPackage)
  const searchQuery = searchTerm.trim()
  const searchPending = Boolean(searchQuery) &&
    (searchedTerm !== searchQuery || searchedRevision !== requestNumber)
  const activeSearchError = searchedTerm === searchQuery ? searchError : ''
  const categoryOptions = [...new Set(packages.map((item) => item.category))].sort(
    (left, right) => left.localeCompare(right),
  )
  const sourcePackages = searchQuery
    ? (searchedTerm === searchQuery ? searchResults : [])
    : packages
  const visiblePackages = sourcePackages
    .filter((item) => !categoryFilter || item.category === categoryFilter)
    .filter((item) => activeFilter === '' || String(item.active) === activeFilter)
    .filter((item) => albumFilter === '' || String(item.albumAvailable) === albumFilter)
    .sort((left, right) => {
      if (sortBy === 'price-asc') return left.price - right.price
      if (sortBy === 'price-desc') return right.price - left.price
      if (sortBy === 'name-asc') return left.packageName.localeCompare(right.packageName)
      if (sortBy === 'hours-asc') return left.hoursIncluded - right.hoursIncluded
      return 0
    })
  const hasFilters = Boolean(searchQuery || categoryFilter || activeFilter || albumFilter || sortBy)

  function handleCancel() {
    setAddFormOpen(false)
    setFormError('')
    setActionError('')
    setSearchParams({}, { replace: true })
  }

  function handleAddPackage() {
    setFormError('')
    setActionError('')
    setSuccessMessage('')
    setAddFormOpen(true)
    setSearchParams({}, { replace: true })
  }

  function clearFilters() {
    setSearchTerm('')
    setCategoryFilter('')
    setActiveFilter('')
    setAlbumFilter('')
    setSortBy('')
    setSearchError('')
  }

  async function handleDelete() {
    if (!packageToDelete) return

    setDeletingId(packageToDelete.id)
    setActionError('')
    setSuccessMessage('')
    try {
      await deletePackage(packageToDelete.id)
      setSearchParams({}, { replace: true })
      setSuccessMessage(`${packageToDelete.packageName} was deleted.`)
      setRequestNumber((number) => number + 1)
    } catch (requestError) {
      setActionError(
        requestError.response
          ? getApiErrorMessage(requestError)
          : 'Could not connect to the backend. Check that it is running and try again.',
      )
    } finally {
      setDeletingId(null)
    }
  }

  async function handleSubmit(packageData) {
    setSubmitting(true)
    setFormError('')
    setSuccessMessage('')

    try {
      if (formMode === 'edit') {
        await updatePackage(editingId, packageData)
      } else {
        await createPackage(packageData)
      }

      setAddFormOpen(false)
      setActionError('')
      setSearchParams({}, { replace: true })
      setSuccessMessage(
        formMode === 'edit'
          ? 'Photography package updated successfully.'
          : 'Photography package added successfully.',
      )
      setRequestNumber((number) => number + 1)
    } catch (requestError) {
      setFormError(
        requestError.response
          ? getApiErrorMessage(requestError)
          : 'Could not connect to the backend. Check that it is running and try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="packages-section page-section">
      <div className="container">
        <div className="section-heading packages-page-heading">
          <div>
            <p className="eyebrow"><span /> Made for your moments</p>
            <h1 className="page-title">Our photography <em>packages.</em></h1>
          </div>
          <p className="section-intro">
            Explore the packages currently available from The Photography Atelier.
          </p>
          <button
            className="btn atelier-button packages-add-button"
            type="button"
            onClick={handleAddPackage}
          >
            Add Package <span aria-hidden="true">+</span>
          </button>
        </div>

        {successMessage && (
          <div className="package-form-message package-form-success" role="status">
            {successMessage}
          </div>
        )}

        {actionError && (
          <div className="package-form-message package-form-error" role="alert">
            {actionError}
          </div>
        )}

        {deleteId && packageToDelete && (
          <section className="package-delete-confirmation" aria-labelledby="delete-confirm-title">
            <div>
              <p className="eyebrow"><span /> Please confirm</p>
              <h2 id="delete-confirm-title">Delete {packageToDelete.packageName}?</h2>
              <p>This removes the package from your collection. This action cannot be undone.</p>
            </div>
            <div className="package-delete-actions">
              <button
                className="btn package-delete-confirm-button"
                type="button"
                onClick={handleDelete}
                disabled={deletingId !== null}
              >
                {deletingId === packageToDelete.id ? 'Deleting…' : 'Delete Package'}
              </button>
              <button
                className="package-form-cancel"
                type="button"
                onClick={handleCancel}
                disabled={deletingId !== null}
              >
                Cancel
              </button>
            </div>
          </section>
        )}

        {formOpen && (
          <PackageForm
            key={`${formMode}-${editingPackage?.id ?? 'new'}`}
            mode={formMode}
            photographyPackage={editingPackage}
            submitting={submitting}
            error={formError}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}

        <section className="package-tools" aria-label="Search and refine packages">
          <div className="package-search-field">
            <label className="form-label" htmlFor="packageSearch">Search packages</label>
            <input
              className="form-control atelier-form-control"
              id="packageSearch"
              type="search"
              placeholder="Search by package name"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value)
                setSearchError('')
              }}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="categoryFilter">Category</label>
            <select
              className="form-select atelier-form-control"
              id="categoryFilter"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              <option value="">All categories</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label" htmlFor="activeFilter">Status</label>
            <select
              className="form-select atelier-form-control"
              id="activeFilter"
              value={activeFilter}
              onChange={(event) => setActiveFilter(event.target.value)}
            >
              <option value="">All statuses</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <div>
            <label className="form-label" htmlFor="albumFilter">Album</label>
            <select
              className="form-select atelier-form-control"
              id="albumFilter"
              value={albumFilter}
              onChange={(event) => setAlbumFilter(event.target.value)}
            >
              <option value="">All packages</option>
              <option value="true">Album available</option>
              <option value="false">No album</option>
            </select>
          </div>
          <div>
            <label className="form-label" htmlFor="sortPackages">Sort by</label>
            <select
              className="form-select atelier-form-control"
              id="sortPackages"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="">Default order</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name-asc">Package name</option>
              <option value="hours-asc">Photography hours</option>
            </select>
          </div>
          {hasFilters && (
            <button className="package-clear-filters" type="button" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </section>

        {activeSearchError && (
          <div className="package-form-message package-form-error" role="alert">
            Search failed: {activeSearchError}
          </div>
        )}

        <RequestState
          loading={loading || searchPending}
          loadingMessage={searchPending ? 'Searching packages…' : 'Loading packages…'}
          error={error}
          onRetry={error ? () => setRequestNumber((number) => number + 1) : undefined}
          emptyMessage={
            !loading && !searchPending && !error && packages.length === 0
              ? 'No photography packages are available yet.'
              : !loading && !searchPending && !error && !activeSearchError &&
                visiblePackages.length === 0
                ? (hasFilters
                  ? 'No packages match your search or filters. Try changing or clearing them.'
                  : '')
                : ''
          }
        />
        {!loading && !searchPending && !error && visiblePackages.length > 0 && (
          <>
            <p className="package-count">
              Showing {visiblePackages.length} of {packages.length}{' '}
              {packages.length === 1 ? 'package' : 'packages'}
            </p>
            <div className="row g-4 package-grid">
              {visiblePackages.map((photographyPackage, index) => (
                <PackageCard
                  key={photographyPackage.id}
                  photographyPackage={photographyPackage}
                  index={index}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}

export default PackagesPage
