import { useState } from "react";
import useAdminResource from "./useAdminResource";
import { DeleteButton, PanelState } from "./PanelState";
import { formatDate } from "../api";

export default function Messages() {
  const { records, error, isLoading, remove, update } = useAdminResource("contacts");
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  async function saveMessage(event, record) {
    event.preventDefault();
    if (saving) return;
    const message = draft.trim();
    if (!message) {
      setSaveError("Enter a message before saving.");
      return;
    }
    setSaving(true);
    setSaveError("");
    try {
      const { firstname, lastname, email, phone } = record;
      await update(record._id, { firstname, lastname, email, phone: phone ?? "", message });
      setEditingId(null);
    } catch (err) {
      setSaveError(err.message || "Could not save the message.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="panel-heading">
        <h2>Messages</h2>
        {!isLoading && !error && <span className="count">{records.length} total</span>}
      </div>
      <PanelState
        isLoading={isLoading}
        error={error}
        isEmpty={records.length === 0}
        emptyText="No messages yet. Submissions from the contact form will appear here."
      />
      <ul className="record-list">
        {records.map(message => {
          const name = `${message.firstname} ${message.lastname}`;
          return (
            <li key={message._id} className="card record">
              <div className="record-header">
                <div>
                  <h3>{name}</h3>
                  <p className="record-meta">
                    <a className="contact-email" href={`mailto:${message.email}`}>{message.email}</a>
                    {message.phone && <> · {message.phone}</>}
                    {message.createdAt && <> · {formatDate(message.createdAt)}</>}
                  </p>
                </div>
                {editingId === null && (
                  <div>
                    <button type="button" onClick={() => {
                      setEditingId(message._id);
                      setDraft(message.message);
                      setSaveError("");
                    }}>Edit</button>
                    <DeleteButton label={`message from ${name}`} onDelete={() => remove(message._id)} />
                  </div>
                )}
              </div>
              {editingId === message._id ? (
                <form onSubmit={event => saveMessage(event, message)}>
                  <label>
                    Message
                    <textarea value={draft} onChange={event => setDraft(event.target.value)} disabled={saving} required />
                  </label>
                  {saveError && <p role="alert">{saveError}</p>}
                  <button type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
                  <button type="button" disabled={saving} onClick={() => setEditingId(null)}>Cancel</button>
                </form>
              ) : <p className="record-body">{message.message}</p>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
