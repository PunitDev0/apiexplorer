"use client"
import { Plus } from "lucide-react"

import { SidebarInset } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useRequest } from "@/components/explorer/request-context"
import { RequestPanel } from "@/components/explorer/request-panel"

export function ExplorerWorkspace() {
  const { requests, activeRequestId, setActiveRequest, addRequest } = useRequest()

  return (
    (<SidebarInset>
      <main className=" overflow-auto p-4 ">
        <Tabs
          value={activeRequestId}
          onValueChange={setActiveRequest}
          className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              {requests.map((request) => (
                <TabsTrigger key={request.id} value={request.id}>
                  {request.name}
                </TabsTrigger>
              ))}
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={addRequest}>
                <Plus className="h-4 w-4" />
                <span className="sr-only">New tab</span>
              </Button>
            </TabsList>
          </div>
          {requests.map((request) => (
            <TabsContent key={request.id} value={request.id} className="mt-4 space-y-4">
              <RequestPanel requestId={request.id} />
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </SidebarInset>)
  );
}

