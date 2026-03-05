function Toast({ visible, type = "info", message, onClose }) {
  if (!visible || !message) {
    return null;
  }

  return (
    <div className={`bp-toast bp-toast-${type}`} role="status" aria-live="polite">
      <span>{message}</span>
      <button type="button" className="bp-toast-close" onClick={onClose} aria-label="Close notification">
        ×
      </button>
    </div>
  );
}

export default Toast;
