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
  Download,
  Upload,
  Lock,
  Unlock,
  FileText,
  Clock,
  WifiOff,
  HardDrive,
  Search,
  Undo,
  Redo,
  BookOpen,
  Eye,
  Type,
  Bookmark,
  FileIcon as FileTemplate,
  History,
} from "lucide-react"
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

  // New feature states
  const [wordCount, setWordCount] = useState({ words: 0, characters: 0 })
  const [showSearch, setShowSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<number[]>([])
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1)
  const [backupVersions, setBackupVersions] = useState<Array<{ content: string; timestamp: string }>>([])
  const [showVersions, setShowVersions] = useState(false)
  const [isReadingMode, setIsReadingMode] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [bookmarks, setBookmarks] = useState<Array<{ line: number; text: string }>>([])
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [undoStack, setUndoStack] = useState<string[]>([])
  const [redoStack, setRedoStack] = useState<string[]>([])
  const [focusedParagraph, setFocusedParagraph] = useState(-1)

  const templates = [
    {
      name: "Daily Notes",
      content: `# Daily Notes - ${new Date().toLocaleDateString()}\n\n## Today's Goals\n- \n\n## Notes\n\n\n## Tomorrow's Prep\n- `,
    },
    {
      name: "Meeting Notes",
      content: `# Meeting Notes - ${new Date().toLocaleDateString()}\n\n**Attendees:** \n**Topic:** \n\n## Agenda\n- \n\n## Discussion\n\n\n## Action Items\n- [ ] \n\n## Next Steps\n`,
    },
    {
      name: "Ideas & Brainstorm",
      content: `# Ideas & Brainstorm - ${new Date().toLocaleDateString()}\n\n## Main Topic\n\n\n## Ideas\n- \n- \n- \n\n## Next Actions\n- `,
    },
    {
      name: "Journal Entry",
      content: `# Journal - ${new Date().toLocaleDateString()}\n\n## How I'm Feeling\n\n\n## What Happened Today\n\n\n## Thoughts & Reflections\n\n\n## Gratitude\n- `,
    },
    {
      name: "Project Notes",
      content: `# Project: [Name]\n\n## Overview\n\n\n## Current Status\n\n\n## Tasks\n- [ ] \n- [ ] \n- [ ] \n\n## Notes\n\n\n## Resources\n- `,
    },
  ]

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

    if (savedContent) setContent(savedContent)
    if (savedPin) setPin(savedPin)
    if (savedLockState === "true") {
      setIsLocked(true)
      setShowUnlockDialog(true)
    }
    if (savedTimestamps) setTimestampsEnabled(savedTimestamps === "true")
    if (savedTimestampFormat) setTimestampFormat(savedTimestampFormat as "datetime" | "time" | "date")
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

  // Word count effect
  useEffect(() => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0
    const characters = content.length
    setWordCount({ words, characters })
  }, [content])

  // Auto-backup effect
  useEffect(() => {
    if (content && content.length > 10) {
      const backupTimer = setTimeout(() => {
        const newBackup = {
          content,
          timestamp: new Date().toLocaleString(),
        }
        setBackupVersions((prev) => {
          const updated = [newBackup, ...prev.slice(0, 4)] // Keep last 5
          localStorage.setItem("binder-backups", JSON.stringify(updated))
          return updated
        })
      }, 10000) // Backup every 10 seconds of inactivity

      return () => clearTimeout(backupTimer)
    }
  }, [content])

  // Load backups on mount
  useEffect(() => {
    const savedBackups = localStorage.getItem("binder-backups")
    if (savedBackups) {
      setBackupVersions(JSON.parse(savedBackups))
    }

    const savedFontSize = localStorage.getItem("binder-font-size")
    if (savedFontSize) {
      setFontSize(Number.parseInt(savedFontSize))
    }
  }, [])

  // Save font size
  useEffect(() => {
    localStorage.setItem("binder-font-size", fontSize.toString())
  }, [fontSize])

  // Search functionality
  useEffect(() => {
    if (searchTerm && content) {
      const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi")
      const matches = []
      let match
      while ((match = regex.exec(content)) !== null) {
        matches.push(match.index)
      }
      setSearchResults(matches)
      setCurrentSearchIndex(matches.length > 0 ? 0 : -1)
    } else {
      setSearchResults([])
      setCurrentSearchIndex(-1)
    }
  }, [searchTerm, content])

  // Focus mode paragraph detection
  useEffect(() => {
    if (isFocusMode && textareaRef.current) {
      const handleSelectionChange = () => {
        const textarea = textareaRef.current
        if (textarea) {
          const cursorPos = textarea.selectionStart
          const textBeforeCursor = content.substring(0, cursorPos)
          const paragraphIndex = textBeforeCursor.split("\n\n").length - 1
          setFocusedParagraph(paragraphIndex)
        }
      }

      const textarea = textareaRef.current
      textarea.addEventListener("selectionchange", handleSelectionChange)
      textarea.addEventListener("click", handleSelectionChange)
      textarea.addEventListener("keyup", handleSelectionChange)

      return () => {
        textarea.removeEventListener("selectionchange", handleSelectionChange)
        textarea.removeEventListener("click", handleSelectionChange)
        textarea.removeEventListener("keyup", handleSelectionChange)
      }
    }
  }, [isFocusMode, content])

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

  // Undo/Redo functionality
  const addToUndoStack = (content: string) => {
    setUndoStack((prev) => [...prev.slice(-19), content]) // Keep last 20
    setRedoStack([]) // Clear redo when new action
  }

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousContent = undoStack[undoStack.length - 1]
      setRedoStack((prev) => [content, ...prev])
      setContent(previousContent)
      setUndoStack((prev) => prev.slice(0, -1))
    }
  }

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextContent = redoStack[0]
      setUndoStack((prev) => [...prev, content])
      setContent(nextContent)
      setRedoStack((prev) => prev.slice(1))
    }
  }

  // Enhanced content change handler
  const handleContentChangeEnhanced = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value

    // Add to undo stack before major changes
    if (Math.abs(newContent.length - content.length) > 10) {
      addToUndoStack(content)
    }

    handleContentChange(e)
  }

  // Smart paste handler
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData("text/plain")
    const cleanedText = pastedText
      .replace(/\r\n/g, "\n") // Normalize line endings
      .replace(/\r/g, "\n")
      .replace(/\u00A0/g, " ") // Replace non-breaking spaces
      .replace(/[\u2018\u2019]/g, "'") // Replace smart quotes
      .replace(/[\u201C\u201D]/g, '"')

    const textarea = textareaRef.current
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newContent = content.slice(0, start) + cleanedText + content.slice(end)
      setContent(newContent)

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + cleanedText.length
      }, 0)
    }
  }

  // Search handlers
  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const jumpToSearchResult = (index: number) => {
    if (searchResults[index] !== undefined && textareaRef.current) {
      const textarea = textareaRef.current
      textarea.focus()
      textarea.setSelectionRange(searchResults[index], searchResults[index] + searchTerm.length)
      setCurrentSearchIndex(index)
    }
  }

  // Template handler
  const applyTemplate = (template: (typeof templates)[0]) => {
    if (content.trim() === "" || confirm("This will replace your current content. Continue?")) {
      addToUndoStack(content)
      setContent(template.content)
      setShowTemplates(false)
    }
  }

  // Bookmark handlers
  const addBookmark = () => {
    if (textareaRef.current) {
      const cursorPos = textareaRef.current.selectionStart
      const textBeforeCursor = content.substring(0, cursorPos)
      const lineNumber = textBeforeCursor.split("\n").length
      const currentLine = content.split("\n")[lineNumber - 1] || ""
      const bookmarkText = currentLine.trim().substring(0, 50) || `Line ${lineNumber}`

      setBookmarks((prev) => [...prev, { line: lineNumber, text: bookmarkText }])
    }
  }

  const jumpToBookmark = (lineNumber: number) => {
    if (textareaRef.current) {
      const lines = content.split("\n")
      const targetPos = lines.slice(0, lineNumber - 1).join("\n").length + (lineNumber > 1 ? 1 : 0)
      textareaRef.current.focus()
      textareaRef.current.setSelectionRange(targetPos, targetPos)
      setShowBookmarks(false)
    }
  }

  // Version restore handler
  const restoreVersion = (version: (typeof backupVersions)[0]) => {
    if (confirm("This will replace your current content with this backup. Continue?")) {
      addToUndoStack(content)
      setContent(version.content)
      setShowVersions(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Existing timestamp functionality
    if ((e.ctrlKey || e.metaKey) && e.key === "t") {
      e.preventDefault()
      insertTimestamp()
    }

    // New shortcuts
    if ((e.ctrlKey || e.metaKey) && e.key === "f") {
      e.preventDefault()
      setShowSearch(true)
    }

    if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
      e.preventDefault()
      handleUndo()
    }

    if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
      e.preventDefault()
      handleRedo()
    }

    // Existing auto-timestamp functionality
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
      <div className="min-h-screen bg-white text-gray-900">
        {/* Header */}
        <header className="border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-amber-600" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">One Page Binder</h1>
              </div>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-gray-500 hover:text-gray-700"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-6 py-16">
          <div className="max-w-2xl">
            {/* Hero Section */}
            <div className="mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                A single-page digital folder for anything you don't want to lose
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                One Page Binder is a distraction-free writing space that saves everything locally. No cloud, no
                tracking, no complexity—just you and your thoughts.
              </p>
              <Button
                onClick={handleEnterBinder}
                size="lg"
                className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 text-base font-medium"
              >
                Enter Your Binder
              </Button>
            </div>

            {/* About Section */}
            <div className="space-y-12">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">What is One Page Binder?</h3>
                <div className="prose prose-lg text-gray-600 space-y-4">
                  <p>
                    One Page Binder is designed for people who need a reliable place to capture thoughts, ideas, and
                    notes without the overhead of complex note-taking apps. It's intentionally simple—one page,
                    auto-saved, always available.
                  </p>
                  <p>
                    Whether you're jotting down meeting notes, brainstorming ideas, or keeping a daily journal, One Page
                    Binder provides a clean, distraction-free environment that gets out of your way.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Key Features</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Local Storage</h4>
                        <p className="text-gray-600 text-sm">
                          Everything saves automatically to your device. No accounts, no cloud sync.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Privacy First</h4>
                        <p className="text-gray-600 text-sm">
                          No tracking, no analytics, no data collection. Your words stay yours.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Zero Distractions</h4>
                        <p className="text-gray-600 text-sm">
                          Clean interface with optional features that don't get in your way.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Smart Features</h4>
                        <p className="text-gray-600 text-sm">
                          Auto-timestamps, search, templates, and bookmarks when you need them.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Always Available</h4>
                        <p className="text-gray-600 text-sm">Works offline, installs as an app, accessible anywhere.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Export Ready</h4>
                        <p className="text-gray-600 text-sm">
                          Download your content as text files or print when needed.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Perfect For</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">Daily Notes</h4>
                    <p className="text-sm text-gray-600">Capture thoughts, ideas, and reminders throughout your day.</p>
                  </div>
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">Meeting Notes</h4>
                    <p className="text-sm text-gray-600">Quick capture during meetings with automatic timestamps.</p>
                  </div>
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <BookOpen className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">Journaling</h4>
                    <p className="text-sm text-gray-600">Private space for reflection and personal writing.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-100 mt-24">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-amber-50 border border-amber-200 rounded flex items-center justify-center">
                  <FileText className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-sm text-gray-500">One Page Binder</span>
              </div>
              <Button
                onClick={handleEnterBinder}
                variant="outline"
                size="sm"
                className="border-gray-200 text-gray-600 hover:text-gray-900 bg-transparent"
              >
                Enter App
              </Button>
            </div>
          </div>
        </footer>
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

      {!isReadingMode && (
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
              {/* Word Count */}
              <div
                className="text-xs text-muted-foreground px-2 py-1 bg-muted/50 rounded hidden sm:block"
                title="Word and character count"
              >
                {wordCount.words}w {wordCount.characters}c
              </div>

              {/* Undo/Redo */}
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={handleUndo}
                disabled={undoStack.length === 0}
                title="Undo last change (Ctrl+Z)"
              >
                <Undo className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={handleRedo}
                disabled={redoStack.length === 0}
                title="Redo last undone change (Ctrl+Y)"
              >
                <Redo className="w-4 h-4" />
              </Button>

              {/* Search */}
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={() => setShowSearch(true)}
                title="Search text (Ctrl+F)"
              >
                <Search className="w-4 h-4" />
              </Button>

              {/* Templates */}
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={() => setShowTemplates(true)}
                title="Insert writing templates"
              >
                <FileTemplate className="w-4 h-4" />
              </Button>

              {/* Bookmarks */}
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={() => setShowBookmarks(!showBookmarks)}
                title="Add and jump to bookmarks"
              >
                <Bookmark className="w-4 h-4" />
              </Button>

              {/* Font Size Controls */}
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => setFontSize((prev) => Math.max(12, prev - 2))}
                  title="Make text smaller"
                  className="w-8 h-8"
                >
                  <Type className="w-3 h-3" />
                </Button>
                <span
                  className="text-xs text-muted-foreground w-8 text-center"
                  title={`Current font size: ${fontSize}px`}
                >
                  {fontSize}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => setFontSize((prev) => Math.min(24, prev + 2))}
                  title="Make text larger"
                  className="w-8 h-8"
                >
                  <Type className="w-4 h-4" />
                </Button>
              </div>

              {/* Reading Mode */}
              <Button
                variant={isReadingMode ? "default" : "ghost"}
                size="icon"
                type="button"
                onClick={() => setIsReadingMode(!isReadingMode)}
                title="Hide all controls for distraction-free reading"
              >
                <BookOpen className="w-4 h-4" />
              </Button>

              {/* Focus Mode */}
              <Button
                variant={isFocusMode ? "default" : "ghost"}
                size="icon"
                type="button"
                onClick={() => setIsFocusMode(!isFocusMode)}
                title="Highlight current paragraph only"
              >
                <Eye className="w-4 h-4" />
              </Button>

              {/* Versions */}
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={() => setShowVersions(true)}
                title="View and restore previous versions"
              >
                <History className="w-4 h-4" />
              </Button>

              {/* Existing buttons */}
              {mounted && isTauri() && (
                <Button
                  variant={showNativeFileSystem ? "default" : "ghost"}
                  size="icon"
                  type="button"
                  onClick={() => setShowNativeFileSystem(!showNativeFileSystem)}
                  title="Access computer file system"
                >
                  <HardDrive className="w-4 h-4" />
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>

              <Button variant="ghost" size="icon" onClick={handleExport} title="Download as text file" type="button">
                <Download className="w-4 h-4" />
              </Button>

              <Button variant="ghost" size="icon" asChild title="Load text file from computer" type="button">
                <label htmlFor="import-file" className="cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <input id="import-file" type="file" accept=".txt" onChange={handleImport} className="hidden" />
                </label>
              </Button>

              <Button variant="ghost" size="icon" onClick={handlePrint} title="Print or save as PDF" type="button">
                <FileText className="w-4 h-4" />
              </Button>

              <Button
                variant={timestampsEnabled ? "default" : "ghost"}
                size="icon"
                type="button"
                onClick={() => setTimestampsEnabled(!timestampsEnabled)}
                title="Auto-add timestamps while writing"
              >
                <Clock className="w-4 h-4" />
              </Button>

              <Button variant="ghost" size="icon" onClick={handleLock} title="Lock with PIN code" type="button">
                <Lock className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>
      )}

      <main className="container mx-auto px-4 py-6">
        {!isReadingMode && showNativeFileSystem && (
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

        {/* Reading mode toggle button when in reading mode */}
        {isReadingMode && (
          <Button
            className="fixed top-4 right-4 z-50"
            onClick={() => setIsReadingMode(false)}
            title="Exit reading mode"
          >
            <Eye className="w-4 h-4 mr-2" />
            Exit Reading
          </Button>
        )}

        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChangeEnhanced}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={
            timestampsEnabled
              ? "Start writing... Timestamps will be added automatically after breaks or double-enter. Press Ctrl+T to insert manually."
              : "Start writing... Everything auto-saves locally."
          }
          className={`w-full min-h-[calc(100vh-200px)] p-6 text-base leading-relaxed resize-none border-none outline-none bg-transparent placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 rounded-md transition-all ${
            isFocusMode ? "focus-mode" : ""
          }`}
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
            fontSize: `${fontSize}px`,
          }}
          aria-label="Binder content"
        />
      </main>

      {/* Search Dialog */}
      <Dialog open={showSearch} onOpenChange={setShowSearch}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Find in Page</DialogTitle>
            <DialogDescription>Search within your binder content</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              autoFocus
            />
            {searchResults.length > 0 && (
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{searchResults.length} results found</span>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => jumpToSearchResult(Math.max(0, currentSearchIndex - 1))}
                    disabled={currentSearchIndex <= 0}
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => jumpToSearchResult(Math.min(searchResults.length - 1, currentSearchIndex + 1))}
                    disabled={currentSearchIndex >= searchResults.length - 1}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Templates Dialog */}
      <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick Templates</DialogTitle>
            <DialogDescription>Choose a template to get started</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {templates.map((template, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => applyTemplate(template)}
              >
                {template.name}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Bookmarks Dialog */}
      <Dialog open={showBookmarks} onOpenChange={setShowBookmarks}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bookmarks</DialogTitle>
            <DialogDescription>Quick jump to marked locations</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Button onClick={addBookmark} className="w-full">
              Add Bookmark at Current Position
            </Button>
            {bookmarks.length > 0 && (
              <div className="space-y-2">
                {bookmarks.map((bookmark, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left bg-transparent"
                    onClick={() => jumpToBookmark(bookmark.line)}
                  >
                    <div>
                      <div className="font-medium">Line {bookmark.line}</div>
                      <div className="text-sm text-muted-foreground truncate">{bookmark.text}</div>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Version History Dialog */}
      <Dialog open={showVersions} onOpenChange={setShowVersions}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Version History</DialogTitle>
            <DialogDescription>Restore from automatic backups</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {backupVersions.map((version, index) => (
              <div key={index} className="border rounded p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{version.timestamp}</span>
                  <Button size="sm" onClick={() => restoreVersion(version)}>
                    Restore
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">{version.content.substring(0, 100)}...</div>
              </div>
            ))}
            {backupVersions.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No backups available yet. Keep writing to create automatic backups.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {isFocusMode && (
        <style jsx>{`
          .focus-mode {
            background: linear-gradient(
              to bottom,
              rgba(0,0,0,0.7) 0%,
              rgba(0,0,0,0.7) 40%,
              transparent 45%,
              transparent 55%,
              rgba(0,0,0,0.7) 60%,
              rgba(0,0,0,0.7) 100%
            );
          }
        `}</style>
      )}
    </div>
  )
}
