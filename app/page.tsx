"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
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
  FileDown,
  FileUp,
  Printer,
  FileCheck,
  Home,
  BookOpen,
  SplitIcon as SinglePage,
  Shield,
  Scale,
  Mail,
  Send,
  CheckCircle,
} from "lucide-react"
import { useTheme } from "next-themes"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { PWAUpdatePrompt } from "@/components/pwa-update-prompt"
import { OfflineIndicator } from "@/components/offline-indicator"
import { isTauri } from "@/lib/tauri-api"
import { getTranslation, type Language } from "@/lib/translations"
import { getLanguage, setLanguage } from "@/lib/language"

// Export functions without file-saver dependency
const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType })
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

const exportToDocx = async (content: string, filename: string) => {
  try {
    const { Document, Packer, Paragraph, TextRun } = await import("docx")

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: content.split("\n").map(
            (line) =>
              new Paragraph({
                children: [new TextRun(line || " ")],
              }),
          ),
        },
      ],
    })

    const blob = await Packer.toBlob(doc)
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
    console.error("DOCX export failed:", error)
    // Fallback to HTML export
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Qi Document</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 1in;
            white-space: pre-wrap;
          }
        </style>
      </head>
      <body>
        <pre>${content}</pre>
      </body>
      </html>
    `
    downloadFile(htmlContent, filename.replace(".docx", ".html"), "text/html;charset=utf-8")
  }
}

export default function Qi() {
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
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false)
  const [showTermsDialog, setShowTermsDialog] = useState(false)
  const [showContactDialog, setShowContactDialog] = useState(false)
  const [exportFormat, setExportFormat] = useState<"txt" | "docx" | "pdf" | "epub">("txt")
  const [exportRange, setExportRange] = useState<"all" | "current" | "range">("all")
  const [exportStartPage, setExportStartPage] = useState(1)
  const [exportEndPage, setExportEndPage] = useState(1)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [timestampsEnabled, setTimestampsEnabled] = useState(false)
  const [lastTypingTime, setLastTypingTime] = useState(0)
  const [timestampFormat, setTimestampFormat] = useState<"datetime" | "time" | "date">("datetime")
  const [isOffline, setIsOffline] = useState(false)
  const [showNativeFileSystem, setShowNativeFileSystem] = useState(false)

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Language state
  const [language, setLanguageState] = useState<Language>("en")

  // Page-based writing system state
  const [viewMode, setViewMode] = useState<"single" | "book">("single")
  const [pageSize, setPageSize] = useState<"A4" | "Letter" | "A5">("A4")
  const [pages, setPages] = useState<Array<{ id: string; content: string; wordCount: number }>>([
    { id: "1", content: "", wordCount: 0 },
  ])
  const [currentPage, setCurrentPage] = useState(0)
  const [currentBookPage, setCurrentBookPage] = useState(0)
  const pageRefs = useRef<(HTMLTextAreaElement | null)[]>([])

  // Page size configurations
  const pageSizes = {
    A4: {
      width: "210mm",
      height: "297mm",
      wordsPerPage: 325,
      linesPerPage: 30,
      className: "w-[800px] h-[1131px]",
    },
    Letter: {
      width: "8.5in",
      height: "11in",
      wordsPerPage: 300,
      linesPerPage: 28,
      className: "w-[800px] h-[1035px]",
    },
    A5: {
      width: "148mm",
      height: "210mm",
      wordsPerPage: 200,
      linesPerPage: 22,
      className: "w-[600px] h-[849px]",
    },
  }

  // Helper functions for page management
  const countWords = (text: string) => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
  }

  const getCurrentPageSize = () => pageSizes[pageSize]

  const shouldCreateNewPage = (content: string) => {
    const wordCount = countWords(content)
    const currentPageSize = getCurrentPageSize()
    return wordCount >= currentPageSize.wordsPerPage
  }

  // Ensure component is mounted before accessing theme
  useEffect(() => {
    setMounted(true)

    // Initialize language
    const savedLanguage = getLanguage()
    setLanguageState(savedLanguage)

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
    const savedContent = localStorage.getItem("qi-content")
    const savedPin = localStorage.getItem("qi-pin")
    const savedLockState = localStorage.getItem("qi-locked")
    const savedTimestamps = localStorage.getItem("qi-timestamps")
    const savedTimestampFormat = localStorage.getItem("qi-timestamp-format")
    const hasVisited = localStorage.getItem("qi-visited")

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
          localStorage.setItem("qi-content", content)
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
    localStorage.setItem("qi-timestamps", timestampsEnabled.toString())
  }, [timestampsEnabled])

  useEffect(() => {
    localStorage.setItem("qi-timestamp-format", timestampFormat)
  }, [timestampFormat])

  // Handle language changes
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    setLanguage(newLanguage)
  }

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
    // Timestamp shortcut
    if ((e.ctrlKey || e.metaKey) && e.key === "t") {
      e.preventDefault()
      insertTimestamp()
    }

    // Save shortcut (Ctrl/Cmd + S)
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault()
      // Content is already auto-saved, just show a brief indicator
      setIsSaving(true)
      setTimeout(() => setIsSaving(false), 500)
    }

    // Export shortcut (Ctrl/Cmd + E)
    if ((e.ctrlKey || e.metaKey) && e.key === "e") {
      e.preventDefault()
      handleExport("txt")
    }

    // Lock shortcut (Ctrl/Cmd + L)
    if ((e.ctrlKey || e.metaKey) && e.key === "l") {
      e.preventDefault()
      handleLock()
    }

    // Auto-timestamp on double enter
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

  const handleEnterQi = () => {
    setShowWelcome(false)
    setShowLanding(false)
    localStorage.setItem("qi-visited", "true")
  }

  const handleGoHome = () => {
    setShowLanding(true)
    setShowWelcome(false)
  }

  const handleSetPin = () => {
    if (inputPin.length === 4 && /^\d{4}$/.test(inputPin)) {
      setPin(inputPin)
      localStorage.setItem("qi-pin", inputPin)
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
      localStorage.setItem("qi-locked", "false")
      setInputPin("")
      setShowUnlockDialog(false)
    }
  }

  const handleLock = () => {
    if (pin) {
      setIsLocked(true)
      localStorage.setItem("qi-locked", "true")
    } else {
      setIsSettingPin(true)
      setShowPinDialog(true)
    }
  }

  const handleExport = async (format: "txt" | "docx" | "pdf" | "epub" = "txt") => {
    const timestamp = new Date().toISOString().split("T")[0]
    const bookTitle =
      content
        .split("\n")[0]
        ?.replace(/[^\w\s]/gi, "")
        .trim()
        .slice(0, 50) || "Qi Document"

    if (format === "txt") {
      const filename = `${bookTitle.replace(/\s+/g, "-").toLowerCase()}-${timestamp}.txt`
      const txtContent = `${bookTitle}\n${"=".repeat(bookTitle.length)}\n\nExported from Qi - A quiet place to write\nDate: ${new Date().toLocaleDateString()}\nWords: ${countWords(content)}\n\n${"-".repeat(50)}\n\n${content}`
      downloadFile(txtContent, filename, "text/plain;charset=utf-8")
    } else if (format === "docx") {
      const filename = `${bookTitle.replace(/\s+/g, "-").toLowerCase()}-${timestamp}.docx`
      await exportToDocx(content, filename)
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
            <title>Qi</title>
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
            <h1>Qi</h1>
            <div>${content.replace(/\n/g, "<br>")}</div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleShare = async () => {
    if (navigator.share && window.isSecureContext) {
      try {
        await navigator.share({
          title: "Qi",
          text: "Check out Qi – A quiet place to write!",
          url: window.location.href,
        })
      } catch (error) {
        console.log("Share cancelled or failed:", error)
        setShowShareDialog(true)
      }
    } else {
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

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate form submission (replace with actual form handling)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSubmitSuccess(true)
      setContactForm({ name: "", email: "", message: "" })

      setTimeout(() => {
        setSubmitSuccess(false)
        setShowContactDialog(false)
      }, 2000)
    } catch (error) {
      console.error("Failed to submit form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!mounted) {
    return null
  }

  // Landing Page - Simple White Design
  if (showLanding) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="p-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img
              src="/qilogo.png"
              alt="Qi Logo"
              className="h-8 w-auto"
              onError={(e) => {
                e.currentTarget.style.display = "none"
              }}
            />
            <span className="text-xl font-bold text-black">{getTranslation(language, "appName")}</span>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value as Language)}
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded"
            >
              <option value="en">{getTranslation(language, "english")}</option>
              <option value="zh">{getTranslation(language, "chinese")}</option>
            </select>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center space-y-8 max-w-md w-full">
            {/* Logo and Title */}
            <div className="space-y-4">
              <div className="flex justify-center">
                <img
                  src="/qilogo.png"
                  alt="Qi Logo"
                  className="h-16 w-auto max-w-16"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                    const fallback = document.createElement("h1")
                    fallback.textContent = getTranslation(language, "appName")
                    fallback.className = "text-4xl font-light text-black tracking-wide"
                    e.currentTarget.parentNode?.appendChild(fallback)
                  }}
                />
              </div>
              <p className="text-lg text-gray-500 font-light">{getTranslation(language, "tagline")}</p>
            </div>

            {/* Enter Button */}
            <Button
              onClick={handleEnterQi}
              className="bg-black hover:bg-gray-900 text-white px-8 py-3 text-base font-normal rounded-none transition-colors duration-200 border border-black"
              size="lg"
            >
              {getTranslation(language, "enter")}
            </Button>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 border-t border-gray-200">
          <div className="flex justify-center space-x-8 text-sm text-gray-600">
            <button onClick={() => setShowPrivacyDialog(true)} className="hover:text-black transition-colors">
              {getTranslation(language, "privacy")}
            </button>
            <button onClick={() => setShowTermsDialog(true)} className="hover:text-black transition-colors">
              {getTranslation(language, "terms")}
            </button>
            <button onClick={() => setShowContactDialog(true)} className="hover:text-black transition-colors">
              {getTranslation(language, "contact")}
            </button>
          </div>
        </footer>

        {/* Privacy Dialog */}
        <Dialog open={showPrivacyDialog} onOpenChange={setShowPrivacyDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>{getTranslation(language, "privacyContent.title")}</span>
              </DialogTitle>
              <DialogDescription>{getTranslation(language, "privacyContent.subtitle")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Key Principles */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800">
                    {getTranslation(language, "privacyContent.localOnly")}
                  </h4>
                  <p className="text-sm text-green-700">{getTranslation(language, "privacyContent.localOnlyDesc")}</p>
                </div>
                <div className="space-y-2 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800">
                    {getTranslation(language, "privacyContent.noTracking")}
                  </h4>
                  <p className="text-sm text-blue-700">{getTranslation(language, "privacyContent.noTrackingDesc")}</p>
                </div>
                <div className="space-y-2 p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800">
                    {getTranslation(language, "privacyContent.noAccounts")}
                  </h4>
                  <p className="text-sm text-purple-700">{getTranslation(language, "privacyContent.noAccountsDesc")}</p>
                </div>
                <div className="space-y-2 p-4 bg-amber-50 rounded-lg">
                  <h4 className="font-semibold text-amber-800">
                    {getTranslation(language, "privacyContent.openSource")}
                  </h4>
                  <p className="text-sm text-amber-700">{getTranslation(language, "privacyContent.openSourceDesc")}</p>
                </div>
              </div>

              {/* What We Don't Collect */}
              <div className="space-y-3">
                <h4 className="font-semibold">{getTranslation(language, "privacyContent.dataCollection")}</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {getTranslation(language, "privacyContent.dataCollectionList")
                    .split(",")
                    .map((item: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>{item.trim()}</span>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Technical Details */}
              <div className="space-y-3">
                <h4 className="font-semibold">{getTranslation(language, "privacyContent.technical")}</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {getTranslation(language, "privacyContent.technicalList")
                    .split(",")
                    .map((item: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>{item.trim()}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Terms Dialog */}
        <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Scale className="w-5 h-5" />
                <span>{getTranslation(language, "termsContent.title")}</span>
              </DialogTitle>
              <DialogDescription>{getTranslation(language, "termsContent.subtitle")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Acceptance */}
              <div className="space-y-2">
                <p className="text-sm text-gray-600">{getTranslation(language, "termsContent.acceptance")}</p>
              </div>

              {/* Service Description */}
              <div className="space-y-2">
                <p className="text-sm text-gray-600">{getTranslation(language, "termsContent.service")}</p>
              </div>

              {/* Responsibilities */}
              <div className="space-y-3">
                <h4 className="font-semibold">{getTranslation(language, "termsContent.responsibilities")}</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {getTranslation(language, "termsContent.responsibilitiesList")
                    .split(",")
                    .map((item: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{item.trim()}</span>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Limitations */}
              <div className="space-y-3">
                <h4 className="font-semibold">{getTranslation(language, "termsContent.limitations")}</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {getTranslation(language, "termsContent.limitationsList")
                    .split(",")
                    .map((item: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-amber-500 mt-1">•</span>
                        <span>{item.trim()}</span>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Termination & Contact */}
              <div className="space-y-2">
                <p className="text-sm text-gray-600">{getTranslation(language, "termsContent.termination")}</p>
                <p className="text-sm text-gray-600">{getTranslation(language, "termsContent.contact")}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Contact Dialog */}
        <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>{getTranslation(language, "contactTitle")}</span>
              </DialogTitle>
              <DialogDescription>{getTranslation(language, "contactDescription")}</DialogDescription>
            </DialogHeader>

            {submitSuccess ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                <p className="text-green-600 font-medium">{getTranslation(language, "contactSuccess")}</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder={getTranslation(language, "contactName")}
                    value={contactForm.name}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder={getTranslation(language, "contactEmail")}
                    value={contactForm.email}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Textarea
                    placeholder={getTranslation(language, "contactMessage")}
                    value={contactForm.message}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                    rows={4}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Send className="w-4 h-4" />
                      <span>{getTranslation(language, "contactSend")}</span>
                    </div>
                  )}
                </Button>
                <p className="text-xs text-gray-500 text-center">Or email us directly at: overthinkr9@gmail.com</p>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // Welcome Screen
  if (showWelcome) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 text-center animate-in fade-in-50 duration-500">
          <div className="space-y-4">
            <div className="w-24 h-24 mx-auto bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center animate-in zoom-in-75 duration-700">
              <FileText className="w-12 h-12 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Qi</h1>
              <p className="text-muted-foreground text-lg">A quiet place to write</p>
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
            <p className="text-foreground font-medium">Welcome to Qi</p>
            <p className="text-muted-foreground">Enter below</p>
            <Button onClick={handleEnterQi} className="w-full" size="lg" type="button">
              Enter Qi
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
          <h1 className="text-2xl font-bold">Qi</h1>
          <p className="text-muted-foreground">Your writing space is locked</p>
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

      {/* Header - Fixed horizontal layout */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - App name and status */}
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold">Qi</h1>
              {isSaving && <span className="text-xs text-muted-foreground animate-pulse">Saving...</span>}
              {isOffline && (
                <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 rounded-full flex items-center">
                  <WifiOff className="w-3 h-3 mr-1" />
                  Offline
                </span>
              )}
            </div>

            {/* Right side - Controls in horizontal layout */}
            <div className="flex items-center space-x-1 flex-wrap">
              {/* Home button */}
              <Button variant="ghost" size="icon" onClick={handleGoHome} title="Go to landing page" type="button">
                <Home className="w-4 h-4" />
              </Button>

              {/* View Mode Toggle */}
              <Button
                variant={viewMode === "single" ? "default" : "ghost"}
                size="icon"
                type="button"
                onClick={() => setViewMode("single")}
                title="Single page view"
              >
                <SinglePage className="w-4 h-4" />
              </Button>

              <Button
                variant={viewMode === "book" ? "default" : "ghost"}
                size="icon"
                type="button"
                onClick={() => setViewMode("book")}
                title="Book view (dual pages)"
              >
                <BookOpen className="w-4 h-4" />
              </Button>

              {/* Page Size Selector */}
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value as "A4" | "Letter" | "A5")}
                className="px-2 py-1 text-sm bg-background border border-border rounded h-9"
                title="Page size"
              >
                <option value="A4">A4</option>
                <option value="Letter">Letter</option>
                <option value="A5">A5</option>
              </select>

              {/* Native file system (Tauri only) */}
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

              {/* Theme toggle */}
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

              {/* Share button */}
              <Button variant="ghost" size="icon" onClick={handleShare} title="Share app" type="button">
                <Share2 className="w-4 h-4" />
              </Button>

              {/* Export Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" title="Export options">
                    <FileDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <div className="px-2 py-1.5 text-sm font-semibold">{getTranslation(language, "exportOptions")}</div>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => handleExport("txt")}>
                    <FileText className="w-4 h-4 mr-2" />
                    <div className="flex flex-col">
                      <span>{getTranslation(language, "exportAsTxt")}</span>
                      <span className="text-xs text-muted-foreground">
                        {getTranslation(language, "exportAsTxtDesc")}
                      </span>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => handleExport("docx")}>
                    <FileCheck className="w-4 h-4 mr-2" />
                    <div className="flex flex-col">
                      <span>{getTranslation(language, "exportAsDocx")}</span>
                      <span className="text-xs text-muted-foreground">
                        {getTranslation(language, "exportAsDocxDesc")}
                      </span>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={handlePrint}>
                    <Printer className="w-4 h-4 mr-2" />
                    <div className="flex flex-col">
                      <span>{getTranslation(language, "printDocument")}</span>
                      <span className="text-xs text-muted-foreground">
                        {getTranslation(language, "printDocumentDesc")}
                      </span>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <label htmlFor="import-file" className="cursor-pointer flex items-center">
                      <FileUp className="w-4 h-4 mr-2" />
                      <div className="flex flex-col">
                        <span>{getTranslation(language, "importFromFile")}</span>
                        <span className="text-xs text-muted-foreground">
                          {getTranslation(language, "importFromFileDesc")}
                        </span>
                      </div>
                      <input id="import-file" type="file" accept=".txt" onChange={handleImport} className="hidden" />
                    </label>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Timestamp toggle */}
              <Button
                variant={timestampsEnabled ? "default" : "ghost"}
                size="icon"
                type="button"
                onClick={() => setTimestampsEnabled(!timestampsEnabled)}
                title="Toggle automatic timestamps"
              >
                <Clock className="w-4 h-4" />
              </Button>

              {/* Timestamp format selector */}
              {timestampsEnabled && (
                <select
                  value={timestampFormat}
                  onChange={(e) => setTimestampFormat(e.target.value as "datetime" | "time" | "date")}
                  className="px-2 py-1 text-sm bg-background border border-border rounded h-9"
                  title={getTranslation(language, "timestampFormat")}
                >
                  <option value="datetime">{getTranslation(language, "timestampFormats.datetime")}</option>
                  <option value="date">{getTranslation(language, "timestampFormats.date")}</option>
                  <option value="time">{getTranslation(language, "timestampFormats.time")}</option>
                </select>
              )}

              {/* Lock button */}
              <Button variant="ghost" size="icon" onClick={handleLock} title="Lock writing space" type="button">
                <Lock className="w-4 h-4" />
              </Button>

              {/* Language Selector */}
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value as Language)}
                className="px-2 py-1 text-sm bg-background border border-border rounded h-9"
                title={getTranslation(language, "language")}
              >
                <option value="en">{getTranslation(language, "english")}</option>
                <option value="zh">{getTranslation(language, "chinese")}</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            onKeyDown={handleKeyDown}
            placeholder={
              timestampsEnabled
                ? getTranslation(language, "startWritingTimestamps")
                : getTranslation(language, "startWriting")
            }
            className="w-full min-h-[600px] resize-none border-none outline-none bg-transparent placeholder:text-muted-foreground text-base leading-relaxed p-0"
            style={{
              fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
            }}
            aria-label="Writing space"
          />
        </div>
      </main>

      {/* Set PIN Dialog */}
      <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{getTranslation(language, "setPinTitle")}</DialogTitle>
            <DialogDescription>
              {isSettingPin
                ? getTranslation(language, "setPinDescription")
                : getTranslation(language, "enterPinDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder={getTranslation(language, "enterPin")}
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
              {getTranslation(language, "setPin")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Unlock Dialog */}
      <Dialog open={showUnlockDialog} onOpenChange={setShowUnlockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{getTranslation(language, "enterPinTitle")}</DialogTitle>
            <DialogDescription>{getTranslation(language, "enterPinDescription")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder={getTranslation(language, "enterPin")}
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
              {getTranslation(language, "unlock")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{getTranslation(language, "shareTitle")}</DialogTitle>
            <DialogDescription>{getTranslation(language, "shareDescription")}</DialogDescription>
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
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(getTranslation(language, "shareDescription"))}&url=${encodeURIComponent(window.location.href)}`,
                    "_blank",
                  )
                }
                className="flex-1"
              >
                {getTranslation(language, "shareOnTwitter")}
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
                {getTranslation(language, "shareOnFacebook")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
