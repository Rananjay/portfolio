import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireAuth({ admin = false, children }) {
  const { status, isAdmin } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <section className="page">
        <p role="status">Checking your session…</p>
      </section>
    );
  }

  if (status === "anonymous") {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }

  if (admin && !isAdmin) {
    return (
      <section className="page">
        <div className="page-heading">
          <p className="eyebrow">ADMIN ONLY</p>
          <h1>This area is for the site admin.</h1>
          <p className="lead">Your account doesn&apos;t have admin access.</p>
        </div>
        <Link className="button" to="/profile">Go to your profile</Link>
      </section>
    );
  }

  return children;
}
