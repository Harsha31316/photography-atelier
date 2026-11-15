function RequestState({ loading, error, onRetry, emptyMessage, loadingMessage = 'Loading...' }) {
  if (loading) {
    return (
      <div className="request-state" role="status" aria-live="polite">
        <span className="spinner-border spinner-border-sm" aria-hidden="true" />
        <span>{loadingMessage}</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="request-state request-state-error" role="alert">
        <p>{error}</p>
        {onRetry && (
          <button className="btn atelier-button" type="button" onClick={onRetry}>
            Try again
          </button>
        )}
      </div>
    )
  }

  if (emptyMessage) {
    return <p className="request-state">{emptyMessage}</p>
  }

  return null
}

export default RequestState
