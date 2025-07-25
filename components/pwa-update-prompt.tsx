"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RefreshCw, X } from "lucide-react"

export function PWAUpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg)

        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                setShowPrompt(true)
              }
            })
          }
        })
      })
    }
  }, [])

  const handleUpdate = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" })
      window.location.reload()
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5" />
            <div>
              <p className="font-medium text-sm">Update Available</p>
              <p className="text-xs text-muted-foreground">A new version is ready to install</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleUpdate}>
              Update
            </Button>
            <Button size="sm" variant="ghost" onClick={handleDismiss}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
