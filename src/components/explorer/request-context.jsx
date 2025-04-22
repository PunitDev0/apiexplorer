"use client";

import * as React from "react";
import axios from "axios";
import { addRequestInCollection, } from "@/services/collection.service";
import { BASE_URL } from "@/lib/base_Url";

const RequestContext = React.createContext(undefined);

export const parseCurlCommand = (curlString) => {
  try {
    const parts = curlString.match(/(?:[^\s"']+|"[^"]*"|'[^']*')/g) || [];
    const request = {
      method: "GET",
      url: "",
      headers: [],
      params: [],
      body: "",
      bodyType: "none",
      authType: "none",
      authData: {},
      rawType: "Text",
    };

    let i = 0;
    while (i < parts.length) {
      let part = parts[i];

      if (part.startsWith('"') || part.startsWith("'")) {
        part = part.slice(1, -1);
      }

      if (!part.startsWith("-") && !request.url && i > 0) {
        request.url = part;
        i++;
        continue;
      }

      if (part === "-X" || part === "--request") {
        request.method = parts[++i].replace(/^['"]|['"]$/g, "").toUpperCase();
      } else if (part === "-H" || part === "--header") {
        let headerPart = parts[++i];
        if (headerPart.startsWith('"') || part.startsWith("'")) {
          headerPart = headerPart.slice(1, -1);
        }
        const header = headerPart.split(":").map((s) => s.trim());
        if (header.length >= 2) {
          request.headers.push({
            id: `header${request.headers.length + 1}`,
            name: header[0],
            value: header.slice(1).join(":").trim(),
            enabled: true,
          });
        }
      } else if (
        part === "-d" ||
        part === "--data" ||
        part === "--data-raw" ||
        part === "--data-binary"
      ) {
        let bodyPart = parts[++i];
        if (!bodyPart) {
          i++;
          continue;
        }
        if (bodyPart.startsWith('"') || bodyPart.startsWith("'")) {
          bodyPart = bodyPart.slice(1, -1);
        }
        bodyPart = bodyPart.replace(/\\"/g, '"').replace(/\\'/g, "'");
        request.body = bodyPart;
        request.bodyType = "raw";
        request.method = request.method === "GET" ? "POST" : request.method;
        if (!request.headers.some((h) => h.name.toLowerCase() === "content-type")) {
          request.headers.push({
            id: `header${request.headers.length + 1}`,
            name: "Content-Type",
            value: "application/x-www-form-urlencoded",
            enabled: true,
          });
        }
      } else if (part === "-u" || part === "--user") {
        let userPart = parts[++i];
        if (userPart.startsWith('"') || userPart.startsWith("'")) {
          userPart = userPart.slice(1, -1);
        }
        const [username, password] = userPart.split(":");
        request.authType = "basic";
        request.authData = { username, password: password || "" };
      } else if (part === "--url") {
        request.url = parts[++i].replace(/^['"]|['"]$/g, "");
      } else if (part.startsWith("-")) {
        if (i + 1 < parts.length && !parts[i + 1].startsWith("-")) i++;
      }
      i++;
    }

    if (request.url.includes("?")) {
      const [baseUrl, queryString] = request.url.split("?");
      request.url = baseUrl;
      const params = new URLSearchParams(queryString);
      params.forEach((value, name) => {
        request.params.push({
          id: `param${request.params.length + 1}`,
          name,
          value,
          enabled: true,
        });
      });
    }

    const contentTypeHeader = request.headers.find(
      (h) => h.name.toLowerCase() === "content-type"
    );
    if (contentTypeHeader) {
      const contentType = contentTypeHeader.value.toLowerCase();
      request.rawType = contentType.includes("json")
        ? "JSON"
        : contentType.includes("xml")
        ? "XML"
        : contentType.includes("text")
        ? "Text"
        : contentType.includes("javascript")
        ? "JavaScript"
        : contentType.includes("html")
        ? "HTML"
        : "Text";
    }

    if (request.rawType === "JSON" && request.body) {
      try {
        JSON.parse(request.body);
      } catch (e) {
        console.warn("Invalid JSON body:", request.body);
        request.rawType = "Text";
      }
    }

    return request;
  } catch (error) {
    console.error("Failed to parse cURL command:", error);
    return null;
  }
};

export function RequestProvider({ children, workspaceId }) {
  const [requests, setRequests] = React.useState([
    {
      id: "request1",
      name: "GET Request 1",
      method: "GET",
      url: "",
      headers: [
        { id: "header1", name: "Accept", value: "application/json", enabled: true },
        { id: "header2", name: "Content-Type", value: "application/json", enabled: true },
        { id: "header3", name: "Cache-Control", value: "no-cache", enabled: true },
        { id: "header5", name: "Accept-Encoding", value: "gzip, deflate, br", enabled: true },
        { id: "header6", name: "Connection", value: "keep-alive", enabled: true },
      ],
      params: [],
      bodyType: "raw",
      body: "",
      rawType: "JSON",
      authType: "none",
      authData: {},
    },
  ]);

  const [collections, setCollections] = React.useState([]);
  const [activeRequestId, setActiveRequestId] = React.useState("request1");
  const [responses, setResponses] = React.useState({});
  const [isLoading, setIsLoading] = React.useState({});
  const [history, setHistory] = React.useState([]);

  React.useEffect(() => {
    const loadHistory = () => {
      if (typeof window !== "undefined") {
        const historyKey = `workspace_${workspaceId}_history`;
        const storedHistory = localStorage.getItem(historyKey);
        if (storedHistory) {
          const { data, timestamp } = JSON.parse(storedHistory);
          const now = new Date();
          const oneDayInMs = 24 * 60 * 60 * 1000;
          if (now - new Date(timestamp) < oneDayInMs) {
            return data;
          } else {
            localStorage.removeItem(historyKey);
            return [];
          }
        }
        return [];
      }
      return [];
    };

    setHistory(loadHistory());
  }, [workspaceId]);

  const saveHistory = (newHistory) => {
    if (typeof window !== "undefined") {
      const historyKey = `workspace_${workspaceId}_history`;
      const dataToSave = {
        data: newHistory,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(historyKey, JSON.stringify(dataToSave));
    }
    setHistory(newHistory);
  };

  const addToHistory = React.useCallback(
    (request) => {
      const newHistory = [
        ...history.filter((h) => h.id !== request.id),
        {
          id: request.id,
          method: request.method,
          url: request.url,
          headers: request.headers,
          params: request.params,
          body: request.body,
          bodyType: request.bodyType,
          authType: request.authType,
          authData: request.authData,
          rawType: request.rawType,
          date: new Date().toLocaleDateString(),
        },
      ].slice(-10);
      saveHistory(newHistory);
    },
    [history]
  );

  const addCollection = React.useCallback(
    (name) => {
      const newCollection = {
        id: `col${collections.length + 1}`,
        name,
        requests: [],
      };
      setCollections((prev) => [...prev, newCollection]);
    },
    [collections]
  );

  const updateCollectionName = React.useCallback((collectionId, newName) => {
    setCollections((prev) =>
      prev.map((col) => (col.id === collectionId ? { ...col, name: newName } : col))
    );
  }, []);

  const removeCollection = React.useCallback((collectionId) => {
    setCollections((prev) => prev.filter((col) => col.id !== collectionId));
  }, []);

  const addRequestToCollection = React.useCallback(
    async (collectionId, request) => {
      try {
        // Call backend API to save request to collection
        const response = await addRequestInCollection(collectionId, request);
        const savedRequest = response.data;

        // Update client-side state
        setCollections((prev) =>
          prev.map((col) =>
            col.id === collectionId
              ? { ...col, requests: [...col.requests, savedRequest] }
              : col
          )
        );

        // Update requests state if the request is new
        setRequests((prev) => {
          const existingRequest = prev.find((r) => r.id === savedRequest.id);
          if (!existingRequest) {
            return [...prev, savedRequest];
          }
          return prev;
        });
      } catch (error) {
        console.error("Failed to add request to collection:", error);
        throw new Error(error.message || "Failed to add request to collection");
      }
    },
    []
  );

  const addRequest = React.useCallback(
    (collectionId = null) => {
      const newId = `request${requests.length + 1}`;
      const newRequest = {
        id: newId,
        name: `GET Request ${requests.length + 1}`,
        method: "GET",
        url: "",
        headers: [
          { id: "header1", name: "Accept", value: "application/json", enabled: true },
          { id: "header2", name: "Content-Type", value: "application/json", enabled: true },
          { id: "header3", name: "Cache-Control", value: "no-cache", enabled: true },
          { id: "header5", name: "Accept-Encoding", value: "gzip, deflate, br", enabled: true },
          { id: "header6", name: "Connection", value: "keep-alive", enabled: true },
        ],
        params: [],
        bodyType: "raw",
        body: "",
        rawType: "JSON",
        authType: "none",
        authData: {},
      };
      setRequests((prev) => [...prev, newRequest]);
      if (collectionId) {
        addRequestToCollection(collectionId, newRequest);
      }
      setActiveRequestId(newId);
      return newId;
    },
    [requests, addRequestToCollection]
  );

  const updateRequest = React.useCallback((id, updates) => {
    setRequests((prev) =>
      prev.map((request) => (request.id === id ? { ...request, ...updates } : request))
    );
  }, []);

  const removeRequest = React.useCallback(
    (id) => {
      setRequests((prev) => prev.filter((request) => request.id !== id));
      if (activeRequestId === id && requests.length > 1) {
        setActiveRequestId(requests[0].id === id ? requests[1].id : requests[0].id);
      }
    },
    [activeRequestId, requests]
  );

  const setActiveRequest = React.useCallback((id) => {
    setActiveRequestId(id);
  }, []);

  const addHeader = React.useCallback((requestId) => {
    setRequests((prev) =>
      prev.map((request) => {
        if (request.id === requestId) {
          const newHeader = {
            id: `header${request.headers.length + 1}`,
            name: "",
            value: "",
            enabled: true,
          };
          return { ...request, headers: [...request.headers, newHeader] };
        }
        return request;
      })
    );
  }, []);

  const updateHeader = React.useCallback((requestId, headerId, updates) => {
    setRequests((prev) =>
      prev.map((request) => {
        if (request.id === requestId) {
          const updatedHeaders = request.headers.map((header) =>
            header.id === headerId ? { ...header, ...updates } : header
          );
          return { ...request, headers: updatedHeaders };
        }
        return request;
      })
    );
  }, []);

  const removeHeader = React.useCallback((requestId, headerId) => {
    setRequests((prev) =>
      prev.map((request) => {
        if (request.id === requestId) {
          return {
            ...request,
            headers: request.headers.filter((header) => header.id !== headerId),
          };
        }
        return request;
      })
    );
  }, []);

  const addParameter = React.useCallback((requestId) => {
    setRequests((prev) =>
      prev.map((request) => {
        if (request.id === requestId) {
          const newParam = {
            id: `param${request.params.length + 1}`,
            name: "",
            value: "",
            enabled: true,
          };
          return { ...request, params: [...request.params, newParam] };
        }
        return request;
      })
    );
  }, []);

  const updateParameter = React.useCallback((requestId, paramId, updates) => {
    setRequests((prev) =>
      prev.map((request) => {
        if (request.id === requestId) {
          const updatedParams = request.params.map((param) =>
            param.id === paramId ? { ...param, ...updates } : param
          );
          return { ...request, params: updatedParams };
        }
        return request;
      })
    );
  }, []);

  const removeParameter = React.useCallback((requestId, paramId) => {
    setRequests((prev) =>
      prev.map((request) => {
        if (request.id === requestId) {
          return {
            ...request,
            params: request.params.filter((param) => param.id !== paramId),
          };
        }
        return request;
      })
    );
  }, []);

  const addBodyField = React.useCallback((requestId) => {
    setRequests((prev) =>
      prev.map((request) => {
        if (request.id === requestId) {
          const newField = {
            id: `field${(request.body?.length || 0) + 1}`,
            key: "",
            value: "",
            type: "text",
          };
          return {
            ...request,
            body:
              request.bodyType === "form-data" || request.bodyType === "x-www-form-urlencoded"
                ? [...(request.body || []), newField]
                : request.body,
          };
        }
        return request;
      })
    );
  }, []);

  const updateBodyField = React.useCallback((requestId, fieldId, updates) => {
    setRequests((prev) =>
      prev.map((request) => {
        if (request.id === requestId) {
          const updatedBody = (request.body || []).map((field) =>
            field.id === fieldId ? { ...field, ...updates } : field
          );
          return { ...request, body: updatedBody };
        }
        return request;
      })
    );
  }, []);

  const removeBodyField = React.useCallback((requestId, fieldId) => {
    setRequests((prev) =>
      prev.map((request) => {
        if (request.id === requestId) {
          return {
            ...request,
            body: (request.body || []).filter((field) => field.id !== fieldId),
          };
        }
        return request;
      })
    );
  }, []);

  const sendRequest = React.useCallback(
    async (requestId) => {
      const request = requests.find((r) => r.id === requestId);
      if (!request) return;

      setIsLoading((prev) => ({ ...prev, [requestId]: true }));

      try {
        const response = await axios.post(`${BASE_URL}/request`, {
          method: request.method,
          url: request.url,
          headers: request.headers,
          params: request.params,
          body: request.body,
          bodyType: request.bodyType,
          authType: request.authType,
          authData: request.authData,
        });

        setResponses((prev) => ({
          ...prev,
          [requestId]: response.data,
        }));

        addToHistory({
          id: requestId,
          method: request.method,
          url: request.url,
          headers: request.headers,
          params: request.params,
          body: request.body,
          bodyType: request.bodyType,
          authType: request.authType,
          authData: request.authData,
          rawType: request.rawType,
        });
      } catch (error) {
        console.error("Request failed:", error);
        const errorResponse = error.response?.data || {
          statusCode: 0,
          statusText: "Error",
          responseTime: 0,
          headers: {},
          body: error.message || "Request failed",
          size: 0,
        };
        setResponses((prev) => ({
          ...prev,
          [requestId]: errorResponse,
        }));
      } finally {
        setIsLoading((prev) => ({ ...prev, [requestId]: false }));
      }
    },
    [requests, addToHistory]
  );

  const exportCollections = React.useCallback(
    (collectionId) => {
      try {
        const collection = collections.find((col) => col.id === collectionId);
        if (!collection) {
          throw new Error("Collection not found");
        }
        const data = JSON.stringify([collection], null, 2);
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${collection.name.replace(/\s+/g, "_")}_collection.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Failed to export collection:", error);
        throw new Error(error.message || "Failed to export collection");
      }
    },
    [collections]
  );

  const importCollections = React.useCallback(
    async (file) => {
      try {
        const text = await file.text();
        const importedCollections = JSON.parse(text);

        if (!Array.isArray(importedCollections)) {
          throw new Error("Invalid collections format");
        }

        for (const collection of importedCollections) {
          if (!collection.id || !collection.name || !Array.isArray(collection.requests)) {
            throw new Error("Invalid collection structure");
          }
          for (const request of collection.requests) {
            if (
              !request.id ||
              !request.name ||
              !request.method ||
              !request.url ||
              !Array.isArray(request.headers) ||
              !Array.isArray(request.params)
            ) {
              throw new Error("Invalid request structure");
            }
          }
        }

        setCollections((prev) => {
          const existingIds = new Set(prev.map((col) => col.id));
          const newCollections = importedCollections.filter(
            (col) => !existingIds.has(col.id)
          );
          return [...prev, ...newCollections];
        });

        const newRequests = importedCollections.flatMap((col) => col.requests);
        setRequests((prev) => {
          const existingRequestIds = new Set(prev.map((req) => req.id));
          const uniqueNewRequests = newRequests.filter(
            (req) => !existingRequestIds.has(req.id)
          );
          return [...prev, ...uniqueNewRequests];
        });

        return { success: true, message: "Collections imported successfully" };
      } catch (error) {
        console.error("Failed to import collections:", error);
        throw new Error(error.message || "Failed to import collections");
      }
    },
    []
  );

  const value = React.useMemo(
    () => ({
      requests,
      collections,
      activeRequestId,
      responses,
      history,
      addRequest,
      updateRequest,
      removeRequest,
      setActiveRequest,
      addHeader,
      updateHeader,
      removeHeader,
      addParameter,
      updateParameter,
      removeParameter,
      addBodyField,
      updateBodyField,
      removeBodyField,
      sendRequest,
      isLoading,
      addCollection,
      updateCollectionName,
      removeCollection,
      addRequestToCollection,
      setCollections,
      exportCollections,
      importCollections,
    }),
    [
      requests,
      collections,
      activeRequestId,
      responses,
      history,
      addRequest,
      updateRequest,
      removeRequest,
      setActiveRequest,
      addHeader,
      updateHeader,
      removeHeader,
      addParameter,
      updateParameter,
      removeParameter,
      addBodyField,
      updateBodyField,
      removeBodyField,
      sendRequest,
      isLoading,
      addCollection,
      updateCollectionName,
      removeCollection,
      addRequestToCollection,
      setCollections,
      exportCollections,
      importCollections,
    ]
  );

  return <RequestContext.Provider value={value}>{children}</RequestContext.Provider>;
}

export function useRequest() {
  const context = React.useContext(RequestContext);
  if (context === undefined) {
    throw new Error("useRequest must be used within a RequestProvider");
  }
  return context;
}