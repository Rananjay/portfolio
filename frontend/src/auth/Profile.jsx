import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, ShieldCheck, Trash2 } from "lucide-react";
import { useAuth } from "./AuthContext";
import { formatDate } from "../api";

function ProfileDetails({ user, isAdmin }) {
  return (
    <aside className="card profile-summary">
      <span className="avatar" aria-hidden="true">
        {user.name.split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase()}
      </span>
      <h2>{user.name}</h2>
      <p className="contact-email">{user.email}</p>
      <dl className="detail-list">
        <div>
          <dt>Role</dt>
          <dd><span className={`role-badge${isAdmin ? " admin" : ""}`}>{isAdmin ? "Admin" : "User"}</span></dd>
        </div>
        {user.created && (
          <div>
            <dt>Member since</dt>
            <dd>{formatDate(user.created)}</dd>
          </div>
        )}
      </dl>
      {isAdmin && (
        <Link className="button secondary" to="/admin">
          <ShieldCheck size={18} /> Open admin dashboard
        </Link>
      )}
    </aside>
  );
}

function EditProfileForm({ user, updateProfile }) {
  const [values, setValues] = useState({ name: user.name, email: user.email });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues(previous => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setStatus({ type: "", message: "" });
    try {
      await updateProfile({ name: values.name.trim(), email: values.email });
      setStatus({ type: "success", message: "Profile saved." });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="card stack-form" onSubmit={handleSubmit}>
      <h2>Edit profile</h2>
      <label>Full name
        <input name="name" value={values.name} onChange={handleChange} autoComplete="name" required maxLength={200} />
      </label>
      <label>Email address
        <input name="email" type="email" value={values.email} onChange={handleChange} autoComplete="email" required maxLength={254} />
      </label>
      {status.message && (
        <p className={status.type === "error" ? "form-error" : "form-success"} role={status.type === "error" ? "alert" : "status"}>
          {status.message}
        </p>
      )}
      <button className="button" type="submit" disabled={saving} aria-busy={saving}>
        {saving ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}

function AccountActions({ signOut, deleteAccount }) {
  const navigate = useNavigate();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  async function handle(action, label) {
    setBusy(label);
    setError("");
    try {
      await action();
      navigate("/", { replace: true });
    } catch (actionError) {
      setError(actionError.message);
      setBusy("");
    }
  }

  return (
    <div className="card stack-form">
      <h2>Account</h2>
      <p>Signing out ends your session on every device.</p>
      <button className="button secondary" type="button" onClick={() => handle(signOut, "signout")} disabled={Boolean(busy)}>
        <LogOut size={18} /> {busy === "signout" ? "Signing out…" : "Sign out"}
      </button>

      <hr />

      {confirmingDelete ? (
        <div className="danger-zone" role="group" aria-labelledby="delete-heading">
          <p id="delete-heading"><strong>Delete your account?</strong> This permanently removes your profile and can&apos;t be undone.</p>
          <div className="actions compact">
            <button className="button danger" type="button" onClick={() => handle(deleteAccount, "delete")} disabled={Boolean(busy)}>
              {busy === "delete" ? "Deleting…" : "Yes, delete my account"}
            </button>
            <button className="button secondary" type="button" onClick={() => setConfirmingDelete(false)} disabled={Boolean(busy)}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button className="button danger-outline" type="button" onClick={() => setConfirmingDelete(true)}>
          <Trash2 size={18} /> Delete account
        </button>
      )}
      {error && <p className="form-error" role="alert">{error}</p>}
    </div>
  );
}

export default function Profile() {
  const { user, isAdmin, updateProfile, signOut, deleteAccount } = useAuth();

  return (
    <section className="page">
      <div className="page-heading">
        <p className="eyebrow">YOUR ACCOUNT</p>
        <h1>Hi, {user.name.split(" ")[0]}.</h1>
      </div>
      <div className="profile-grid">
        <ProfileDetails user={user} isAdmin={isAdmin} />
        <div className="profile-main">
          <EditProfileForm key={user._id} user={user} updateProfile={updateProfile} />
          <AccountActions signOut={signOut} deleteAccount={deleteAccount} />
        </div>
      </div>
    </section>
  );
}
