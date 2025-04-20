import axios from "axios";

import { BASE_URL } from "@/lib/base_Url";

const API_URL = "http://localhost:3001/api/collections";
const REQUEST_API_URL = "http://localhost:3001/api/requests";

export const createCollection = async (name, workspaceId, userId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/collections`,
      {
        name,
        workspaceId,
        createdBy: userId,
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
    throw error.response?.data || { message: "Failed to create collection" };
  }
};

export const getCollections = async (workspaceId) => {
  try {
    const response = await axios.get(`${BASE_URL}/collections`, {
      params: { workspaceId },
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
      withXSRFToken: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch collections" };
  }
};

export const updateCollection = async (id, name) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/collections/${id}`,
      { name },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update collection" };
  }
};

export const deleteCollection = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/collections/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
      withXSRFToken: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete collection" };
  }
};

export const addRequestInCollection = async (collectionId, request) => {
  try {
    const response = await axios.post(
      `${API_URL}/add-request`,
      { collectionId, request },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
        withXSRFToken: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add request to collection" };
  }
};

export const getRequests = async (workspaceId) => {
  try {
    const response = await axios.get(`${BASE_URL}/requests`, {
      params: { workspaceId },
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
      withXSRFToken: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch requests" };
  };
};