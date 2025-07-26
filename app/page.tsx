"use client"
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
  Share2,
  TagIcon,
  Plus,
  X,
  Filter,
  Hash,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { PrivateShare } from "@/components/private-share"
import { TagManager } from "@/components/tag-manager"

// Storage keys
const STORAGE_KEY = "qi-content"
const PIN_KEY = "qi-pin"
const LOCKED_KEY = "qi-locked"
const TIMESTAMP_SETTINGS_KEY = "qi-timestamp-settings"
const QUICK_NOTES_KEY = "qi-quick-notes"
const TAGS_KEY = "qi-tags"
const CONTENT_TAGS_KEY = "qi-content-tags"

// Interfaces
interface TimestampSettings {
  enabled: boolean
  format: "datetime" | "date" | "time"
}

interface ContentSection {
  id: string
  content: string
  tags: string[]
  timestamp: number
}

// Predefined tag colors
const TAG_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#6b7280", // gray
]

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

  // Tag state
  const [tags, setTags] = useState([])
  const [contentSections, setContentSections] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [showTagManager, setShowTagManager] = useState(false)
  const [newTagName, setNewTagName] = useState("")
  const [showTagInput, setShowTagInput] = useState(false)

  // Timestamp state
  const [timestampSettings, setTimestampSettings] = useState({
    enabled: true,
    format: "datetime",
  })

  // Refs
  const textareaRef = useRef(null)
  const quickNotesRef = useRef(null)
  const saveTimeoutRef = useRef(null)
  const lastActivityRef = useRef(Date.now())
  const activityTimeoutRef = useRef(null)

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
    const savedTags = localStorage.getItem(TAGS_KEY)
    const savedContentTags = localStorage.getItem(CONTENT_TAGS_KEY)

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

    if (savedTags) {
      setTags(JSON.parse(savedTags))
    }

    if (savedContentTags) {
      setContentSections(JSON.parse(savedContentTags))
    }
  }, [])

  // Auto-save functionality
  const saveContent = useCallback((newContent) => {
    setIsSaving(true)
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, newContent)
      setIsSaving(false)
    }, 500)
  }, [])

  const saveQuickNotes = useCallback((newNotes) => {
    localStorage.setItem(QUICK_NOTES_KEY, newNotes)
  }, [])

  const saveTags = useCallback((newTags) => {
    localStorage.setItem(TAGS_KEY, JSON.stringify(newTags))
  }, [])

  const saveContentSections = useCallback((sections) => {
    localStorage.setItem(CONTENT_TAGS_KEY, JSON.stringify(sections))
  }, [])

  // Handle content change
  const handleContentChange = (e) => {
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
  const handleQuickNotesChange = (e) => {
    const newNotes = e.target.value
    setQuickNotes(newNotes)
    saveQuickNotes(newNotes)
  }

  // Tag management functions
  const createTag = (name, color) => {
    const newTag = {
      id: Date.now().toString(),
      name: name.trim(),
      color: color || TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)],
    }
    const updatedTags = [...tags, newTag]
    setTags(updatedTags)
    saveTags(updatedTags)
    return newTag
  }

  const deleteTag = (tagId) => {
    const updatedTags = tags.filter((tag) => tag.id !== tagId)
    setTags(updatedTags)
    saveTags(updatedTags)

    // Remove tag from all content sections
    const updatedSections = contentSections.map((section) => ({
      ...section,
      tags: section.tags.filter((id) => id !== tagId),
    }))
    setContentSections(updatedSections)
    saveContentSections(updatedSections)

    // Remove from selected tags
    setSelectedTags((prev) => prev.filter((id) => id !== tagId))
  }

  const addTagToSelection = () => {
    if (!textareaRef.current || !newTagName.trim()) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)

    if (selectedText.trim()) {
      // Find or create tag
      let tag = tags.find((t) => t.name.toLowerCase() === newTagName.toLowerCase())
      if (!tag) {
        tag = createTag(newTagName)
      }

      // Create or update content section
      const sectionId = `${start}-${end}-${Date.now()}`
      const newSection = {
        id: sectionId,
        content: selectedText,
        tags: [tag.id],
        timestamp: Date.now(),
      }

      const updatedSections = [...contentSections, newSection]
      setContentSections(updatedSections)
      saveContentSections(updatedSections)

      setNewTagName("")
      setShowTagInput(false)
    }
  }

  const toggleTagFilter = (tagId) => {
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }

  const clearTagFilters = () => {
    setSelectedTags([])
  }

  // Get filtered content based on selected tags
  const getFilteredContent = () => {
    if (selectedTags.length === 0) return content

    const relevantSections = contentSections.filter((section) =>
      section.tags.some((tagId) => selectedTags.includes(tagId)),
    )

    if (relevantSections.length === 0) return ""

    return relevantSections.map((section) => section.content).join("\n\n---\n\n")
  }

  // Timestamp functions
  const formatTimestamp = (format) => {
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
    const handleKeyDown = (e) => {
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

      // Tag shortcut (Ctrl+Shift+T or Cmd+Shift+T)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "T") {
        e.preventDefault()
        setShowTagInput(true)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [focusMode])

  // Handle double enter for timestamp
  const handleKeyDownForTextarea = (e) => {
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
  const exportContent = (format) => {
    const timestamp = new Date().toISOString().split("T")[0]
    const filename = `qi-export-${timestamp}`
    const exportContent = selectedTags.length > 0 ? getFilteredContent() : content

    switch (format) {
      case "txt":
        const blob = new Blob([exportContent], { type: "text/plain" })
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
              <body>${exportContent}</body>
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
<body>${exportContent.replace(/\n/g, "<br>")}</body>
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
        const mdContent = `# QI Export\n\n${exportContent}`
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
  const importFile = (e) => {
    const file = e.target.files?.[0]
    if (file && file.type === "text/plain") {
      const reader = new FileReader()
      reader.onload = (event) => {
        const importedContent = event.target?.result
        setContent(importedContent)
        saveContent(importedContent)
      }
      reader.readAsText(file)
    }
    e.target.value = "" // Reset input
  }

  // Update timestamp settings
  const updateTimestampSettings = (newSettings) => {
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
                    <TagIcon className="h-4 w-4" />
                    Smart Tagging
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Select text and press Ctrl+Shift+T to tag content. Filter and organize easily.
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
          value={selectedTags.length > 0 ? getFilteredContent() : content}
          onChange={handleContentChange}
          onKeyDown={handleKeyDownForTextarea}
          placeholder="Start writing..."
          className="min-h-screen w-full border-0 resize-none focus:ring-0 text-lg leading-relaxed p-8 pt-16"
          style={{ fontFamily: "ui-monospace, monospace" }}
          readOnly={selectedTags.length > 0}
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
            {/* Tag Manager */}
            <Dialog open={showTagManager} onOpenChange={setShowTagManager}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <TagIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Tag Manager</DialogTitle>
                </DialogHeader>
                <TagManager
                  tags={tags}
                  onCreateTag={createTag}
                  onDeleteTag={deleteTag}
                  contentSections={contentSections}
                />
              </DialogContent>
            </Dialog>

            {/* Quick Tag Input */}
            <Popover open={showTagInput} onOpenChange={setShowTagInput}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" title="Tag Selection (Ctrl+Shift+T)">
                  <Hash className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="tag-name">Tag selected text</Label>
                    <div className="flex gap-2">
                      <Input
                        id="tag-name"
                        placeholder="Enter tag name"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addTagToSelection()}
                      />
                      <Button onClick={addTagToSelection} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Select text in the editor first, then add a tag to organize that content.
                  </p>
                </div>
              </PopoverContent>
            </Popover>

            {/* Tag Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className={selectedTags.length > 0 ? "bg-accent" : ""}>
                  <Filter className="h-4 w-4" />
                  {selectedTags.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                      {selectedTags.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Filter by tags</Label>
                    {selectedTags.length > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearTagFilters}>
                        Clear
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                        className="cursor-pointer"
                        style={{
                          backgroundColor: selectedTags.includes(tag.id) ? tag.color : "transparent",
                          borderColor: tag.color,
                          color: selectedTags.includes(tag.id) ? "white" : tag.color,
                        }}
                        onClick={() => toggleTagFilter(tag.id)}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                  {tags.length === 0 && <p className="text-sm text-muted-foreground">No tags created yet.</p>}
                </div>
              </PopoverContent>
            </Popover>

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
                      onValueChange={(value) => updateTimestampSettings({ format: value })}
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
                <DropdownMenuItem onClick={() => exportContent("txt")}>
                  Export as TXT {selectedTags.length > 0 && "(Filtered)"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportContent("pdf")}>
                  Export as PDF {selectedTags.length > 0 && "(Filtered)"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportContent("html")}>
                  Export as HTML {selectedTags.length > 0 && "(Filtered)"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportContent("md")}>
                  Export as Markdown {selectedTags.length > 0 && "(Filtered)"}
                </DropdownMenuItem>
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
            <PrivateShare
              content={selectedTags.length > 0 ? getFilteredContent() : content}
              quickNotes={quickNotes}
              icon={<Share2 className="h-4 w-4" />}
            />

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

      {/* Active Tags Display */}
      {selectedTags.length > 0 && (
        <div className="border-b bg-muted/50 px-4 py-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Filtering by:</span>
            {selectedTags.map((tagId) => {
              const tag = tags.find((t) => t.id === tagId)
              return tag ? (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  style={{ backgroundColor: tag.color, color: "white" }}
                  className="flex items-center gap-1"
                >
                  {tag.name}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => toggleTagFilter(tag.id)} />
                </Badge>
              ) : null
            })}
            <Button variant="ghost" size="sm" onClick={clearTagFilters}>
              Clear all
            </Button>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Main Content */}
        <div className={`flex-1 ${showQuickNotes ? "pr-80" : ""}`}>
          <div className="container px-4 py-6">
            <Textarea
              ref={textareaRef}
              value={selectedTags.length > 0 ? getFilteredContent() : content}
              onChange={handleContentChange}
              onKeyDown={handleKeyDownForTextarea}
              placeholder={selectedTags.length > 0 ? "Filtered content (read-only)" : "Start writing..."}
              className="min-h-[calc(100vh-8rem)] w-full border-0 resize-none focus:ring-0 text-base leading-relaxed"
              style={{ fontFamily: "ui-monospace, monospace" }}
              readOnly={selectedTags.length > 0}
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
