"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  Folder,
  File,
  Plus,
  Upload,
  History,
  Box,
  Globe,
  Workflow,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRequest } from "@/components/explorer/request-context";

export function Sidebar({ toggleSidebar, isSidebarOpen }) {
  const { requests, history, setActiveRequest, addRequest } = useRequest();
  const [activeTab, setActiveTab] = React.useState("history");
  const [expandedFolders, setExpandedFolders] = React.useState({});

  // Sample folder structure for "End-to-End Tests"
  const collections = [
    {
      name: "End-to-End Tests",
      requests: [
        { id: "col1", method: "GET", url: "{{baseUrl}}/api/v1/accounts" },
        { id: "col2", method: "POST", url: "{{baseUrl}}/api/v1/accounts" },
      ],
      subFolders: [
        {
          name: "End-to-End Tests",
          requests: [
            { id: "col3", method: "POST", url: "{{baseUrl}}/api/v1/accounts" },
            { id: "col4", method: "GET", url: "{{baseUrl}}/api/v1/auth" },
          ],
        },
      ],
    },
  ];

  const toggleFolder = (folderName) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderName]: !prev[folderName],
    }));
  };

  const handleRequestClick = (request) => {
    // Check if the request already exists in the requests list
    const existingRequest = requests.find((r) => r.url === request.url && r.method === request.method);
    if (existingRequest) {
      setActiveRequest(existingRequest.id);
    } else {
      // Add a new request based on the history item
      const newId = `request${requests.length + 1}`;
      const newRequest = {
        id: newId,
        name: `Request ${requests.length + 1}`,
        method: request.method,
        url: request.url,
        headers: [
          { id: "header1", name: "Accept", value: "application/json", enabled: true },
          { id: "header2", name: "Content-Type", value: "application/json", enabled: true },
        ],
        params: [],
        bodyType: "none",
        body: "",
        rawType: "JSON",
        authType: "none",
        authData: {},
      };
      setRequests((prev) => [...prev, newRequest]);
      setActiveRequest(newId);
    }
  };

  return (
    <div
      className={`bg-gray-900 text-gray-200 border-r border-gray-800 h-screen flex flex-col transition-all duration-300 ${
        isSidebarOpen ? "w-64" : "w-0"
      } overflow-hidden`}
    >
      <div className="p-4 border-b border-gray-800">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex justify-between items-center text-gray-200 hover:bg-gray-800 hover:text-white"
            >
              <span className="font-semibold">My Workspace</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-900 text-gray-200 border-gray-800">
            <DropdownMenuLabel className="text-gray-100 font-semibold">Workspaces</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-800" />
            <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800">My Workspace</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800">Team Workspace</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800">New Workspace</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex gap-2 mt-2">
          <Button
            onClick={addRequest}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
          <Button
            variant="outline"
            className="flex-1 bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700"
          >
            <Upload className="h-4 w-4 mr-1" />
            Import
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-col flex">
        <TabsList className="flex justify-around bg-gray-900 border-b border-gray-800 p-2">
          <TabsTrigger
            value="collections"
            className="text-gray-400 hover:text-white data-[state=active]:text-white data-[state=active]:bg-gray-800 rounded-md p-2"
          >
            <Box className="h-5 w-5" />
          </TabsTrigger>
          <TabsTrigger
            value="environments"
            className="text-gray-400 hover:text-white data-[state=active]:text-white data-[state=active]:bg-gray-800 rounded-md p-2"
          >
            <Globe className="h-5 w-5" />
          </TabsTrigger>
          <TabsTrigger
            value="flows"
            className="text-gray-400 hover:text-white data-[state=active]:text-white data-[state=active]:bg-gray-800 rounded-md p-2"
          >
            <Workflow className="h-5 w-5" />
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="text-gray-400 hover:text-white data-[state=active]:text-white data-[state=active]:bg-gray-800 rounded-md p-2"
          >
            <History className="h-5 w-5" />
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto p-2">
          {activeTab === "history" && (
            <div className="space-y-4">
              {history.length > 0 ? (
                Object.entries(
                  history.reduce((acc, req) => {
                    const date = req.date || "Unknown";
                    if (!acc[date]) acc[date] = [];
                    acc[date].push(req);
                    return acc;
                  }, {})
                ).map(([date, dateRequests]) => (
                  <div key={date}>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">{date}</h3>
                    {dateRequests.map((req) => (
                      <div
                        key={req.id}
                        onClick={() => handleRequestClick(req)}
                        className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-md cursor-pointer"
                      >
                        <span
                          className={`text-sm font-medium ${
                            req.method === "GET" ? "text-green-400" : "text-orange-400"
                          }`}
                        >
                          {req.method}
                        </span>
                        <span className="text-sm text-gray-300 truncate">{req.url}</span>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">No history available.</p>
              )}
            </div>
          )}
          {activeTab === "collections" && (
            <div className="text-gray-500 p-4">Collections tab content goes here.</div>
          )}
          {activeTab === "environments" && (
            <div className="text-gray-500 p-4">Environments tab content goes here.</div>
          )}
          {activeTab === "flows" && (
            <div className="text-gray-500 p-4">Flows tab content goes here.</div>
          )}
        </div>
      </Tabs>
    </div>
  );
}