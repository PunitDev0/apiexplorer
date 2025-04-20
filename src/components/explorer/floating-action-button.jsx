"use client"
import { Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useRequest } from "@/components/explorer/request-context"

export function FloatingActionButton() {
  const { activeRequestId, sendRequest, isLoading } = useRequest()

  return (
    (<div className="fixed bottom-6 right-6">
      <Button
        size="lg"
        className="rounded-full shadow-lg"
        onClick={() => sendRequest(activeRequestId)}
        disabled={isLoading[activeRequestId]}>
        {isLoading[activeRequestId] ? (
          <span className="flex items-center">
            <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Running
          </span>
        ) : (
          <span className="flex items-center">
            <Send className="mr-2 h-4 w-4" />
            Run API
          </span>
        )}
      </Button>
    </div>)
  );
}

