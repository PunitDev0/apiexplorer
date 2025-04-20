"use client";

import * as React from "react";
import { Send, Save } from "lucide-react";
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
import { HeadersPanel } from "@/components/explorer/headers-panel";
import { ParamsPanel } from "@/components/explorer/params-panel";
import { AuthPanel } from "@/components/explorer/auth-panel";
import { ResponsePanel } from "@/components/explorer/response-panel";
import { BodyFieldsPanel } from "@/components/explorer/body-fields-panel";
import { parseCurlCommand } from "@/components/explorer/request-context";

const SaveRequestDialog = ({ isOpen, onOpenChange, collections, onSave, isLoading }) => {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: { collectionId: "" },
  });
  const selectedCollectionId = watch("collectionId");

  const handleCancel = () => {
    onOpenChange(false);
  };

  const onSubmit = (data) => {
    onSave(data.collectionId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background text-foreground border">
        <DialogHeader>
          <DialogTitle>Save Request</DialogTitle>
          <DialogDescription>Select a collection to save the request.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="py-4">
            <Select
              value={selectedCollectionId}
              onValueChange={(value) => setValue("collectionId", value)}
            >
              <SelectTrigger className="w-full bg-gray-900 text-gray-300 border-gray-800">
                <SelectValue placeholder="Select a collection" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 text-gray-300 border-gray-800">
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
                className="bg-gray-900 text-gray-300 border-gray-800 hover:bg-gray-800"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isLoading || !selectedCollectionId}
              className="bg-blue-800 text-white hover:bg-blue-900 disabled:bg-blue-800/50"
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
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
  const { addToast } = useToast();
  const request = requests.find((r) => r.id === requestId);
  const response = responses[requestId];
  const [requestTab, setRequestTab] = React.useState("body");
  const [inputError, setInputError] = React.useState("");
  const [inputValue, setInputValue] = React.useState(request?.url || "");
  const [isSaveDialogOpen, setIsSaveDialogOpen] = React.useState(false);

  React.useEffect(() => {
    // Sync inputValue with request.url when it changes
    setInputValue(request?.url || "");
  }, [request?.url]);

  if (!request) {
    return <div className="text-gray-500 p-4">Request not found.</div>;
  }

  const handleUrlInput = (e) => {
    const input = e.target.value;
    setInputValue(input);

    if (input.trim().toLowerCase().startsWith("curl")) {
      const parsed = parseCurlCommand(input);
      if (parsed) {
        console.log("Updating request with:", parsed);
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
    } else {
      updateRequest(requestId, { url: input });
      setInputError("");
    }
  };

  const handleSaveRequest = async (collectionId) => {
    try {
      await addRequestToCollection(collectionId, request);
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

  return (
    <div className="text-gray-200">
      {/* Request Input Section */}
      <div className="flex space-x-2 p-4 border-b text-xs">
        <Select
          value={request.method}
          onValueChange={(value) => updateRequest(requestId, { method: value })}
        >
          <SelectTrigger className="w-[100px] bg-gray-900 text-gray-300 focus:ring-blue-900 focus:border-blue-900">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 text-gray-300 text-xs">
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
          className="flex-1 bg-gray-900 text-gray-300 placeholder-gray-500 focus:ring-blue-900 focus:border-blue-900"
          placeholder="Enter URL or cURL command (e.g., curl -X POST ...)"
          value={inputValue}
          onChange={handleUrlInput}
        />
        <Button
          onClick={() => sendRequest(requestId)}
          disabled={isLoading[requestId]}
          className="bg-gradient-to-br from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading[requestId] ? (
            <span className="flex items-center">
              <svg
                className="mr-1 h-3 w-3 animate-spin"
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
              <Send className="mr-1 h-3 w-3" />
              Send
            </span>
          )}
        </Button>
        <Button
          onClick={() => setIsSaveDialogOpen(true)}
          disabled={collections.length === 0}
          className="bg-gradient-to-br from-green-800 to-green-900 hover:from-green-900 hover:to-green-950 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="flex items-center">
            <Save className="mr-1 h-3 w-3" />
            Save
          </span>
        </Button>
      </div>
      {inputError && <p className="text-red-500 text-xs px-4 py-1">{inputError}</p>}

      {/* Save Request Dialog */}
      <SaveRequestDialog
        isOpen={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        collections={collections}
        onSave={handleSaveRequest}
        isLoading={isLoading[requestId]}
      />

      {/* Tabs Section */}
      <Tabs
        value={requestTab}
        onValueChange={setRequestTab}
        className="w-full flex-1 flex flex-col"
      >
        <div className="border-b px-4">
          <TabsList className="h-10 rounded-lg p-1">
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
              onValueChange={(value) =>
                updateRequest(requestId, {
                  bodyType: value,
                  body:
                    value === "form-data" || value === "x-www-form-urlencoded"
                      ? []
                      : request.body || "",
                })
              }
            >
              <SelectTrigger className="w-[200px] bg-gray-900 border-gray-800 text-gray-300 focus:ring-blue-900 focus:border-blue-900">
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
                  <div key={type} className="flex items-center space-x-1">
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
                className="min-h-[200px] font-mono bg-gray-900 border-gray-800 text-gray-300 placeholder-gray-500 focus:ring-blue-900 focus:border-blue-900"
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
              className="min-h-[200px] font-mono bg-gray-900 border-gray-800 text-gray-300 placeholder-gray-500 focus:ring-blue-900 focus:border-blue-900"
              value={request.body || ""}
              onChange={(e) =>
                updateRequest(requestId, { body: e.target.value })
              }
            />
          )}
          {request.bodyType === "binary" && (
            <Input
              type="file"
              onChange={(e) =>
                updateRequest(requestId, { body: e.target.files[0] })
              }
              className="bg-gray-900 border-gray-800 text-gray-300 focus:ring-blue-900 focus:border-blue-900"
            />
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