"use client";

import * as React from "react";
import { Send, Save, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useRequest } from "@/components/explorer/request-context";
import { useEnvironment } from "@/context/environment-context";
import { HeadersPanel } from "@/components/explorer/headers-panel";
import { ParamsPanel } from "@/components/explorer/params-panel";
import { AuthPanel } from "@/components/explorer/auth-panel";
import { ResponsePanel } from "@/components/explorer/response-panel";
import { BodyFieldsPanel } from "@/components/explorer/body-fields-panel";
import { parseCurlCommand } from "@/components/explorer/request-context";
import { debounce } from "lodash";

const SaveRequestDialog = ({ isOpen, onOpenChange, collections, onSave, isLoading }) => {
  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: { collectionId: "" },
  });
  const selectedCollectionId = watch("collectionId");

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  React.useEffect(() => {
    if (isOpen) {
      reset({ collectionId: "" });
    }
  }, [isOpen, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background text-foreground border border-gray-800">
        <DialogHeader>
          <DialogTitle>Save Request</DialogTitle>
          <DialogDescription>Select a collection to save the request.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSave)}>
          <div className="py-4">
            <Select
              value={selectedCollectionId}
              onValueChange={(value) => setValue("collectionId", value)}
            >
              <SelectTrigger className="w-full bg-gray-900 text-gray-300 border-gray-800 focus:ring-blue-500 focus:border-blue-500">
                <SelectValue placeholder="Select a collection" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 text-gray-300 border-gray-800">
                {collections.length > 0 ? (
                  collections.map((collection) => (
                    <SelectItem key={collection.id} value={collection.id}>
                      {collection.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    No collections available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <input type="hidden" {...register("collectionId")} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="bg-gray-900 text-gray-300 border-gray-800 hover:bg-gray-800"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isLoading || !selectedCollectionId}
              className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-600/50"
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const VariablePreviewDialog = ({ isOpen, onOpenChange, preview }) => {
  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background text-foreground border border-gray-800  max-h-[70vh]">
        <DialogHeader>
          <DialogTitle>Variable Preview</DialogTitle>
          <DialogDescription>Preview of request with environment variables applied.</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <Label className="text-gray-300">URL</Label>
            <Input
              value={preview.url || "No URL provided"}
              readOnly
              className="bg-gray-900 text-gray-300 border-gray-800"
            />
          </div>
          <div >
            <Label className="text-gray-300">Headers</Label>
            <Textarea
            
              value={
                preview.headers?.length
                  ? JSON.stringify(preview.headers, null, 2)
                  : "No headers provided"
              }
              readOnly
              className="bg-gray-900 text-gray-300 border-gray-800 max-h-[40vh] font-mono text-sm"
            />
          </div>
          <div>
            <Label className="text-gray-300">Body</Label>
            <Textarea
              value={
                preview.body
                  ? typeof preview.body === "string"
                    ? preview.body
                    : JSON.stringify(preview.body, null, 2)
                  : "No body provided"
              }
              readOnly
              className="bg-gray-900 text-gray-300 border-gray-800 min-h-[100px] font-mono text-sm"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="bg-gray-900 text-gray-300 border-gray-800 hover:bg-gray-800"
              onClick={handleCancel}
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function RequestPanel({ requestId }) {
  const {
    requests,
    updateRequest,
    sendRequest,
    isLoading,
    responses,
    collections,
    addRequestToCollection,
  } = useRequest();
  const { environments } = useEnvironment();
  const { addToast } = useToast();
  const request = requests.find((r) => r.id === requestId);
  const response = responses[requestId];
  const [requestTab, setRequestTab] = React.useState("body");
  const [inputError, setInputError] = React.useState("");
  const [inputValue, setInputValue] = React.useState(request?.url || "");
  const [selectedEnvironmentId, setSelectedEnvironmentId] = React.useState("global");
  const [isSaveDialogOpen, setIsSaveDialogOpen] = React.useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = React.useState(false);
  const [preview, setPreview] = React.useState({ url: "", headers: [], body: "" });

  // Debounced URL update
  const debouncedUpdateUrl = React.useCallback(
    debounce((id, url) => {
      updateRequest(id, { url });
    }, 300),
    [updateRequest]
  );

  React.useEffect(() => {
    // Sync inputValue and environmentId with request
    setInputValue(request?.url || "");
    setSelectedEnvironmentId(request?.environmentId || "global");
  }, [request?.url, request?.environmentId]);

  if (!request) {
    return <div className="text-gray-500 p-4">Request not found.</div>;
  }

  const replaceVariables = (input, variables) => {
    if (!input || !variables?.length) return input;
    let result = input;
    try {
      variables.forEach(({ key, value }) => {
        if (!key) return;
        const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`{{${escapedKey}}}`, "g");
        result = result.replace(regex, value || "");
      });
      return result;
    } catch (error) {
      addToast({
        variant: "error",
        title: "Error",
        description: "Invalid variable format",
      });
      return input;
    }
  };

  const getRequestWithVariables = React.useMemo(() => {
    // Default to global environment if no environment is selected or "global" is chosen
    const env = environments.find((e) => e.id === selectedEnvironmentId) || 
                environments.find((e) => e.id === "global") || 
                { variables: [] };
    try {
      const newUrl = replaceVariables(request.url || "", env.variables);
      const newHeaders = request.headers?.map((header) => ({
        ...header,
        value: replaceVariables(header.value, env.variables),
      })) || [];
      let newBody = request.body;
      if (typeof request.body === "string") {
        newBody = replaceVariables(request.body, env.variables);
      } else if (Array.isArray(request.body)) {
        newBody = request.body.map((item) => ({
          ...item,
          value: replaceVariables(item.value, env.variables),
        }));
      }

      return {
        ...request,
        url: newUrl,
        headers: newHeaders,
        body: newBody,
      };
    } catch (error) {
      addToast({
        variant: "error",
        title: "Error",
        description: "Failed to apply environment variables",
      });
      return request;
    }
  }, [request, selectedEnvironmentId, environments, addToast]);

  const handleUrlInput = (e) => {
    const input = e.target.value;
    setInputValue(input);

    if (input.trim().toLowerCase().startsWith("curl")) {
      try {
        const parsed = parseCurlCommand(input);
        if (parsed) {
          updateRequest(requestId, {
            method: parsed.method,
            url: parsed.url,
            headers: parsed.headers,
            params: parsed.params,
            body: parsed.body,
            bodyType: parsed.bodyType,
            authType: parsed.authType,
            authData: parsed.authData,
            rawType: parsed.rawType,
          });
          setInputValue(parsed.url);
          setInputError("");
        } else {
          setInputError("Invalid cURL command");
        }
      } catch (error) {
        setInputError("Error parsing cURL command");
      }
    } else {
      debouncedUpdateUrl(requestId, input);
      setInputError("");
    }
  };

  const handleSendRequest = async () => {
    if (!getRequestWithVariables.url) {
      addToast({
        variant: "error",
        title: "Error",
        description: "URL is required",
      });
      return;
    }
    try {
      await sendRequest(requestId, getRequestWithVariables);
    } catch (error) {
      addToast({
        variant: "error",
        title: "Error",
        description: error.message || "Failed to send request",
      });
    }
  };

  const handleSaveRequest = async (collectionId) => {
    if (!collectionId) {
      addToast({
        variant: "error",
        title: "Error",
        description: "Please select a collection",
      });
      return;
    }
    try {
      const requestWithEnv = {
        ...request,
        environmentId: selectedEnvironmentId,
      };
      await addRequestToCollection(collectionId, requestWithEnv);
      addToast({
        variant: "success",
        title: "Success",
        description: "Request saved to collection",
      });
      setIsSaveDialogOpen(false);
    } catch (error) {
      addToast({
        variant: "error",
        title: "Error",
        description: error.message || "Failed to save request",
      });
    }
  };

  const handlePreviewVariables = () => {
    setPreview({
      url: getRequestWithVariables.url,
      headers: getRequestWithVariables.headers,
      body: getRequestWithVariables.body,
    });
    setIsPreviewDialogOpen(true);
  };

  const handleBodyTypeChange = (value) => {
    let newBody;
    if (value === "form-data" || value === "x-www-form-urlencoded") {
      newBody = Array.isArray(request.body) ? request.body : [];
    } else if (value === "raw" || value === "GraphQL") {
      newBody = typeof request.body === "string" ? request.body : "";
    } else if (value === "binary") {
      newBody = null;
    } else {
      newBody = "";
    }
    updateRequest(requestId, { bodyType: value, body: newBody });
  };

  return (
    <div className="text-gray-200 flex flex-col h-full bg-background">
      <div className="flex flex-col space-y-2 p-4 border-b border-gray-800">
        <div className="flex space-x-2">
          <Select
            value={request.method}
            onValueChange={(value) => updateRequest(requestId, { method: value })}
          >
            <SelectTrigger className="w-[100px] bg-gray-900 text-gray-300 border-gray-800 focus:ring-blue-500 focus:border-blue-500">
              <SelectValue placeholder="Method" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-gray-300 border-gray-800 text-xs">
              {["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"].map(
                (method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
          <Input
            className="flex-1 bg-gray-900 text-gray-300 placeholder-gray-500 border-gray-800 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter URL or cURL command (e.g., curl -X POST ...)"
            value={inputValue}
            onChange={handleUrlInput}
          />
          <Button
            onClick={handleSendRequest}
            disabled={isLoading[requestId]}
            className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-600/50"
          >
            {isLoading[requestId] ? (
              <span className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Sending
              </span>
            ) : (
              <span className="flex items-center">
                <Send className="mr-2 h-4 w-4" />
                Send
              </span>
            )}
          </Button>
          <Button
            onClick={() => setIsSaveDialogOpen(true)}
            disabled={collections.length === 0 || isLoading[requestId]}
            className="bg-green-600 text-white hover:bg-green-700 disabled:bg-green-600/50"
          >
            <span className="flex items-center">
              <Save className="mr-2 h-4 w-4" />
              Save
            </span>
          </Button>
        </div>
        <div className="flex space-x-2">
          <Select
            value={selectedEnvironmentId}
            onValueChange={(value) => {
              setSelectedEnvironmentId(value);
              updateRequest(requestId, { environmentId: value });
            }}
          >
            <SelectTrigger className="w-[200px] bg-gray-900 text-gray-300 border-gray-800 focus:ring-blue-500 focus:border-blue-500">
              <SelectValue placeholder="Select Environment" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-gray-300 border-gray-800">
              <SelectItem value="global">Global</SelectItem>
              {environments
                .filter((env) => env.id !== "global")
                .map((env) => (
                  <SelectItem key={env.id} value={env.id}>
                    {env.name}
                  </SelectItem>
                ))}
              {environments.length === 1 && environments[0].id === "global" && (
                <SelectItem value="" disabled>
                  No additional environments available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <Button
            onClick={handlePreviewVariables}
            className="bg-purple-600 text-white hover:bg-purple-700"
          >
            <span className="flex items-center">
              <Eye className="mr-2 h-4 w-4" />
              Preview Variables
            </span>
          </Button>
        </div>
      </div>
      {inputError && <p className="text-red-500 text-xs px-4 py-1">{inputError}</p>}

      <SaveRequestDialog
        isOpen={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        collections={collections}
        onSave={handleSaveRequest}
        isLoading={isLoading[requestId]}
      />
      <VariablePreviewDialog
        isOpen={isPreviewDialogOpen}
        onOpenChange={setIsPreviewDialogOpen}
        preview={preview}
      />

      <Tabs
        value={requestTab}
        onValueChange={setRequestTab}
        className="w-full flex-1 flex flex-col"
      >
        <div className="border-b border-gray-800 px-4">
          <TabsList className="h-10 rounded-lg p-1 bg-gray-900">
            {["headers", "params", "body", "auth"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="text-gray-300 hover:bg-gray-800 hover:text-white data-[state=active]:bg-gray-800 data-[state=active]:text-white rounded-md transition-all duration-200 capitalize"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="headers" className="py-4 flex-1 overflow-hidden">
          <div className="overflow-y-auto px-4 h-[180px]">
            <HeadersPanel requestId={requestId} />
          </div>
        </TabsContent>

        <TabsContent value="params" className="space-y-4 py-4 px-4">
          <ParamsPanel requestId={requestId} />
        </TabsContent>

        <TabsContent value="body" className="py-4 px-4">
          <div className="mb-4">
            <Select
              value={request.bodyType}
              onValueChange={handleBodyTypeChange}
            >
              <SelectTrigger className="w-[200px] bg-gray-900 border-gray-800 text-gray-300 focus:ring-blue-500 focus:border-blue-500">
                <SelectValue placeholder="Body Type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 text-gray-300 border-gray-800">
                {[
                  "none",
                  "form-data",
                  "x-www-form-urlencoded",
                  "raw",
                  "binary",
                  "GraphQL",
                ].map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {request.bodyType === "form-data" && (
            <BodyFieldsPanel requestId={requestId} isFormData={true} />
          )}
          {request.bodyType === "x-www-form-urlencoded" && (
            <BodyFieldsPanel requestId={requestId} isFormData={false} />
          )}
          {request.bodyType === "raw" && (
            <div className="space-y-4">
              <RadioGroup
                value={request.rawType}
                onValueChange={(value) =>
                  updateRequest(requestId, { rawType: value })
                }
                className="flex flex-wrap gap-4"
              >
                {["Text", "JavaScript", "JSON", "HTML", "XML"].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={type}
                      id={`raw-${type.toLowerCase()}`}
                    />
                    <Label
                      htmlFor={`raw-${type.toLowerCase()}`}
                      className="text-gray-300"
                    >
                      {type}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              <Textarea
                placeholder={`Request body (${request.rawType})`}
                className="min-h-[200px] font-mono bg-gray-900 border-gray-800 text-gray-300 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                value={request.body || ""}
                onChange={(e) =>
                  updateRequest(requestId, { body: e.target.value })
                }
              />
            </div>
          )}
          {request.bodyType === "GraphQL" && (
            <Textarea
              placeholder="GraphQL Query (e.g., query { ... })"
              className="min-h-[200px] font-mono bg-gray-900 border-gray-800 text-gray-300 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
              value={request.body || ""}
              onChange={(e) =>
                updateRequest(requestId, { body: e.target.value })
              }
            />
          )}
          {request.bodyType === "binary" && (
            <div className="space-y-2">
              <Input
                type="file"
                accept="*/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    updateRequest(requestId, { body: file });
                    addToast({
                      variant: "success",
                      title: "File Selected",
                      description: `Selected file: ${file.name}`,
                    });
                  } else {
                    addToast({
                      variant: "error",
                      title: "Error",
                      description: "No file selected",
                    });
                  }
                }}
                className="bg-gray-900 border-gray-800 text-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              {request.body instanceof File && (
                <p className="text-sm text-gray-500">Selected: {request.body.name}</p>
              )}
            </div>
          )}
          {request.bodyType === "none" && (
            <p className="text-gray-500">No body content for this request.</p>
          )}
        </TabsContent>

        <TabsContent value="auth" className="space-y-4 py-4 px-4">
          <AuthPanel requestId={requestId} />
        </TabsContent>
      </Tabs>

      <ResponsePanel requestId={requestId} />
    </div>
  );
}