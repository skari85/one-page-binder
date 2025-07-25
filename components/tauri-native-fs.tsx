"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

// Tauri API imports (only available in Tauri environment)
declare global {
  interface Window {
    __TAURI__?: {
      fs: {
        writeTextFile: (path: string, content: string) => Promise<void>
        readTextFile: (path: string) => Promise<string>
      }
      dialog: {
        save: (options?: any) => Promise<string | null>
        open: (options?: any) => Promise<string | string[] | null>
      }
    }
  }
}

export function TauriNativeFS() {
  const [content, setContent] = useState("")
  const isTauri = typeof window !== "undefined" && window.__TAURI__

  const saveFile = async () => {
    if (!isTauri) {
      toast.error("Tauri not available")
      return
    }

    try {
      const filePath = await window.__TAURI__!.dialog.save({
        filters: [
          {
            name: "Text",
            extensions: ["txt"],
          },
        ],
      })

      if (filePath) {
        await window.__TAURI__!.fs.writeTextFile(filePath, content)
        toast.success("File saved successfully!")
      }
    } catch (error) {
      console.error("Error saving file:", error)
      toast.error("Failed to save file")
    }
  }

  const openFile = async () => {
    if (!isTauri) {
      toast.error("Tauri not available")
      return
    }

    try {
      const filePath = await window.__TAURI__!.dialog.open({
        filters: [
          {
            name: "Text",
            extensions: ["txt"],
          },
        ],
      })

      if (filePath && typeof filePath === "string") {
        const fileContent = await window.__TAURI__!.fs.readTextFile(filePath)
        setContent(fileContent)
        toast.success("File opened successfully!")
      }
    } catch (error) {
      console.error("Error opening file:", error)
      toast.error("Failed to open file")
    }
  }

  if (!isTauri) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tauri Native File System</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Tauri environment not detected. This feature is only available in the desktop app.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tauri Native File System</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={openFile}>Open File</Button>
          <Button onClick={saveFile}>Save File</Button>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-32 p-2 border rounded"
          placeholder="Type something..."
        />
      </CardContent>
    </Card>
  )
}
