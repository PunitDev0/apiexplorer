"use client"

import { CheckCircle, AlertCircle, AlertTriangle } from "lucide-react"
import { Toast, ToastClose, ToastDescription, ToastTitle } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

export function Toaster() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:max-w-[420px]">
      {toasts.map((toast) => {
        const IconComponent =
          toast.variant === "success" ? CheckCircle : toast.variant === "error" ? AlertCircle : AlertTriangle

        const iconColor =
          toast.variant === "success"
            ? "text-green-600 dark:text-green-400"
            : toast.variant === "error"
              ? "text-red-600 dark:text-red-400"
              : "text-yellow-600 dark:text-yellow-400"

        return (
          <Toast key={toast.id} variant={toast.variant}>
            <div className="flex items-start gap-3">
              <IconComponent className={`h-5 w-5 ${iconColor}`} />
              <div className="grid gap-1">
                {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
                {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
              </div>
            </div>
            <ToastClose onClick={() => removeToast(toast.id)} />
          </Toast>
        )
      })}
    </div>
  )
}

