// frontend/services/workspace.service.js
import axios from "axios";

import { BASE_URL } from "@/lib/base_Url";


export const createWorkspace = async (name, ownerId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/workspaces`,
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
    console.log(response);
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create workspace" };
  }
};

export const Workspaces = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/workspaces`, {
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
    const response = await axios.get(`${BASE_URL}/workspaces/${id}`, {
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