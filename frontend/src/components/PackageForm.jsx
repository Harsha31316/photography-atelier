import { useState } from 'react'

function PackageForm({
  mode,
  photographyPackage,
  submitting,
  error,
  onSubmit,
  onCancel,
}) {
  const [values, setValues] = useState(() => ({
    packageName: photographyPackage?.packageName ?? '',
    description: photographyPackage?.description ?? '',
    hoursIncluded: String(photographyPackage?.hoursIncluded ?? ''),
    price: String(photographyPackage?.price ?? ''),
    albumAvailable: photographyPackage
      ? String(Boolean(photographyPackage.albumAvailable))
      : '',
    category: photographyPackage?.category ?? '',
    active: photographyPackage ? String(Boolean(photographyPackage.active)) : '',
  }))
  const [validationError, setValidationError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setValues((currentValues) => ({ ...currentValues, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const hoursIncluded = Number(values.hoursIncluded)
    const price = Number(values.price)

    if (!values.packageName.trim() || !values.description.trim() || !values.category.trim()) {
      setValidationError('Please complete all required fields.')
      return
    }

    if (!Number.isInteger(hoursIncluded) || hoursIncluded <= 0 ||
      !Number.isFinite(price) || price <= 0) {
      setValidationError('Hours must be a positive whole number and price must be a positive number.')
      return
    }

    setValidationError('')
    onSubmit({
      packageName: values.packageName.trim(),
      description: values.description.trim(),
      hoursIncluded,
      price,
      albumAvailable: values.albumAvailable === 'true',
      category: values.category.trim(),
      active: values.active === 'true',
    })
  }

  return (
    <section className="package-form-panel" aria-labelledby="package-form-title">
      <div className="package-form-heading">
        <div>
          <p className="eyebrow">
            <span /> {mode === 'edit' ? 'Refine the details' : 'A new story begins'}
          </p>
          <h2 id="package-form-title">
            {mode === 'edit' ? 'Edit photography ' : 'Add a photography '}
            <em>package.</em>
          </h2>
        </div>
        <button
          className="package-form-cancel"
          type="button"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="packageName">Package Name</label>
            <input
              className="form-control atelier-form-control"
              id="packageName"
              name="packageName"
              type="text"
              value={values.packageName}
              onChange={handleChange}
              maxLength={150}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="category">Category</label>
            <input
              className="form-control atelier-form-control"
              id="category"
              name="category"
              type="text"
              value={values.category}
              onChange={handleChange}
              maxLength={100}
              required
            />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="description">Description</label>
            <textarea
              className="form-control atelier-form-control"
              id="description"
              name="description"
              rows="3"
              value={values.description}
              onChange={handleChange}
              maxLength={1000}
              required
            />
          </div>
          <div className="col-sm-6 col-lg-3">
            <label className="form-label" htmlFor="hoursIncluded">Hours Included</label>
            <input
              className="form-control atelier-form-control"
              id="hoursIncluded"
              name="hoursIncluded"
              type="number"
              min="1"
              step="1"
              value={values.hoursIncluded}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-sm-6 col-lg-3">
            <label className="form-label" htmlFor="price">Price</label>
            <input
              className="form-control atelier-form-control"
              id="price"
              name="price"
              type="number"
              min="0.01"
              step="any"
              value={values.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-sm-6 col-lg-3">
            <label className="form-label" htmlFor="albumAvailable">Album Available</label>
            <select
              className="form-select atelier-form-control"
              id="albumAvailable"
              name="albumAvailable"
              value={values.albumAvailable}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select yes or no</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div className="col-sm-6 col-lg-3">
            <label className="form-label" htmlFor="active">Active</label>
            <select
              className="form-select atelier-form-control"
              id="active"
              name="active"
              value={values.active}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select yes or no</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>

        {(validationError || error) && (
          <div className="package-form-message package-form-error" role="alert">
            {validationError || error}
          </div>
        )}

        <div className="package-form-actions">
          <button className="btn atelier-button" type="submit" disabled={submitting}>
            {submitting
              ? (mode === 'edit' ? 'Updating package…' : 'Saving package…')
              : (mode === 'edit' ? 'Save Changes' : 'Save Package')}
            {!submitting && <span aria-hidden="true">↗</span>}
          </button>
          <button
            className="package-form-cancel"
            type="button"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  )
}

export default PackageForm
