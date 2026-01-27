"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken) {
        try {
          // Optimization: Set local storage data immediately to reduce flicker
          if (storedUser) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
          }

          const res = await api.get("/auth/me");
          setUser(res.data.data);
          setToken(storedToken);
          localStorage.setItem("user", JSON.stringify(res.data.data));
        } catch (error: any) {
          // Only logout on 401 Unauthorized or 403 Forbidden
          if (error.response?.status === 401 || error.response?.status === 403) {
            console.error("Auth session invalid:", error);
            logout();
          } else {
            console.error("Profile fetch failed (non-auth error):", error);
            // On other errors (like 429), keep local state if it exists
          }
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));

    // Redirect based on role
    if (newUser.role === "ADMIN") router.push("/admin/dashboard");
    else if (newUser.role === "PROVIDER") router.push("/provider/dashboard");
    else router.push("/");

    toast.success(`Welcome back, ${newUser.name}!`);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
