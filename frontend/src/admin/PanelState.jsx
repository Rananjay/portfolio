import { useState } from "react";
import { Trash2 } from "lucide-react";

export function PanelState({ isLoading, error, isEmpty, emptyText }) {
  if (isLoading) return <p role="status">Loading…</p>;
  if (error) return <p className="form-error" role="alert">{error.message}</p>;
  if (isEmpty) return <p className="empty-state">{emptyText}</p>;
  return null;
}

export function DeleteButton({ label, onDelete, disabled }) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleConfirm() {
    setBusy(true);
    setError("");
    try {
      await onDelete();
    } catch (deleteError) {
      setError(deleteError.message);
      setBusy(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <span className="inline-confirm">
        <button className="button small danger" type="button" onClick={handleConfirm} disabled={busy}>
          {busy ? "Deleting…" : "Confirm delete"}
        </button>
        <button className="button small secondary" type="button" onClick={() => setConfirming(false)} disabled={busy}>
          Cancel
        </button>
      </span>
    );
  }

  return (
    <span className="inline-confirm">
      <button
        className="button small danger-outline"
        type="button"
        onClick={() => setConfirming(true)}
        disabled={disabled}
        aria-label={`Delete ${label}`}
      >
        <Trash2 size={15} aria-hidden="true" /> Delete
      </button>
      {error && <span className="form-error" role="alert">{error}</span>}
    </span>
  );
}
