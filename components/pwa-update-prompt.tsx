"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export function PWAUpdatePrompt() {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false)
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return
    }

    // Create a custom event channel for the service worker to communicate with this component
    const channel = new BroadcastChannel('sw-updates')
    channel.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
        setShowUpdatePrompt(true)
        setWaitingWorker(event.data.sw)
      }
    })

    // Check for updates when the component mounts
    const checkForUpdates = async () => {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration?.waiting) {
        // There's an update ready to be applied
        setShowUpdatePrompt(true)
        setWaitingWorker(registration.waiting)
      }
    }

    checkForUpdates()

    // Listen for new service workers
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // The service worker has taken control, reload the page to ensure all assets are updated
      window.location.reload()
    })

    return () => {
      channel.close()
    }
  }, [])

  const handleUpdate = () => {
    if (!waitingWorker) return

    // Send a message to the service worker to skip waiting
    waitingWorker.postMessage({ type: 'SKIP_WAITING' })
    setShowUpdatePrompt(false)
  }

  if (!showUpdatePrompt) return null

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-background border rounded-lg shadow-lg p-4 max-w-xs">
      <div className="flex flex-col space-y-3">
        <div className="font-medium">Update Available</div>
        <p className="text-sm text-muted-foreground">
          A new version of One Page Binder is available. Refresh to update.
        </p>
        <Button onClick={handleUpdate} className="w-full">
          <RefreshCw className="w-4 h-4 mr-2" />
          Update Now
        </Button>
      </div>
    </div>
  )
}