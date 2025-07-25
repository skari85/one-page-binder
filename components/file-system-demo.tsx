"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export function FileSystemDemo() {
  const [content, setContent] = useState("")

  const saveFile = async () => {
    try {
      // @ts-ignore - File System Access API
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: "document.txt",
        types: [
          {
            description: "Text files",
            accept: {
              "text/plain": [".txt"],
            },
          },
        ],
      })

      const writable = await fileHandle.createWritable()
      await writable.write(content)
      await writable.close()

      toast.success("File saved successfully!")
    } catch (error) {
      console.error("Error saving file:", error)
      toast.error("Failed to save file")
    }
  }

  const openFile = async () => {
    try {
      // @ts-ignore - File System Access API
      const [fileHandle] = await window.showOpenFilePicker({
        types: [
          {
            description: "Text files",
            accept: {
              "text/plain": [".txt"],
            },
          },
        ],
      })

      const file = await fileHandle.getFile()
      const text = await file.text()
      setContent(text)

      toast.success("File opened successfully!")
    } catch (error) {
      console.error("Error opening file:", error)
      toast.error("Failed to open file")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>File System Access Demo</CardTitle>
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
