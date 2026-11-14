import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "../types";
import { api } from "../services/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.data.success) {
          setUser(res.data.data);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const login = (_token: string, userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
