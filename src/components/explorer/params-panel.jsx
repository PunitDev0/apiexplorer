"use client";
import { Plus, Trash2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useRequest } from "@/components/explorer/request-context"

export function ParamsPanel({
  requestId
}) {
  const { requests, addParameter, updateParameter, removeParameter } = useRequest()

  const request = requests.find((r) => r.id === requestId)
  if (!request) return null

  return (
    (<div className="space-y-4">
      {request.params.length > 0 ? (
        <div className="space-y-2">
          {request.params.map((param) => (
            <div key={param.id} className="flex items-center gap-2">
              <Checkbox
                id={`param-enabled-${param.id}`}
                checked={param.enabled}
                onCheckedChange={(checked) => updateParameter(requestId, param.id, { enabled: !!checked })} />
              <Input
                placeholder="Parameter name"
                value={param.name}
                onChange={(e) => updateParameter(requestId, param.id, { name: e.target.value })}
                className="flex-1" />
              <Input
                placeholder="Parameter value"
                value={param.value}
                onChange={(e) => updateParameter(requestId, param.id, { value: e.target.value })}
                className="flex-1" />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeParameter(requestId, param.id)}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove parameter</span>
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-muted-foreground">No parameters added yet</div>
      )}
      <Button variant="outline" size="sm" onClick={() => addParameter(requestId)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Parameter
      </Button>
    </div>)
  );
}

