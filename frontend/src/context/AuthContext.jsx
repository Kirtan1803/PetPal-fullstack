import { useState, useEffect, useMemo, useCallback } from "react";
import AuthContext from "./auth-context";
import { notify } from "../utils/toast";

const parseToken = (token) => {
  try {
    const base64 = token.split(".")[1];
    const decoded = JSON.parse(
      decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      )
    );

    if (decoded.exp * 1000 < Date.now()) {
      return null;
    }

    return {
      username: decoded.username,
      email: decoded.email,
      isAdmin: decoded.is_staff,
    };
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const [user, setUser] = useState(() => {
    const storedToken = localStorage.getItem("token");
    return storedToken ? parseToken(storedToken) : null;
  });

  // sync across tabs
  useEffect(() => {
    const handleStorage = () => {
      const newToken = localStorage.getItem("token");
      setToken(newToken);
      setUser(newToken ? parseToken(newToken) : null);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const login = useCallback((access, refresh = null) => {
    if (!access) return;

    localStorage.setItem("token", access);
    if (refresh) localStorage.setItem("refresh", refresh);

    const parsedUser = parseToken(access);
    setUser(parsedUser);
    setToken(access);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    notify.info("Logged out");
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ token, user, login, logout }),
    [token, user, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
