import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useRequest } from "@/components/explorer/request-context";

export function BodyFieldsPanel({ requestId, isFormData = false }) {
  const { requests, addBodyField, updateBodyField, removeBodyField } = useRequest();
  const request = requests.find((r) => r.id === requestId);
  const fields = request.body || [];

  return (
    <div className="space-y-2">
      {fields.map((field) => (
        <div key={field.id} className="flex space-x-2 items-center">
          <Input
            placeholder="Key"
            value={field.key}
            onChange={(e) => updateBodyField(requestId, field.id, { key: e.target.value })}
            className="bg-gray-900 border-gray-800 text-gray-300 placeholder-gray-500 focus:ring-blue-900 focus:border-blue-900"
          />
          {isFormData && (
            <select
              value={field.type}
              onChange={(e) => updateBodyField(requestId, field.id, { type: e.target.value })}
              className="bg-gray-900 border-gray-800 text-gray-300 focus:ring-blue-900 focus:border-blue-900"
            >
              <option value="text">Text</option>
              <option value="file">File</option>
            </select>
          )}
          {field.type === "text" || !isFormData ? (
            <Input
              placeholder="Value"
              value={field.value}
              onChange={(e) => updateBodyField(requestId, field.id, { value: e.target.value })}
              className="bg-gray-900 border-gray-800 text-gray-300 placeholder-gray-500 focus:ring-blue-900 focus:border-blue-900"
            />
          ) : (
            <Input
              type="file"
              onChange={(e) => updateBodyField(requestId, field.id, { value: e.target.files[0] })}
              className="bg-gray-900 border-gray-800 text-gray-300 focus:ring-blue-900 focus:border-blue-900"
            />
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeBodyField(requestId, field.id)}
            className="text-gray-400 hover:text-gray-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        onClick={() => addBodyField(requestId)}
        className="bg-gray-800 hover:bg-gray-700 text-gray-300"
      >
        Add Field
      </Button>
    </div>
  );
}