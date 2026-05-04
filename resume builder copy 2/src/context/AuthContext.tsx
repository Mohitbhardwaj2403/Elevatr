import React, { createContext, useContext, useState } from "react";

interface User {
  name: string;
  plan: string;
}

export interface AuthContextType {
  user: User | null;
  login: (name: string, plan: string) => void;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<void>;
}

// ✅ Export AuthContext
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (name: string, plan: string) => {
    setUser({ name, plan });
  };

  const logout = () => {
    setUser(null);
  };

  const signup = async (name: string, email: string, password: string) => {
    console.log("Signing up:", { name, email, password });
    setUser({ name, plan: "basic" });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
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
