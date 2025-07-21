"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import {
  Download,
  Upload,
  Lock,
  Unlock,
  Sun,
  Moon,
  Clock,
  ClockIcon as ClockOff,
  FileText,
  Eye,
  StickyNote,
  ChevronDown,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PrivateShare } from "@/components/private-share"

// Storage keys
const STORAGE_KEY = "qi-content"
const PIN_KEY = "qi-pin"
const LOCKED_KEY = "qi-locked"
const TIMESTAMP_SETTINGS_KEY = "qi-timestamp-settings"
const QUICK_NOTES_KEY = "qi-quick-notes"

// Timestamp settings interface
interface TimestampSettings {
  enabled: boolean
  format: "datetime" | "date" | "time"
}

// Word count utility
const getWordCount = (text: string) => {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const characters = text.length
  const charactersNoSpaces = text.replace(/\s/g, "").length
  return { words, characters, charactersNoSpaces }
}

export default function QI() {
  // Core state
  const [content, setContent] = useState("")
  const [quickNotes, setQuickNotes] = useState("")
  const [isLocked, setIsLocked] = useState(false)
  const [pin, setPin] = useState("")
  const [inputPin, setInputPin] = useState("")
  const [showWelcome, setShowWelcome] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const [showQuickNotes, setShowQuickNotes] = useState(false)

  // Timestamp state
  const [timestampSettings, setTimestampSettings] = useState<TimestampSettings>({
    enabled: true,
    format: "datetime",
  })

  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const quickNotesRef = useRef<HTMLTextAreaElement>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout>()
  const lastActivityRef = useRef<number>(Date.now())
  const activityTimeoutRef = useRef<NodeJS.Timeout>()

  // Theme
  const { theme, setTheme } = useTheme()

  // Word counts
  const mainWordCount = getWordCount(content)
  const quickNotesWordCount = getWordCount(quickNotes)

  // Load data on mount
  useEffect(() => {
    const savedContent = localStorage.getItem(STORAGE_KEY)
    const savedPin = localStorage.getItem(PIN_KEY)
    const savedLocked = localStorage.getItem(LOCKED_KEY)
    const savedTimestampSettings = localStorage.getItem(TIMESTAMP_SETTINGS_KEY)
    const savedQuickNotes = localStorage.getItem(QUICK_NOTES_KEY)

    if (savedContent) {
      setContent(savedContent)
    } else {
      setShowWelcome(true)
    }

    if (savedQuickNotes) {
      setQuickNotes(savedQuickNotes)
    }

    if (savedPin) {
      setPin(savedPin)
      setIsLocked(savedLocked === "true")
    }

    if (savedTimestampSettings) {
      setTimestampSettings(JSON.parse(savedTimestampSettings))
    }
  }, [])

  // Auto-save functionality
  const saveContent = useCallback((newContent: string) => {
    setIsSaving(true)
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, newContent)
      setIsSaving(false)
    }, 500)
  }, [])

  const saveQuickNotes = useCallback((newNotes: string) => {
    localStorage.setItem(QUICK_NOTES_KEY, newNotes)
  }, [])

  // Handle content change
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    saveContent(newContent)
    lastActivityRef.current = Date.now()

    // Reset activity timeout for auto-timestamps
    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current)
    }

    if (timestampSettings.enabled) {
      activityTimeoutRef.current = setTimeout(
        () => {
          insertTimestamp()
        },
        5 * 60 * 1000,
      ) // 5 minutes
    }
  }

  // Handle quick notes change
  const handleQuickNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value
    setQuickNotes(newNotes)
    saveQuickNotes(newNotes)
  }

  // Timestamp functions
  const formatTimestamp = (format: string) => {
    const now = new Date()
    switch (format) {
      case "datetime":
        return now.toLocaleString()
      case "date":
        return now.toLocaleDateString()
      case "time":
        return now.toLocaleTimeString()
      default:
        return now.toLocaleString()
    }
  }

  const insertTimestamp = () => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const timestamp = `\n\n[${formatTimestamp(timestampSettings.format)}]\n`
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newContent = content.substring(0, start) + timestamp + content.substring(end)

    setContent(newContent)
    saveContent(newContent)

    // Set cursor position after timestamp
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + timestamp.length, start + timestamp.length)
    }, 0)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Timestamp shortcut (Ctrl+T or Cmd+T)
      if ((e.ctrlKey || e.metaKey) && e.key === "t") {
        e.preventDefault()
        insertTimestamp()
      }

      // Focus mode shortcut (Ctrl+Shift+F or Cmd+Shift+F)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "F") {
        e.preventDefault()
        setFocusMode(!focusMode)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [focusMode])

  // Handle double enter for timestamp
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && timestampSettings.enabled) {
      const now = Date.now()
      const timeSinceLastActivity = now - lastActivityRef.current

      if (timeSinceLastActivity < 1000) {
        // Double press within 1 second
        e.preventDefault()
        insertTimestamp()
      }

      lastActivityRef.current = now
    }
  }

  // PIN functions
  const setPinCode = () => {
    if (inputPin.length === 4) {
      setPin(inputPin)
      localStorage.setItem(PIN_KEY, inputPin)
      setInputPin("")
    }
  }

  const unlockApp = () => {
    if (inputPin === pin) {
      setIsLocked(false)
      localStorage.setItem(LOCKED_KEY, "false")
      setInputPin("")
    }
  }

  const lockApp = () => {
    setIsLocked(true)
    localStorage.setItem(LOCKED_KEY, "true")
  }

  // Export functions
  const exportContent = (format: "txt" | "pdf" | "html" | "md") => {
    const timestamp = new Date().toISOString().split("T")[0]
    const filename = `qi-export-${timestamp}`

    switch (format) {
      case "txt":
        const blob = new Blob([content], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${filename}.txt`
        a.click()
        URL.revokeObjectURL(url)
        break

      case "pdf":
        // Open print dialog for PDF export
        const printWindow = window.open("", "_blank")
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>QI Export</title>
                <style>
                  body { font-family: monospace; white-space: pre-wrap; margin: 40px; }
                  @media print { body { margin: 0; } }
                </style>
              </head>
              <body>${content}</body>
            </html>
          `)
          printWindow.document.close()
          printWindow.print()
        }
        break

      case "html":
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>QI Export</title>
    <style>
        body { font-family: monospace; white-space: pre-wrap; margin: 40px; background: white; color: black; }
    </style>
</head>
<body>${content.replace(/\n/g, "<br>")}</body>
</html>`
        const htmlBlob = new Blob([htmlContent], { type: "text/html" })
        const htmlUrl = URL.createObjectURL(htmlBlob)
        const htmlA = document.createElement("a")
        htmlA.href = htmlUrl
        htmlA.download = `${filename}.html`
        htmlA.click()
        URL.revokeObjectURL(htmlUrl)
        break

      case "md":
        const mdContent = `# QI Export\n\n${content}`
        const mdBlob = new Blob([mdContent], { type: "text/markdown" })
        const mdUrl = URL.createObjectURL(mdBlob)
        const mdA = document.createElement("a")
        mdA.href = mdUrl
        mdA.download = `${filename}.md`
        mdA.click()
        URL.revokeObjectURL(mdUrl)
        break
    }
  }

  // Import function
  const importFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "text/plain") {
      const reader = new FileReader()
      reader.onload = (event) => {
        const importedContent = event.target?.result as string
        setContent(importedContent)
        saveContent(importedContent)
      }
      reader.readAsText(file)
    }
    e.target.value = "" // Reset input
  }

  // Update timestamp settings
  const updateTimestampSettings = (newSettings: Partial<TimestampSettings>) => {
    const updated = { ...timestampSettings, ...newSettings }
    setTimestampSettings(updated)
    localStorage.setItem(TIMESTAMP_SETTINGS_KEY, JSON.stringify(updated))
  }

  // If locked, show unlock screen
  if (isLocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Lock className="h-12 w-12 mx-auto text-muted-foreground" />
              <h2 className="text-2xl font-bold">QI is Locked</h2>
              <p className="text-muted-foreground">Enter your PIN to unlock</p>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Enter 4-digit PIN"
                  value={inputPin}
                  onChange={(e) => setInputPin(e.target.value.slice(0, 4))}
                  maxLength={4}
                  className="text-center text-2xl tracking-widest"
                />
                <Button onClick={unlockApp} className="w-full" disabled={inputPin.length !== 4}>
                  Unlock
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Welcome screen
  if (showWelcome) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold">Welcome to QI</h1>
                <p className="text-xl text-muted-foreground">
                  A single-page digital folder for anything you don't want to lose
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Privacy First
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Everything saves locally in your browser. No cloud, no tracking, no servers.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Smart Timestamps
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Press Ctrl+T or double-enter to add timestamps. Auto-timestamps after 5 minutes.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Focus Mode
                  </h3>
                  <p className="text-sm text-muted-foreground">Press Ctrl+Shift+F for distraction-free writing.</p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Anywhere
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Export to TXT, PDF, HTML, or Markdown. Import from text files.
                  </p>
                </div>
              </div>

              <Button onClick={() => setShowWelcome(false)} size="lg">
                Start Writing
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Focus mode
  if (focusMode) {
    return (
      <div className="min-h-screen bg-background relative">
        <Button
          onClick={() => setFocusMode(false)}
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 z-10 h-8 w-8 p-0"
        >
          ×
        </Button>
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          onKeyDown={handleKeyDown}
          placeholder="Start writing..."
          className="min-h-screen w-full border-0 resize-none focus:ring-0 text-lg leading-relaxed p-8 pt-16"
          style={{ fontFamily: "ui-monospace, monospace" }}
        />
      </div>
    )
  }

  // Main interface
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">QI</h1>
            {isSaving && <span className="text-xs text-muted-foreground animate-pulse">Saving...</span>}
          </div>

          {/* Word count - desktop */}
          <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
            <span>{mainWordCount.words} words</span>
            <span>{mainWordCount.characters} chars</span>
            <span>{mainWordCount.charactersNoSpaces} chars (no spaces)</span>
          </div>

          <div className="flex items-center gap-1">
            {/* Quick Notes Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowQuickNotes(!showQuickNotes)}
              className={showQuickNotes ? "bg-accent" : ""}
            >
              <StickyNote className="h-4 w-4" />
            </Button>

            {/* Focus Mode */}
            <Button variant="ghost" size="sm" onClick={() => setFocusMode(true)} title="Focus Mode (Ctrl+Shift+F)">
              <Eye className="h-4 w-4" />
            </Button>

            {/* Timestamp Settings */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  {timestampSettings.enabled ? <Clock className="h-4 w-4" /> : <ClockOff className="h-4 w-4" />}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Timestamp Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="timestamp-enabled"
                      checked={timestampSettings.enabled}
                      onChange={(e) => updateTimestampSettings({ enabled: e.target.checked })}
                    />
                    <Label htmlFor="timestamp-enabled">Enable automatic timestamps</Label>
                  </div>
                  <div className="space-y-2">
                    <Label>Timestamp Format</Label>
                    <Select
                      value={timestampSettings.format}
                      onValueChange={(value: "datetime" | "date" | "time") =>
                        updateTimestampSettings({ format: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="datetime">Date & Time</SelectItem>
                        <SelectItem value="date">Date Only</SelectItem>
                        <SelectItem value="time">Time Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Preview: [{formatTimestamp(timestampSettings.format)}]
                  </p>
                </div>
              </DialogContent>
            </Dialog>

            {/* Export Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => exportContent("txt")}>Export as TXT</DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportContent("pdf")}>Export as PDF</DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportContent("html")}>Export as HTML</DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportContent("md")}>Export as Markdown</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Import */}
            <Button variant="ghost" size="sm" asChild>
              <label>
                <Upload className="h-4 w-4" />
                <input type="file" accept=".txt" onChange={importFile} className="hidden" />
              </label>
            </Button>

            {/* Private Share */}
            <PrivateShare content={content} quickNotes={quickNotes} />

            {/* Print */}
            <Button variant="ghost" size="sm" onClick={() => window.print()}>
              <FileText className="h-4 w-4" />
            </Button>

            {/* PIN Lock */}
            {pin ? (
              <Button variant="ghost" size="sm" onClick={lockApp}>
                <Unlock className="h-4 w-4" />
              </Button>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Lock className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Set PIN Lock</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="pin">4-Digit PIN</Label>
                      <Input
                        id="pin"
                        type="password"
                        placeholder="Enter PIN"
                        value={inputPin}
                        onChange={(e) => setInputPin(e.target.value.slice(0, 4))}
                        maxLength={4}
                        className="text-center text-2xl tracking-widest"
                      />
                    </div>
                    <Button onClick={setPinCode} className="w-full" disabled={inputPin.length !== 4}>
                      Set PIN
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {/* Theme Toggle */}
            <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <div className={`flex-1 ${showQuickNotes ? "pr-80" : ""}`}>
          <div className="container px-4 py-6">
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              onKeyDown={handleKeyDown}
              placeholder="Start writing..."
              className="min-h-[calc(100vh-8rem)] w-full border-0 resize-none focus:ring-0 text-base leading-relaxed"
              style={{ fontFamily: "ui-monospace, monospace" }}
            />
          </div>
        </div>

        {/* Quick Notes Sidebar */}
        {showQuickNotes && (
          <div className="fixed right-0 top-14 h-[calc(100vh-3.5rem)] w-80 border-l bg-background/95 backdrop-blur">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Quick Notes</h3>
                <div className="text-xs text-muted-foreground">
                  {quickNotesWordCount.words}w {quickNotesWordCount.characters}c
                </div>
              </div>
            </div>
            <div className="p-4">
              <Textarea
                ref={quickNotesRef}
                value={quickNotes}
                onChange={handleQuickNotesChange}
                placeholder="Temporary notes and ideas..."
                className="min-h-[calc(100vh-12rem)] w-full border-0 resize-none focus:ring-0 text-sm"
                style={{ fontFamily: "ui-monospace, monospace" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Word Count */}
      <div className="md:hidden fixed bottom-4 left-4 bg-background/90 backdrop-blur border rounded-lg px-3 py-1 text-xs text-muted-foreground">
        {mainWordCount.words}w {mainWordCount.characters}c
      </div>
    </div>
  )
}
