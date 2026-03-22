import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const getInitialUser = () => {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialUser);
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL?.trim().toLowerCase();

  const login = ({ token, user: nextUser }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthenticated: Boolean(user && localStorage.getItem("token")),
      isAdmin: Boolean(adminEmail && user?.email?.trim().toLowerCase() === adminEmail),
    }),
    [user, adminEmail]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
