// frontend/services/workspace.service.js
import axios from "axios";

const API_URL = "http://localhost:3001/api/workspaces";

export const createWorkspace = async (name, ownerId) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        name,
        ownerId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create workspace" };
  }
};

export const Workspaces = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch workspaces" };
  }
};

export const WorkspacesbyId = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch workspace" };
  }
};