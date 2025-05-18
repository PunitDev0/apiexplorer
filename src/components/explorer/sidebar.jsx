"use client";

import { useState, useCallback, useMemo, useContext, useEffect, useRef } from "react";
import {
  FileJson,
  History,
  Plus,
  Upload,
  Box,
  Globe,
  Workflow,
  ChevronDown,
  Folder,
  Edit2,
  Trash2,
  Search,
  Download,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRequest } from "@/components/explorer/request-context";
import { AuthContext } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { createCollection, updateCollection, deleteCollection, getCollections } from "@/services/collection.service";
import { useEnvironment } from "@/context/environment-context";

// Schema for environment creation
const environmentSchema = z.object({
  name: z.string().min(1, "Environment name is required").max(100, "Name too long"),
});

const collectionSchema = z.object({
  name: z.string().min(1, "Collection name is required").max(100, "Name too long"),
});

// Dialog for creating environments
const EnvironmentDialog = ({ isOpen, onOpenChange, onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(environmentSchema),
    defaultValues: { name: "" },
  });

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background text-foreground border">
        <DialogHeader>
          <DialogTitle>Create New Environment</DialogTitle>
          <DialogDescription>Enter a name for your new environment.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="py-4">
            <Input
              type="text"
              placeholder="Environment Name"
              {...register("name")}
              className="w-full bg-background text-foreground border"
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="bg-background text-foreground border hover:bg-accent"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-primary/50"
            >
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Dialog for managing environment variables
const EnvironmentVariablesDialog = ({ isOpen, onOpenChange, environment, onSave, isLoading }) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue, getValues } = useForm({
    defaultValues: {
      variables: environment?.variables?.length > 0 ? environment.variables : [{ key: "", value: "" }],
    },
  });

  useEffect(() => {
    reset({
      variables: environment?.variables?.length > 0 ? environment.variables : [{ key: "", value: "" }],
    });
  }, [environment, reset]);

  const addVariable = () => {
    const currentVars = getValues("variables");
    setValue("variables", [...currentVars, { key: "", value: "" }]);
  };

  const removeVariable = (index) => {
    const currentVars = getValues("variables");
    if (currentVars.length > 1) {
      setValue("variables", currentVars.filter((_, i) => i !== index));
    }
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background text-foreground border">
        <DialogHeader>
          <DialogTitle>Manage {environment?.name} Variables</DialogTitle>
          <DialogDescription>Add or edit environment variables.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSave)}>
          <div className="py-4 space-y-2">
            {getValues("variables").map((_, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  placeholder="Key"
                  {...register(`variables.${index}.key`)}
                  className="w-1/2 bg-background text-foreground border"
                />
                <Input
                  placeholder="Value"
                  {...register(`variables.${index}.value`)}
                  className="w-1/2 bg-background text-foreground border"
                />
                {getValues("variables").length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVariable(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addVariable}
              className="mt-2"
            >
              Add Variable
            </Button>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="bg-background text-foreground border hover:bg-accent"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-primary/50"
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// CollectionDialog
const CollectionDialog = ({ isOpen, onOpenChange, onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(collectionSchema),
    defaultValues: { name: "" },
  });

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background text-foreground border">
        <DialogHeader>
          <DialogTitle>Create New Collection</DialogTitle>
          <DialogDescription>Enter a name for your new collection.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="py-4">
            <Input
              type="text"
              placeholder="Collection Name"
              {...register("name")}
              className="w-full bg-background text-foreground border"
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="bg-background text-foreground border hover:bg-accent"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-primary/50"
            >
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// ExportCollectionDialog
const ExportCollectionDialog = ({ isOpen, onOpenChange, collections, onExport, isLoading }) => {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: { collectionId: "" },
  });
  const selectedCollectionId = watch("collectionId");

  const handleCancel = () => {
    onOpenChange(false);
  };

  const onSubmit = (data) => {
    onExport(data.collectionId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background text-foreground border">
        <DialogHeader>
          <DialogTitle>Export Collection</DialogTitle>
          <DialogDescription>Select a collection to export.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="py-4">
            <Select
              value={selectedCollectionId}
              onValueChange={(value) => setValue("collectionId", value)}
            >
              <SelectTrigger className="w-full bg-background text-foreground border">
                <SelectValue placeholder="Select a collection" />
              </SelectTrigger>
              <SelectContent>
                {collections.map((collection) => (
                  <SelectItem key={collection.id} value={collection.id}>
                    {collection.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" {...register("collectionId")} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="bg-background text-foreground border hover:bg-accent"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isLoading || !selectedCollectionId}
              className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-primary/50"
            >
              {isLoading ? "Exporting..." : "Export"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export function ExplorerSidebar({ isCollapsed = false, sidebarWidth }) {
  const { workspaceid: workspaceId } = useParams();
  const {
    requests = [],
    addRequest = () => {},
    setActiveRequest = () => {},
    updateRequest = () => {},
    activeRequestId,
    collections = [],
    setCollections = () => {},
    addCollection = () => {},
    updateCollectionName = () => {},
    removeCollection = () => {},
    history = [],
    exportCollections = () => {},
    importCollections = () => {},
  } = useRequest() || {};
  const { user } = useContext(AuthContext);
  const { theme } = useTheme();
  const router = useRouter();
  const { addToast } = useToast();
  const { environments, addEnvironment, updateEnvironmentVariables, deleteEnvironment, loading: envLoading } = useEnvironment();

  const [activeTab, setActiveTab] = useState("collections");
  const [expandedFolders, setExpandedFolders] = useState({});
  const [editingCollectionId, setEditingCollectionId] = useState(null);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isEnvironmentDialogOpen, setIsEnvironmentDialogOpen] = useState(false);
  const [isEnvVarsDialogOpen, setIsEnvVarsDialogOpen] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchCollections = async () => {
      if (!user || !workspaceId) return;
      try {
        setIsLoading(true);
        const response = await getCollections(workspaceId);
        const formattedCollections = response.data.map((col) => ({
          id: col._id,
          name: col.name,
          requests: col.requests || [],
        }));
        setCollections(formattedCollections);
      } catch (error) {
        addToast({
          variant: "error",
          title: "Error",
          description: error.message || "Failed to fetch collections",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, [workspaceId, user, setCollections, addToast]);

  const toggleFolder = useCallback((folderId) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  }, []);

  const handleRequestClick = useCallback(
    (request) => {
      const existingRequest = requests.find((r) => r?.id === request.id);
      if (existingRequest) {
        setActiveRequest(existingRequest.id);
      } else {
        const newId = addRequest();
        setActiveRequest(newId);
      }
    },
    [requests, addRequest, setActiveRequest]
  );

  const handleHistoryClick = useCallback(
    (historyItem) => {
      const existingRequest = requests.find((r) => r?.id === historyItem.id);
      if (existingRequest) {
        updateRequest(existingRequest.id, {
          method: historyItem.method,
          url: historyItem.url,
          headers: historyItem.headers || [],
          params: historyItem.params || [],
          body: historyItem.body || "",
          bodyType: historyItem.bodyType || "none",
          authType: historyItem.authType || "none",
          authData: historyItem.authData || {},
          rawType: historyItem.rawType || "Text",
        });
        setActiveRequest(existingRequest.id);
      } else {
        const newId = addRequest();
        updateRequest(newId, {
          method: historyItem.method,
          url: historyItem.url,
          headers: historyItem.headers || [],
          params: historyItem.params || [],
          body: historyItem.body || "",
          bodyType: historyItem.bodyType || "none",
          authType: historyItem.authType || "none",
          authData: historyItem.authData || {},
          rawType: historyItem.rawType || "Text",
          name: `${historyItem.method} Request ${requests.length + 1}`,
        });
        setActiveRequest(newId);
      }
    },
    [requests, addRequest, setActiveRequest, updateRequest]
  );

  const handleAddCollection = useCallback(() => {
    if (!user) {
      addToast({
        variant: "error",
        title: "Error",
        description: "You must be logged in to create a collection",
      });
      router.push("/login");
      return;
    }
    setIsCollectionDialogOpen(true);
  }, [user, router, addToast]);

  const handleCreateCollection = useCallback(
    async (data) => {
      setIsLoading(true);
      try {
        const response = await createCollection(data.name, workspaceId, user._id);
        const newCollection = {
          id: response.data._id,
          name: response.data.name,
          requests: response.data.requests || [],
        };
        setCollections((prev) => [...prev, newCollection]);
        addToast({
          variant: "success",
          title: "Success",
          description: "Collection created successfully",
        });
        setIsCollectionDialogOpen(false);
      } catch (error) {
        addToast({
          variant: "error",
          title: "Error",
          description: error.message || "Failed to create collection",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [workspaceId, user, setCollections, addToast]
  );

  const handleEditCollection = useCallback((collectionId, currentName) => {
    setEditingCollectionId(collectionId);
    setNewCollectionName(currentName);
  }, []);

  const handleSaveCollectionName = useCallback(
    async (collectionId) => {
      if (!newCollectionName.trim()) {
        setEditingCollectionId(null);
        return;
      }
      try {
        await updateCollection(collectionId, newCollectionName.trim());
        updateCollectionName(collectionId, newCollectionName.trim());
        addToast({
          variant: "success",
          title: "Success",
          description: "Collection name updated",
        });
      } catch (error) {
        addToast({
          variant: "error",
          title: "Error",
          description: error.message || "Failed to update collection",
        });
      }
      setEditingCollectionId(null);
      setNewCollectionName("");
    },
    [newCollectionName, updateCollectionName, addToast]
  );

  const handleDeleteCollection = useCallback(
    async (collectionId) => {
      try {
        await deleteCollection(collectionId);
        removeCollection(collectionId);
        addToast({
          variant: "success",
          title: "Success",
          description: "Collection deleted",
        });
      } catch (error) {
        addToast({
          variant: "error",
          title: "Error",
          description: error.message || "Failed to delete collection",
        });
      }
    },
    [removeCollection, addToast]
  );

  const handleExportCollections = useCallback(
    (collectionId) => {
      try {
        exportCollections(collectionId);
        addToast({
          variant: "success",
          title: "Success",
          description: "Collection exported successfully",
        });
        setIsExportDialogOpen(false);
      } catch (error) {
        addToast({
          variant: "error",
          title: "Error",
          description: error.message || "Failed to export collection",
        });
      }
    },
    [exportCollections, addToast]
  );

  const handleImportCollections = useCallback(
    async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      try {
        const result = await importCollections(file);
        addToast({
          variant: "success",
          title: "Success",
          description: result.message || "Collection imported successfully",
        });
      } catch (error) {
        addToast({
          variant: "error",
          title: "Error",
          description: error.message || "Failed to import collections",
        });
      } finally {
        event.target.value = null;
      }
    },
    [importCollections, addToast]
  );

  const handleCreateEnvironment = useCallback(
    async (data) => {
      setIsLoading(true);
      try {
        await addEnvironment(data.name);
        addToast({
          variant: "success",
          title: "Success",
          description: "Environment created successfully",
        });
        setIsEnvironmentDialogOpen(false);
      } catch (error) {
        addToast({
          variant: "error",
          title: "Error",
          description: error.message || "Failed to create environment",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [addEnvironment, addToast]
  );

  const handleSaveEnvironmentVariables = useCallback(
    async (data) => {
      setIsLoading(true);
      console.log(selectedEnvironment);
      
      try {
        await updateEnvironmentVariables(selectedEnvironment._id, data.variables);
        addToast({
          variant: "success",
          title: "Success",
          description: "Environment variables updated",
        });
        setIsEnvVarsDialogOpen(false);
      } catch (error) {
        addToast({
          variant: "error",
          title: "Error",
          description: error.message || "Failed to update variables",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [selectedEnvironment, updateEnvironmentVariables, addToast]
  );

  const filteredCollections = useMemo(() => {
    if (!searchQuery) return collections;
    return collections.filter(
      (col) =>
        col.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        col.requests?.some(
          (req) =>
            req.url?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.method?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [collections, searchQuery]);

  const groupedHistory = useMemo(() => {
    return history.reduce((acc, req) => {
      const date = req.date || "Unknown";
      if (!acc[date]) acc[date] = [];
      acc[date].push(req);
      return acc;
    }, {});
  }, [history]);

  return (
    <div className="h-full flex flex-col bg-background">
      <div
        className={cn(
          "p-4 border-b",
          theme === "dark" ? "border-gray-800" : "border-gray-200",
          isCollapsed && "hidden"
        )}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="max-w-full flex justify-between items-center text-foreground hover:bg-accent"
            >
              <span className="font-semibold">My Workspace</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-background text-foreground border">
            <DropdownMenuLabel className="font-semibold">Workspaces</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>My Workspace</DropdownMenuItem>
            <DropdownMenuItem>Team Workspace</DropdownMenuItem>
            <DropdownMenuItem>New Workspace</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex gap-2 mt-2">
          <Button
            onClick={() => addRequest()}
            className="flex-1 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
          <Button
            onClick={() => setIsExportDialogOpen(true)}
            variant="outline"
            className="flex-1 bg-background text-foreground border"
            disabled={collections.length === 0}
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>

        <div className="flex gap-2 mt-2">
          <Button
            variant="outline"
            className="flex-1 bg-background text-foreground border"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-1" />
            Import
          </Button>
          <input
            type="file"
            accept="application/json"
            onChange={handleImportCollections}
            className="hidden"
            ref={fileInputRef}
          />
        </div>

        <div className="mt-2">
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background text-foreground border"
            prefix={<Search className="h-4 w-4 text-muted-foreground" />}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-row">
        <div
          className={cn(
            "w-12 flex flex-col items-center py-5 border-r bg-black border-gray-800"
          )}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex flex-col space-y-2 mt-10 bg-transparent">
              <TabsTrigger
                value="collections"
                className="p-2 rounded-md data-[state=active]:bg-accent"
              >
                <Box className="h-5 w-5" />
              </TabsTrigger>
              <TabsTrigger
                value="environments"
                className="p-2 rounded-md data-[state=active]:bg-accent"
              >
                <Globe className="h-5 w-5" />
              </TabsTrigger>
              <TabsTrigger
                value="flows"
                className="p-2 rounded-md data-[state=active]:bg-accent"
              >
                <Workflow className="h-5 w-5" />
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="p-2 rounded-md data-[state=active]:bg-accent"
              >
                <History className="h-5 w-5" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className={cn("flex-1 overflow-y-auto p-4", isCollapsed && "hidden")}>
          <CollectionDialog
            isOpen={isCollectionDialogOpen}
            onOpenChange={setIsCollectionDialogOpen}
            onSubmit={handleCreateCollection}
            isLoading={isLoading}
          />
          <ExportCollectionDialog
            isOpen={isExportDialogOpen}
            onOpenChange={setIsExportDialogOpen}
            collections={collections}
            onExport={handleExportCollections}
            isLoading={isLoading}
          />
          <EnvironmentDialog
            isOpen={isEnvironmentDialogOpen}
            onOpenChange={setIsEnvironmentDialogOpen}
            onSubmit={handleCreateEnvironment}
            isLoading={isLoading || envLoading}
          />
          <EnvironmentVariablesDialog
            isOpen={isEnvVarsDialogOpen}
            onOpenChange={setIsEnvVarsDialogOpen}
            environment={selectedEnvironment}
            onSave={handleSaveEnvironmentVariables}
            isLoading={isLoading || envLoading}
          />

          {activeTab === "history" && (
            <div className="space-y-2">
              {Object.entries(groupedHistory).length > 0 ? (
                Object.entries(groupedHistory).map(([date, dateRequests]) => (
                  <div key={date} className="space-y-2">
                    <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">
                      {date}
                    </h3>
                    {dateRequests
                      .filter(
                        (req) =>
                          !searchQuery ||
                          req.url?.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((req) => (
                        <button
                          key={req.id}
                          onClick={() => handleHistoryClick(req)}
                          className={cn(
                            "flex items-center gap-2 p-2 w-full text-left hover:bg-accent rounded-md",
                            activeRequestId === req.id && "bg-accent"
                          )}
                        >
                          <span
                            className={cn(
                              "text-xs font-medium",
                              req.method === "GET" ? "text-green-500" : "text-orange-500"
                            )}
                          >
                            {req.method}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">{req.url}</span>
                        </button>
                      ))}
                  </div>
                ))
              ) : (
                <p className="text-sm text-center text-muted-foreground">No history available.</p>
              )}
            </div>
          )}

          {activeTab === "collections" && (
            <div>
              <Button
                onClick={handleAddCollection}
                className="w-full mb-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Collection
              </Button>
              {isLoading ? (
                <p className="text-sm text-center text-muted-foreground">Loading collections...</p>
              ) : collections.length === 0 ? (
                <p className="text-sm text-center text-muted-foreground">No collections available.</p>
              ) : (
                filteredCollections.map((collection) => (
                  <div key={collection.id} className="mb-2">
                    <div className="flex items-center w-full gap-2">
                      <button
                        onClick={() => toggleFolder(collection.id)}
                        className="flex-1 flex items-center gap-2 p-2 hover:bg-accent rounded-md text-foreground"
                      >
                        <Folder className="h-4 w-4 text-muted-foreground" />
                        {editingCollectionId === collection.id ? (
                          <Input
                            value={newCollectionName}
                            onChange={(e) => setNewCollectionName(e.target.value)}
                            onBlur={() => handleSaveCollectionName(collection.id)}
                            onKeyPress={(e) =>
                              e.key === "Enter" && handleSaveCollectionName(collection.id)
                            }
                            className="h-6 text-sm bg-background text-foreground border"
                            autoFocus
                          />
                        ) : (
                          <>
                            <span className="text-sm font-medium">{collection.name}</span>
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 ml-auto transition-transform text-muted-foreground",
                                expandedFolders[collection.id] && "rotate-180"
                              )}
                            />
                          </>
                        )}
                      </button>
                      <div className="flex gap-1">
                        {editingCollectionId !== collection.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCollection(collection.id, collection.name)}
                            disabled={isLoading}
                          >
                            <Edit2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCollection(collection.id)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    {expandedFolders[collection.id] && (
                      <div className="pl-4 space-y-1">
                        {collection.requests.length > 0 ? (
                          collection.requests
                            .filter(
                              (req) =>
                                !searchQuery ||
                                req.url?.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((req) => (
                              <button
                                key={req.id}
                                onClick={() => handleRequestClick(req)}
                                className={cn(
                                  "flex items-center gap-2 p-2 hover:bg-accent rounded-md w-full text-left",
                                  activeRequestId === req.id && "bg-accent"
                                )}
                              >
                                <span
                                  className={cn(
                                    "text-xs font-medium",
                                    req.method === "GET" ? "text-green-500" : "text-orange-500"
                                  )}
                                >
                                  {req.method}
                                </span>
                                <span className="text-xs text-muted-foreground truncate">
                                  {req.url}
                                </span>
                              </button>
                            ))
                        ) : (
                          <p className="text-xs text-muted-foreground pl-2">No requests</p>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "environments" && (
            <div className="space-y-2">
              <Button
                onClick={() => setIsEnvironmentDialogOpen(true)}
                className="w-full mb-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading || envLoading}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Environment
              </Button>
              {envLoading ? (
                <p className="text-sm text-center text-muted-foreground">Loading environments...</p>
              ) : environments.length === 0 ? (
                <p className="text-sm text-center text-muted-foreground">No environments available.</p>
              ) : (
                environments.map((env) => (
                  <div key={env.id} className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedEnvironment(env);
                        setIsEnvVarsDialogOpen(true);
                      }}
                      className="flex-1 flex items-center gap-2 p-2 hover:bg-accent rounded-md text-foreground"
                    >
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{env.name}</span>
                    </button>
                    {env.id !== "global" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteEnvironment(env.id)}
                        disabled={isLoading || envLoading}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "flows" && (
            <div className="text-sm text-center text-muted-foreground p-4">
              <Button variant="outline" className="w-full mb-2" disabled={isLoading}>
                Create Flow
              </Button>
              <p>Manage your workflows here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}