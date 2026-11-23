import { NavLink } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function AccountNav() {
  const { status, user, isAdmin } = useAuth();

  if (status === "loading") return null;

  return (
    <span className="nav-account">
      {status === "authenticated" ? (
        <>
          {isAdmin && <NavLink to="/admin">Admin</NavLink>}
          <NavLink to="/profile">{user.name.split(" ")[0]}</NavLink>
        </>
      ) : (
        <NavLink to="/signin">Sign in</NavLink>
      )}
    </span>
  );
}
