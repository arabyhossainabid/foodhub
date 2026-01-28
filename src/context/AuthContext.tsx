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
          let parsedUser: User | null = null;

          // If we have cached user, show it immediately and resolve loading
          if (storedUser) {
            parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setToken(storedToken);
            setLoading(false); // Resolve loading immediately to show UI
          }

          // Fetch fresh profile in background
          const res = await api.get("/auth/me");
          setUser(res.data.data);
          setToken(storedToken);
          localStorage.setItem("user", JSON.stringify(res.data.data));
        } catch (error: any) {
          if (error.response?.status === 401 || error.response?.status === 403) {
            logout();
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
