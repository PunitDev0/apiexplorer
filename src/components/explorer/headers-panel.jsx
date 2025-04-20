"use client";
import { Plus, Trash2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useRequest } from "@/components/explorer/request-context"

export function HeadersPanel({
  requestId
}) {
  const { requests, addHeader, updateHeader, removeHeader } = useRequest()

  const request = requests.find((r) => r.id === requestId)
  if (!request) return null

  return (
    (<div className="space-y-4 text-sm">
      {request.headers.length > 0 ? (
        <div className="space-y-2">
          {request.headers.map((header) => (
            <div key={header.id} className="flex items-center gap-2">
              <Checkbox
                id={`header-enabled-${header.id}`}
                checked={header.enabled}
                onCheckedChange={(checked) => updateHeader(requestId, header.id, { enabled: !!checked })} />
              <Input
                placeholder="Header name"
                value={header.name}
                onChange={(e) => updateHeader(requestId, header.id, { name: e.target.value })}
                className="flex-1" />
              <Input
                placeholder="Header value"
                value={header.value}
                onChange={(e) => updateHeader(requestId, header.id, { value: e.target.value })}
                className="flex-1" />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeHeader(requestId, header.id)}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove header</span>
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-muted-foreground">No headers added yet</div>
      )}
      <Button variant="outline" size="sm" onClick={() => addHeader(requestId)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Header
      </Button>
    </div>)
  );
}

