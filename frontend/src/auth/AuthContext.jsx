import { createContext, useCallback, useContext, useMemo, useState } from "react";
import useSWR, { mutate as globalMutate } from "swr";
import { apiFetch, authedFetcher } from "../api";

const TOKEN_KEY = "portfolio-auth-token";
const AuthContext = createContext(null);

function readStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function writeStoredToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Storage can be unavailable (private mode); the session then lasts for this page only.
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(readStoredToken);

  const clearSession = useCallback(() => {
    writeStoredToken(null);
    setToken(null);
  }, []);

  const { data: user, error, mutate } = useSWR(
    token ? ["/profile", token] : null,
    authedFetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      onError(profileError) {
        if (profileError.status === 401) clearSession();
      },
    },
  );

  const signIn = useCallback(async (email, password) => {
    const result = await apiFetch("/auth/signin", {
      method: "POST",
      body: { email, password },
    });
    await globalMutate(["/profile", result.token], result.user, { revalidate: false });
    writeStoredToken(result.token);
    setToken(result.token);
    return result.user;
  }, []);

  const signUp = useCallback(async (name, email, password) => {
    await apiFetch("/auth/signup", { method: "POST", body: { name, email, password } });
    return signIn(email, password);
  }, [signIn]);

  const signOut = useCallback(async () => {
    try {
      await apiFetch("/auth/signout", { method: "POST", token });
    } finally {
      clearSession();
    }
  }, [token, clearSession]);

  const updateProfile = useCallback(async (fields) => {
    const updated = await apiFetch("/profile", { method: "PUT", token, body: fields });
    await mutate(updated, { revalidate: false });
    return updated;
  }, [token, mutate]);

  const deleteAccount = useCallback(async () => {
    await apiFetch("/profile", { method: "DELETE", token });
    clearSession();
  }, [token, clearSession]);

  let status = "anonymous";
  if (token && user) status = "authenticated";
  else if (token && !error) status = "loading";

  const value = useMemo(() => ({
    token: status === "authenticated" ? token : null,
    user: status === "authenticated" ? user : null,
    status,
    isAdmin: status === "authenticated" && user.role === "admin",
    signIn,
    signUp,
    signOut,
    updateProfile,
    deleteAccount,
  }), [token, user, status, signIn, signUp, signOut, updateProfile, deleteAccount]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
