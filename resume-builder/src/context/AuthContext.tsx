import React, { createContext, useContext, useEffect, useState } from "react";

import { apiFetch, setAuthToken } from "../lib/api";

interface User {
  id?: string;
  name: string;
  plan: string;
  email?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

// ✅ Export AuthContext
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

  const refreshProfile = async () => {
    if (!localStorage.getItem("token")) {
      setUser(null);
      return;
    }
    const profile = await apiFetch<User>("/auth/profile", { method: "GET", auth: true });
    setUser(profile);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
  };

  const login = async (email: string, password: string) => {
    const data = await apiFetch<{ access_token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(data.access_token);
    setToken(data.access_token);
    setUser(data.user);
  };

  const signup = async (name: string, email: string, password: string) => {
    await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    // Auto-login after successful signup
    await login(email, password);
  };

  useEffect(() => {
    if (token) {
      refreshProfile().catch(() => {
        logout();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, signup, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};


// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
