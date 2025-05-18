'use client'
import { createContext, useContext, useState, useCallback, useEffect } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { AuthContext } from "./AuthContext";

const EnvironmentContext = createContext();

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const EnvironmentProvider = ({ children }) => {
  const { addToast } = useToast();
  const { user, getToken } = useContext(AuthContext);
  const [environments, setEnvironments] = useState([]);
  const [loading, setLoading] = useState(false);

  const showError = (err, fallback = "Something went wrong") => {
    const message = err?.response?.data?.message || fallback;
    addToast({ variant: "error", title: "Error", description: message });
  };

  const authHeaders = () => ({
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  const fetchEnvironments = useCallback(async () => {
    if (!user || !getToken()) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/environments`, authHeaders());
      setEnvironments(data);
    } catch (error) {
      if (error.response?.status === 401) {
        showError(error, "Session expired. Please log in again.");
      } else {
        showError(error, "Could not fetch environments");
      }
    } finally {
      setLoading(false);
    }
  }, [user, getToken]);

  useEffect(() => {
    fetchEnvironments();
  }, [fetchEnvironments]);

  const addEnvironment = async (name) => {
    if (!user || !getToken()) return showError(null, "Please login first!");
    if (!name.trim()) return showError(null, "Environment name is required");

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${API_URL}/environments`,
        { name: name.trim(), variables: [] },
        authHeaders()
      );
      setEnvironments((prev) => [...prev, data]);
      addToast({ variant: "success", title: "Success", description: "Environment created!" });
    } catch (error) {
      showError(error, "Environment creation failed");
    } finally {
      setLoading(false);
    }
  };

  const updateEnvironmentVariables = async (environmentId, variables) => {
    if (!user || !getToken()) return showError(null, "Please login first!");
    if (!Array.isArray(variables)) return showError(null, "Variables must be an array");

    // Validate variables format
    const validVariables = variables.filter(
      (v) => typeof v.key === "string" && typeof v.value === "string"
    );

    setLoading(true);
    try {
      const { data } = await axios.put(
        `${API_URL}/environments/${environmentId}`,
        { variables: validVariables },
        authHeaders()
      );
      setEnvironments((prev) =>
        prev.map((env) => (env._id === environmentId ? { ...env, variables: data.variables } : env))
      );
      addToast({ variant: "success", title: "Updated", description: "Variables updated!" });
    } catch (error) {
      showError(error, "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteEnvironment = async (environmentId) => {
    if (!user || !getToken()) return showError(null, "Please login first!");

    setLoading(true);
    try {
      await axios.delete(`${API_URL}/environments/${environmentId}`, authHeaders());
      setEnvironments((prev) => prev.filter((env) => env._id !== environmentId));
      addToast({ variant: "success", title: "Deleted", description: "Environment removed!" });
    } catch (error) {
      showError(error, "Deletion failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteEnvironmentVariable = async (environmentId, variableIndex) => {
    if (!user || !getToken()) return showError(null, "Please login first!");

    setLoading(true);
    try {
      const env = environments.find((e) => e._id === environmentId);
      if (!env || variableIndex < 0 || variableIndex >= env.variables.length) {
        throw new Error("Invalid variable index");
      }

      const updatedVariables = env.variables.filter((_, i) => i !== variableIndex);
      await updateEnvironmentVariables(environmentId, updatedVariables);
    } catch (error) {
      showError(error, "Variable deletion failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <EnvironmentContext.Provider
      value={{
        environments,
        addEnvironment,
        updateEnvironmentVariables,
        deleteEnvironment,
        deleteEnvironmentVariable,
        loading,
      }}
    >
      {children}
    </EnvironmentContext.Provider>
  );
};

export const useEnvironment = () => {
  const context = useContext(EnvironmentContext);
  if (!context) {
    throw new Error("useEnvironment must be used within an EnvironmentProvider.");
  }
  return context;
};