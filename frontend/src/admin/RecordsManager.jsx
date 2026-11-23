import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import useAdminResource from "./useAdminResource";
import { DeleteButton, PanelState } from "./PanelState";
import { formatDate } from "../api";

const emptyRecord = {
  title: "", firstname: "", lastname: "", email: "", completion: "", description: "",
};

function toFormValues(record) {
  return {
    title: record.title || "",
    firstname: record.firstname || "",
    lastname: record.lastname || "",
    email: record.email || "",
    completion: record.completion ? record.completion.slice(0, 10) : "",
    description: record.description || "",
  };
}

function RecordForm({ singular, editing, onSubmit, onCancel }) {
  const [values, setValues] = useState(editing ? toFormValues(editing) : emptyRecord);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues(previous => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSubmit(values);
      if (!editing) setValues(emptyRecord);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="card stack-form record-form" onSubmit={handleSubmit}>
      <h3>{editing ? `Edit ${singular}` : `Add a ${singular}`}</h3>
      <label>Title
        <input name="title" value={values.title} onChange={handleChange} required maxLength={200} />
      </label>
      <div className="grid two">
        <label>First name
          <input name="firstname" value={values.firstname} onChange={handleChange} required maxLength={200} />
        </label>
        <label>Last name
          <input name="lastname" value={values.lastname} onChange={handleChange} required maxLength={200} />
        </label>
      </div>
      <label>Email
        <input name="email" type="email" value={values.email} onChange={handleChange} required maxLength={254} />
      </label>
      <label>Completion date
        <input name="completion" type="date" value={values.completion} onChange={handleChange} required />
      </label>
      <label>Description
        <textarea name="description" value={values.description} onChange={handleChange} required rows={4} maxLength={5000} />
      </label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="actions compact">
        <button className="button" type="submit" disabled={saving} aria-busy={saving}>
          {saving ? "Saving…" : editing ? "Save changes" : <><Plus size={16} aria-hidden="true" /> Add {singular}</>}
        </button>
        {editing && (
          <button className="button secondary" type="button" onClick={onCancel} disabled={saving}>Cancel</button>
        )}
      </div>
    </form>
  );
}

export default function RecordsManager({ resource, singular }) {
  const { records, error, isLoading, create, update, remove } = useAdminResource(resource);
  const [editing, setEditing] = useState(null);
  const title = resource.charAt(0).toUpperCase() + resource.slice(1);

  async function handleSubmit(values) {
    if (editing) {
      await update(editing._id, values);
      setEditing(null);
    } else {
      await create(values);
    }
  }

  return (
    <div className="admin-grid">
      <div>
        <div className="panel-heading">
          <h2>{title}</h2>
          {!isLoading && !error && <span className="count">{records.length} total</span>}
        </div>
        <PanelState
          isLoading={isLoading}
          error={error}
          isEmpty={records.length === 0}
          emptyText={`No ${resource} yet. Add your first ${singular} with the form.`}
        />
        <ul className="record-list">
          {records.map(record => (
            <li key={record._id} className={`card record${editing?._id === record._id ? " is-editing" : ""}`}>
              <div className="record-header">
                <div>
                  <h3>{record.title}</h3>
                  <p className="record-meta">
                    {record.firstname} {record.lastname} · {record.email}
                    {record.completion && <> · Completed {formatDate(record.completion)}</>}
                  </p>
                </div>
                <span className="inline-confirm">
                  <button className="button small secondary" type="button" onClick={() => setEditing(record)} aria-label={`Edit ${record.title}`}>
                    <Pencil size={15} aria-hidden="true" /> Edit
                  </button>
                  <DeleteButton
                    label={record.title}
                    onDelete={async () => {
                      await remove(record._id);
                      if (editing?._id === record._id) setEditing(null);
                    }}
                  />
                </span>
              </div>
              <p className="record-body">{record.description}</p>
            </li>
          ))}
        </ul>
      </div>
      <RecordForm
        key={editing?._id || "new"}
        singular={singular}
        editing={editing}
        onSubmit={handleSubmit}
        onCancel={() => setEditing(null)}
      />
    </div>
  );
}
