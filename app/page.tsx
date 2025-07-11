"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Moon, Sun, Download, Upload, Lock, Unlock, FileText, Clock, ArrowRight, WifiOff, HardDrive } from "lucide-react"
import { useTheme } from "next-themes"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { OfflineIndicator } from "@/components/offline-indicator"
import { FileSystemDemo } from "@/components/file-system-demo"
import { TauriNativeFS } from "@/components/tauri-native-fs"
import { isTauri } from "@/lib/tauri-api"

export default function OnePageBinder() {
  const [content, setContent] = useState("")
  const [isLocked, setIsLocked] = useState(false)
  const [pin, setPin] = useState("")
  const [inputPin, setInputPin] = useState("")
  const [showPinDialog, setShowPinDialog] = useState(false)
  const [showUnlockDialog, setShowUnlockDialog] = useState(false)
  const [isSettingPin, setIsSettingPin] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [timestampsEnabled, setTimestampsEnabled] = useState(false)
  const [lastTypingTime, setLastTypingTime] = useState(0)
  const [timestampFormat, setTimestampFormat] = useState<"datetime" | "time" | "date">("datetime")
  const [isOffline, setIsOffline] = useState(false)
  const [showNativeFileSystem, setShowNativeFileSystem] = useState(false)

  // Ensure component is mounted before accessing theme
  useEffect(() => {
    setMounted(true)
    
    // Check online status
    setIsOffline(!navigator.onLine)
    
    // Listen for online/offline events
    const handleOffline = () => setIsOffline(true)
    const handleOnline = () => setIsOffline(false)
    
    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)
    
    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  // Load data from localStorage on mount
  useEffect(() => {
    const savedContent = localStorage.getItem("binder-content")
    const savedPin = localStorage.getItem("binder-pin")
    const savedLockState = localStorage.getItem("binder-locked")
    const savedTimestamps = localStorage.getItem("binder-timestamps")
    const savedTimestampFormat = localStorage.getItem("binder-timestamp-format")
    const hasVisited = localStorage.getItem("binder-visited")

    if (savedContent) setContent(savedContent)
    if (savedPin) setPin(savedPin)
    if (savedLockState === "true") {
      setIsLocked(true)
      setShowUnlockDialog(true)
    }
    if (savedTimestamps) setTimestampsEnabled(savedTimestamps === "true")
    if (savedTimestampFormat) setTimestampFormat(savedTimestampFormat as "datetime" | "time" | "date")
    if (hasVisited) setShowWelcome(false)
  }, [])

  // Auto-save content with visual indicator
  useEffect(() => {
    if (content !== "") {
      setIsSaving(true)
      const saveTimeout = setTimeout(() => {
        try {
          localStorage.setItem("binder-content", content)
          setIsSaving(false)
        } catch (error) {
          console.error("Error saving to localStorage:", error)
          // Handle storage error (e.g., quota exceeded)
          setIsSaving(false)
        }
      }, 500)
      
      return () => clearTimeout(saveTimeout)
    }
  }, [content])

  // Save timestamp preferences
  useEffect(() => {
    localStorage.setItem("binder-timestamps", timestampsEnabled.toString())
  }, [timestampsEnabled])

  useEffect(() => {
    localStorage.setItem("binder-timestamp-format", timestampFormat)
  }, [timestampFormat])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"
    }
  }, [content])

  const formatTimestamp = (format: "datetime" | "time" | "date") => {
    const now = new Date()
    switch (format) {
      case "datetime":
        return now.toLocaleString()
      case "time":
        return now.toLocaleTimeString()
      case "date":
        return now.toLocaleDateString()
      default:
        return now.toLocaleString()
    }
  }

  const insertTimestamp = () => {
    const timestamp = `[${formatTimestamp(timestampFormat)}] `
    const textarea = textareaRef.current
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newContent = content.slice(0, start) + timestamp + content.slice(end)
      setContent(newContent)

      // Set cursor position after timestamp
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + timestamp.length
        textarea.focus()
      }, 0)
    }
  }

  const shouldAutoInsertTimestamp = () => {
    const now = Date.now()
    const timeSinceLastTyping = now - lastTypingTime
    // Only insert timestamp after 5 minutes of inactivity and if timestamps are enabled
    return timestampsEnabled && timeSinceLastTyping > 300000 && lastTypingTime !== 0
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    const now = Date.now()

    // Check if we should auto-insert timestamp
    if (shouldAutoInsertTimestamp() && newContent.length > content.length) {
      const timestamp = `\n[${formatTimestamp(timestampFormat)}] `
      const textarea = textareaRef.current
      if (textarea) {
        const cursorPos = textarea.selectionStart
        const beforeCursor = newContent.slice(0, cursorPos)
        const afterCursor = newContent.slice(cursorPos)
        const contentWithTimestamp = beforeCursor + timestamp + afterCursor
        setContent(contentWithTimestamp)

        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = cursorPos + timestamp.length
        }, 0)
      }
    } else {
      setContent(newContent)
    }

    setLastTypingTime(now)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Insert timestamp on Ctrl/Cmd + T
    if ((e.ctrlKey || e.metaKey) && e.key === "t") {
      e.preventDefault()
      insertTimestamp()
    }

    // Auto-insert timestamp on double Enter
    if (e.key === "Enter" && timestampsEnabled) {
      const textarea = textareaRef.current
      if (textarea) {
        const cursorPos = textarea.selectionStart
        const beforeCursor = content.slice(0, cursorPos)
        const lastTwoChars = beforeCursor.slice(-2)

        if (lastTwoChars === "\n\n" || (beforeCursor.endsWith("\n") && beforeCursor.slice(-3, -1) === "\n\n")) {
          setTimeout(() => {
            insertTimestamp()
          }, 0)
        }
      }
    }
  }

  const handleEnterBinder = () => {
    setShowWelcome(false)
    localStorage.setItem("binder-visited", "true")
  }

  const handleSetPin = () => {
    if (inputPin.length === 4 && /^\d{4}$/.test(inputPin)) {
      setPin(inputPin)
      localStorage.setItem("binder-pin", inputPin)
      setInputPin("")
      setShowPinDialog(false)
      setIsSettingPin(false)
    }
  }
  
  const handlePinKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (isSettingPin) {
        handleSetPin()
      } else {
        handleUnlock()
      }
    }
  }

  const handleUnlock = () => {
    if (inputPin === pin) {
      setIsLocked(false)
      localStorage.setItem("binder-locked", "false")
      setInputPin("")
      setShowUnlockDialog(false)
    }
  }

  const handleLock = () => {
    if (pin) {
      setIsLocked(true)
      localStorage.setItem("binder-locked", "true")
    } else {
      setIsSettingPin(true)
      setShowPinDialog(true)
    }
  }

  const handleExport = () => {
    const timestamp = new Date().toISOString().split("T")[0]
    const filename = `one-page-binder-${timestamp}.txt`

    try {
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      a.style.display = "none"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Export failed:", error)
      // Fallback method
      const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(content)
      const downloadAnchorNode = document.createElement("a")
      downloadAnchorNode.setAttribute("href", dataStr)
      downloadAnchorNode.setAttribute("download", filename)
      document.body.appendChild(downloadAnchorNode)
      downloadAnchorNode.click()
      downloadAnchorNode.remove()
    }
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "text/plain") {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        setContent(text)
      }
      reader.readAsText(file)
    }
    event.target.value = ""
  }

  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>One Page Binder</title>
            <style>
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                max-width: 8.5in;
                margin: 0 auto;
                padding: 1in;
                white-space: pre-wrap;
              }
              h1 {
                text-align: center;
                border-bottom: 2px solid #333;
                padding-bottom: 10px;
                margin-bottom: 30px;
              }
            </style>
          </head>
          <body>
            <h1>One Page Binder</h1>
            <div>${content.replace(/\n/g, "<br>")}</div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  if (!mounted) {
    return null
  }

  // Welcome Screen
  if (showWelcome) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 text-center animate-in fade-in-50 duration-500">
          {/* Logo */}
          <div className="space-y-4">
            <div className="w-24 h-24 mx-auto bg-amber-100 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center animate-in zoom-in-75 duration-700">
              <FileText className="w-12 h-12 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">One Page Binder</h1>
              <p className="text-muted-foreground text-lg">
                A single-page digital folder for anything you don't want to lose
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Everything saves locally</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>No cloud, no tracking</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Zero distractions</span>
            </div>
          </div>

          {/* Enter Button */}
          <div className="space-y-4">
            <p className="text-foreground font-medium">Welcome to One Page Binder</p>
            <p className="text-muted-foreground">Enter below</p>
            <Button onClick={handleEnterBinder} className="w-full" size="lg" type="button">
              Enter Your Binder
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Theme Toggle */}
          <div className="pt-4">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-muted-foreground"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-4 h-4 mr-2" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 mr-2" />
                  Dark Mode
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (isLocked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4 animate-in fade-in-50 duration-500">
          <Lock className="w-16 h-16 mx-auto text-muted-foreground animate-in zoom-in-75 duration-700" />
          <h1 className="text-2xl font-bold">One Page Binder</h1>
          <p className="text-muted-foreground">Your binder is locked</p>
          <Button onClick={() => setShowUnlockDialog(true)}>
            <Unlock className="w-4 h-4 mr-2" />
            Unlock
          </Button>
          <div className="pt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-muted-foreground"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-4 h-4 mr-2" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 mr-2" />
                  Dark Mode
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* PWA Components */}
      <PWAInstallPrompt />
      <OfflineIndicator />
      
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="text-xl font-bold">One Page Binder</h1>
            {isSaving && (
              <span className="text-xs text-muted-foreground animate-pulse">Saving...</span>
            )}
            {isOffline && (
              <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 rounded-full flex items-center">
                <WifiOff className="w-3 h-3 mr-1" />
                Offline
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto sm:overflow-visible">
            {mounted && isTauri() && (
              <Button
                variant={showNativeFileSystem ? "default" : "ghost"}
                size="icon"
                type="button"
                onClick={() => setShowNativeFileSystem(!showNativeFileSystem)}
                title="Native file system"
              >
                <HardDrive className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              title="Toggle theme"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            <Button variant="ghost" size="icon" onClick={handleExport} title="Save to computer" type="button">
              <Download className="w-4 h-4" />
            </Button>

            <Button variant="ghost" size="icon" asChild title="Import from file" type="button">
              <label htmlFor="import-file" className="cursor-pointer">
                <Upload className="w-4 h-4" />
                <input id="import-file" type="file" accept=".txt" onChange={handleImport} className="hidden" />
              </label>
            </Button>

            <Button variant="ghost" size="icon" onClick={handlePrint} title="Print" type="button">
              <FileText className="w-4 h-4" />
            </Button>

            <Button
              variant={timestampsEnabled ? "default" : "ghost"}
              size="icon"
              type="button"
              onClick={() => setTimestampsEnabled(!timestampsEnabled)}
              title="Toggle automatic timestamps"
            >
              <Clock className="w-4 h-4" />
            </Button>

            {timestampsEnabled && (
              <select
                value={timestampFormat}
                onChange={(e) => setTimestampFormat(e.target.value as "datetime" | "time" | "date")}
                className="px-2 py-1 text-sm bg-background border border-border rounded"
                title="Timestamp format"
              >
                <option value="datetime">Date & Time</option>
                <option value="date">Date Only</option>
                <option value="time">Time Only</option>
              </select>
            )}

            <Button variant="ghost" size="icon" onClick={handleLock} title="Lock binder" type="button">
              <Lock className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {showNativeFileSystem && (
          <div className="mb-8">
            <Tabs defaultValue="cross-platform" className="w-full max-w-3xl mx-auto">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="cross-platform">Cross-Platform API</TabsTrigger>
                <TabsTrigger value="native" disabled={!isTauri()}>Native Tauri API</TabsTrigger>
              </TabsList>
              <TabsContent value="cross-platform" className="mt-4">
                <FileSystemDemo />
              </TabsContent>
              <TabsContent value="native" className="mt-4">
                <TauriNativeFS />
              </TabsContent>
            </Tabs>
          </div>
        )}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          onKeyDown={handleKeyDown}
          placeholder={
            timestampsEnabled
              ? "Start writing... Timestamps will be added automatically after breaks or double-enter. Press Ctrl+T to insert manually."
              : "Start writing... Everything auto-saves locally."
          }
          className="w-full min-h-[calc(100vh-200px)] p-6 text-base leading-relaxed resize-none border-none outline-none bg-transparent placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 rounded-md transition-all"
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
          }}
          aria-label="Binder content"
        />
      </main>

      {/* Set PIN Dialog */}
      <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set 4-Digit PIN</DialogTitle>
            <DialogDescription>
              {isSettingPin ? "Create a PIN to lock your binder" : "Enter your 4-digit PIN"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Enter 4-digit PIN"
              value={inputPin}
              onChange={(e) => setInputPin(e.target.value.slice(0, 4))}
              onKeyDown={handlePinKeyDown}
              maxLength={4}
              className="text-center text-2xl tracking-widest"
              autoFocus
              inputMode="numeric"
              pattern="[0-9]*"
            />
            <Button onClick={handleSetPin} className="w-full" disabled={inputPin.length !== 4}>
              Set PIN
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Unlock Dialog */}
      <Dialog open={showUnlockDialog} onOpenChange={setShowUnlockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter PIN</DialogTitle>
            <DialogDescription>Enter your 4-digit PIN to unlock your binder</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Enter PIN"
              value={inputPin}
              onChange={(e) => setInputPin(e.target.value.slice(0, 4))}
              onKeyDown={handlePinKeyDown}
              maxLength={4}
              className="text-center text-2xl tracking-widest"
              autoFocus
              inputMode="numeric"
              pattern="[0-9]*"
            />
            <Button onClick={handleUnlock} className="w-full" disabled={inputPin.length !== 4}>
              Unlock
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
