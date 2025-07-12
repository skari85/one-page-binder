"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Moon,
  Sun,
  Lock,
  Unlock,
  FileText,
  Clock,
  ArrowRight,
  WifiOff,
  HardDrive,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Zap,
  Shield,
  Smartphone,
  FileDown,
  FileUp,
  Printer,
  FileCheck,
} from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { PWAUpdatePrompt } from "@/components/pwa-update-prompt"
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
  const [showLanding, setShowLanding] = useState(true)
  const [copied, setCopied] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
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

    window.addEventListener("offline", handleOffline)
    window.addEventListener("online", handleOnline)

    return () => {
      window.removeEventListener("offline", handleOffline)
      window.removeEventListener("online", handleOnline)
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
    if (hasVisited) {
      setShowWelcome(false)
      setShowLanding(false)
    }
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

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + timestamp.length
        textarea.focus()
      }, 0)
    }
  }

  const shouldAutoInsertTimestamp = () => {
    const now = Date.now()
    const timeSinceLastTyping = now - lastTypingTime
    return timestampsEnabled && timeSinceLastTyping > 300000 && lastTypingTime !== 0
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    const now = Date.now()

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
    if ((e.ctrlKey || e.metaKey) && e.key === "t") {
      e.preventDefault()
      insertTimestamp()
    }

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
    setShowLanding(false)
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

  const handleExport = async (format: "txt" | "docx" = "txt") => {
    const timestamp = new Date().toISOString().split("T")[0]

    if (format === "txt") {
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
        const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(content)
        const downloadAnchorNode = document.createElement("a")
        downloadAnchorNode.setAttribute("href", dataStr)
        downloadAnchorNode.setAttribute("download", filename)
        document.body.appendChild(downloadAnchorNode)
        downloadAnchorNode.click()
        downloadAnchorNode.remove()
      }
    } else if (format === "docx") {
      try {
        // Dynamic import to avoid SSR issues
        const { exportToDocx } = await import("@/lib/docx-export")
        const filename = `one-page-binder-${timestamp}.docx`
        await exportToDocx(content, filename)
      } catch (error) {
        console.error("DOCX export failed:", error)
        // Fallback to HTML export
        const filename = `one-page-binder-${timestamp}.html`
        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
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
        `

        const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        a.style.display = "none"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
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

  const handleShare = async () => {
    // Check if Web Share API is available and allowed
    if (navigator.share && window.isSecureContext) {
      try {
        await navigator.share({
          title: "One Page Binder",
          text: "Check out this amazing writing tool!",
          url: window.location.href,
        })
      } catch (error) {
        // User cancelled or sharing failed, fall back to share dialog
        console.log("Share cancelled or failed:", error)
        setShowShareDialog(true)
      }
    } else {
      // Web Share API not available, use fallback dialog
      setShowShareDialog(true)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  if (!mounted) {
    return null
  }

  // Landing Page
  if (showLanding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        {/* Navigation */}
        <nav className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">One Page Binder</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-muted-foreground"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Animated Badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 px-4 py-2 rounded-full text-sm font-medium text-amber-800 dark:text-amber-200 animate-in fade-in-50 duration-500">
              <Sparkles className="w-4 h-4" />
              <span>Your digital writing companion</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent animate-in fade-in-50 duration-700">
              Write. Save.
              <br />
              <span className="text-transparent bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text">
                Never Lose.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in-50 duration-1000">
              A minimalist writing tool that saves everything locally. No cloud, no tracking, just pure writing.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-in fade-in-50 duration-1200">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-3 text-lg"
                onClick={handleEnterBinder}
              >
                Start Writing
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg bg-transparent">
                <ExternalLink className="w-4 h-4 mr-2" />
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center space-y-4 p-6 rounded-2xl bg-gradient-to-br from-background to-muted/20 border border-border/50 hover:border-border transition-all duration-300 animate-in fade-in-50 duration-700">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold">Privacy First</h3>
              <p className="text-muted-foreground">
                Everything saves locally on your device. No cloud, no tracking, complete privacy.
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-2xl bg-gradient-to-br from-background to-muted/20 border border-border/50 hover:border-border transition-all duration-300 animate-in fade-in-50 duration-1000">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl flex items-center justify-center">
                <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Instant auto-save, zero distractions, and seamless offline experience.
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-2xl bg-gradient-to-br from-background to-muted/20 border border-border/50 hover:border-border transition-all duration-300 animate-in fade-in-50 duration-1300">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl flex items-center justify-center">
                <Smartphone className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold">Works Everywhere</h3>
              <p className="text-muted-foreground">Desktop, tablet, or phone - your writing follows you everywhere.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-12 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">One Page Binder</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <Link href="/about" className="hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  // Welcome Screen
  if (showWelcome) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 text-center animate-in fade-in-50 duration-500">
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

          <div className="space-y-4">
            <p className="text-foreground font-medium">Welcome to One Page Binder</p>
            <p className="text-muted-foreground">Enter below</p>
            <Button onClick={handleEnterBinder} className="w-full" size="lg" type="button">
              Enter Your Binder
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

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
      <PWAInstallPrompt />
      <PWAUpdatePrompt />
      <OfflineIndicator />

      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="text-xl font-bold">One Page Binder</h1>
            {isSaving && <span className="text-xs text-muted-foreground animate-pulse">Saving...</span>}
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

            <Button variant="ghost" size="icon" onClick={handleShare} title="Share app" type="button">
              <Share2 className="w-4 h-4" />
            </Button>

            <Button variant="ghost" size="icon" onClick={() => handleExport("txt")} title="Save as TXT" type="button">
              <FileDown className="w-4 h-4" />
            </Button>

            <Button variant="ghost" size="icon" onClick={() => handleExport("docx")} title="Save as DOCX" type="button">
              <FileCheck className="w-4 h-4" />
            </Button>

            <Button variant="ghost" size="icon" asChild title="Import from file" type="button">
              <label htmlFor="import-file" className="cursor-pointer">
                <FileUp className="w-4 h-4" />
                <input id="import-file" type="file" accept=".txt" onChange={handleImport} className="hidden" />
              </label>
            </Button>

            <Button variant="ghost" size="icon" onClick={handlePrint} title="Print" type="button">
              <Printer className="w-4 h-4" />
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
                <TabsTrigger value="native" disabled={!isTauri()}>
                  Native Tauri API
                </TabsTrigger>
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

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share One Page Binder</DialogTitle>
            <DialogDescription>Share this amazing writing tool with others</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
              <input
                type="text"
                value={window.location.href}
                readOnly
                className="flex-1 bg-transparent border-none outline-none text-sm"
              />
              <Button variant="outline" size="sm" onClick={copyToClipboard} className="shrink-0 bg-transparent">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() =>
                  window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent("Check out One Page Binder - an amazing writing tool!")}&url=${encodeURIComponent(window.location.href)}`,
                    "_blank",
                  )
                }
                className="flex-1"
              >
                Share on Twitter
              </Button>
              <Button
                onClick={() =>
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                    "_blank",
                  )
                }
                className="flex-1"
              >
                Share on Facebook
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
