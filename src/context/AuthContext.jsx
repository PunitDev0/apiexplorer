"use client";

import { createContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, loginUser } from "@/services/auth.service";
import { BASE_URL } from "@/lib/base_Url";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Get token from localStorage safely
  const getToken = useCallback(() => {
    try {
      return typeof window !== "undefined"
        ? localStorage.getItem("authToken")
        : null;
    } catch (err) {
      console.error("Error accessing localStorage:", err);
      return null;
    }
  }, []);

  // Fetch current user on mount
  const fetchUser = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await getCurrentUser();
      setUser(response?.user || null);
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Login function
  const login = useCallback(async (credentials) => {
    try {
      const response = await loginUser(credentials);
      localStorage.setItem("authToken", response?.token);
      setUser(response.user);
      router.push("/");
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }, [router]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      localStorage.removeItem("authToken");
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        logout,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
