function ConfirmActionModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="bp-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="bp-confirm-title">
      <div className="bp-modal">
        <h3 id="bp-confirm-title" className="bp-card-title">
          {title}
        </h3>
        <p className="bp-modal-text">{message}</p>
        <div className="bp-modal-actions">
          <button type="button" className="bp-btn" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </button>
          <button type="button" className="bp-btn bp-btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmActionModal;
