"use client";

import { createContext, useState, useEffect } from "react";
import { getCurrentUser, loginUser } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/lib/base_Url";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch current user on mount
  const fetchUser = async () => {
    try {
      const response = await getCurrentUser();
      setUser(response?.user);
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Login function for manual login
  const login = async (credentials) => {
    try {
      const response = await loginUser(credentials);
      setUser(response.user);
      router.push("/"); // Redirect to root after login
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await fetch(`{${BASE_URL}/auth/logout}`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      router.push("/login"); // Redirect to login after logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};