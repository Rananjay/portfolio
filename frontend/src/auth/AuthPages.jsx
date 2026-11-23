import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useAuth } from "./AuthContext";

const MIN_PASSWORD_LENGTH = 12;

function AuthShell({ eyebrow, title, intro, children, footer }) {
  return (
    <section className="page auth-page">
      <div className="card auth-card">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
        {children}
        <p className="auth-footer">{footer}</p>
      </div>
    </section>
  );
}

function useAuthForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues(previous => ({ ...previous, [name]: value }));
  }

  async function run(action) {
    setError("");
    setSubmitting(true);
    try {
      await action();
    } catch (actionError) {
      setError(actionError.message);
      setSubmitting(false);
    }
  }

  return { values, error, setError, submitting, handleChange, run };
}

function destinationFor(user, location) {
  return location.state?.from || (user.role === "admin" ? "/admin" : "/profile");
}

export function SignIn() {
  const { status, user, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { values, error, submitting, handleChange, run } = useAuthForm({ email: "", password: "" });

  if (status === "authenticated" && !submitting) {
    return <Navigate to={destinationFor(user, location)} replace />;
  }

  function handleSubmit(event) {
    event.preventDefault();
    run(async () => {
      const signedInUser = await signIn(values.email, values.password);
      navigate(destinationFor(signedInUser, location), { replace: true });
    });
  }

  return (
    <AuthShell
      eyebrow="WELCOME BACK"
      title="Sign in"
      intro="Sign in to manage your profile, or the portfolio if you're the admin."
      footer={<>New here? <Link className="text-link" to="/signup" state={location.state}>Create an account</Link></>}
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>Email address
          <input name="email" type="email" value={values.email} onChange={handleChange} autoComplete="email" required maxLength={254} />
        </label>
        <label>Password
          <input name="password" type="password" value={values.password} onChange={handleChange} autoComplete="current-password" required />
        </label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button" type="submit" disabled={submitting} aria-busy={submitting}>
          {submitting ? "Signing in…" : "Sign in"} <ArrowUpRight size={18} />
        </button>
      </form>
    </AuthShell>
  );
}

export function SignUp() {
  const { status, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { values, error, setError, submitting, handleChange, run } = useAuthForm({
    name: "", email: "", password: "", confirm: "",
  });

  if (status === "authenticated" && !submitting) {
    return <Navigate to="/profile" replace />;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (values.password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (values.password !== values.confirm) {
      setError("Passwords don't match.");
      return;
    }
    run(async () => {
      const newUser = await signUp(values.name.trim(), values.email, values.password);
      navigate(destinationFor(newUser, location), { replace: true });
    });
  }

  return (
    <AuthShell
      eyebrow="JOIN"
      title="Create an account"
      intro="Create an account to keep a profile on this site."
      footer={<>Already have an account? <Link className="text-link" to="/signin" state={location.state}>Sign in</Link></>}
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>Full name
          <input name="name" value={values.name} onChange={handleChange} autoComplete="name" required maxLength={200} />
        </label>
        <label>Email address
          <input name="email" type="email" value={values.email} onChange={handleChange} autoComplete="email" required maxLength={254} />
        </label>
        <div className="field">
          <label>Password
            <input name="password" type="password" value={values.password} onChange={handleChange} autoComplete="new-password" required minLength={MIN_PASSWORD_LENGTH} aria-describedby="password-hint" />
          </label>
          <small id="password-hint" className="field-hint">At least {MIN_PASSWORD_LENGTH} characters.</small>
        </div>
        <label>Confirm password
          <input name="confirm" type="password" value={values.confirm} onChange={handleChange} autoComplete="new-password" required />
        </label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button" type="submit" disabled={submitting} aria-busy={submitting}>
          {submitting ? "Creating account…" : "Create account"} <ArrowUpRight size={18} />
        </button>
      </form>
    </AuthShell>
  );
}
