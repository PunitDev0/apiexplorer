"use client";
import { useRequest } from "@/components/explorer/request-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AuthPanel({
  requestId
}) {
  const { requests, updateRequest } = useRequest()

  const request = requests.find((r) => r.id === requestId)
  if (!request) return null

  const handleAuthTypeChange = (value) => {
    updateRequest(requestId, { authType: value, authData: {} })
  }

  return (
    (<div className="space-y-4">
      <Select value={request.authType} onValueChange={handleAuthTypeChange}>
        <SelectTrigger>
          <SelectValue placeholder="Auth Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No Auth</SelectItem>
          <SelectItem value="basic">Basic Auth</SelectItem>
          <SelectItem value="bearer">Bearer Token</SelectItem>
          <SelectItem value="oauth2">OAuth 2.0</SelectItem>
          <SelectItem value="apikey">API Key</SelectItem>
        </SelectContent>
      </Select>
      {request.authType === "basic" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Username"
              value={request.authData.username || ""}
              onChange={(e) =>
                updateRequest(requestId, {
                  authData: { ...request.authData, username: e.target.value },
                })
              } />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={request.authData.password || ""}
              onChange={(e) =>
                updateRequest(requestId, {
                  authData: { ...request.authData, password: e.target.value },
                })
              } />
          </div>
        </div>
      )}
      {request.authType === "bearer" && (
        <div className="space-y-2">
          <Label htmlFor="token">Token</Label>
          <Input
            id="token"
            placeholder="Bearer Token"
            value={request.authData.token || ""}
            onChange={(e) =>
              updateRequest(requestId, {
                authData: { ...request.authData, token: e.target.value },
              })
            } />
        </div>
      )}
      {request.authType === "apikey" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="key">Key</Label>
            <Input
              id="key"
              placeholder="API Key Name"
              value={request.authData.key || ""}
              onChange={(e) =>
                updateRequest(requestId, {
                  authData: { ...request.authData, key: e.target.value },
                })
              } />
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Value</Label>
            <Input
              id="value"
              placeholder="API Key Value"
              value={request.authData.value || ""}
              onChange={(e) =>
                updateRequest(requestId, {
                  authData: { ...request.authData, value: e.target.value },
                })
              } />
          </div>
          <Select
            value={request.authData.addTo || "header"}
            onValueChange={(value) =>
              updateRequest(requestId, {
                authData: { ...request.authData, addTo: value },
              })
            }>
            <SelectTrigger>
              <SelectValue placeholder="Add to" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="header">Header</SelectItem>
              <SelectItem value="query">Query Parameter</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      {request.authType === "oauth2" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accessToken">Access Token</Label>
            <Input
              id="accessToken"
              placeholder="Access Token"
              value={request.authData.accessToken || ""}
              onChange={(e) =>
                updateRequest(requestId, {
                  authData: { ...request.authData, accessToken: e.target.value },
                })
              } />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tokenType">Token Type</Label>
            <Input
              id="tokenType"
              placeholder="Token Type"
              value={request.authData.tokenType || "Bearer"}
              onChange={(e) =>
                updateRequest(requestId, {
                  authData: { ...request.authData, tokenType: e.target.value },
                })
              } />
          </div>
        </div>
      )}
    </div>)
  );
}

