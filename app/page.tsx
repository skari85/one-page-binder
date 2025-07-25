"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import {
  Home,
  Eye,
  BookOpen,
  FileText,
  Share2,
  Download,
  Printer,
  Upload,
  Clock,
  Lock,
  Unlock,
  Sun,
  Moon,
  Globe,
  Brain,
  Lightbulb,
} from "lucide-react"
import { getTranslation, type Language } from "@/lib/translations"
import { getStoredLanguage, setStoredLanguage } from "@/lib/language"
import { exportToTxt, exportToDocx, exportToPdf, exportToHtml } from "@/lib/docx-export"
import { track } from "@vercel/analytics"

type ViewMode = "single" | "book"
type PageSize = "A4" | "Letter" | "A5"
type TimestampFormat = "none" | "date" | "time" | "datetime" | "iso"

const focusExercises = ["grounding", "today", "object", "color", "truth"] as const

export default function OnePageBinder() {
  // State management
  const [showApp, setShowApp] = useState(false)
  const [content, setContent] = useState("")
  const [language, setLanguage] = useState<Language>("en")
  const [viewMode, setViewMode] = useState<ViewMode>("single")
  const [pageSize, setPageSize] = useState<PageSize>("A4")
  const [timestampFormat, setTimestampFormat] = useState<TimestampFormat>("none")
  const [isLocked, setIsLocked] = useState(false)
  const [pin, setPin] = useState("")
  const [storedPin, setStoredPin] = useState("")
  const [showPinDialog, setShowPinDialog] = useState(false)
  const [showUnlockDialog, setShowUnlockDialog] = useState(false)
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false)
  const [showTermsDialog, setShowTermsDialog] = useState(false)
  const [showContactDialog, setShowContactDialog] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving" | "">("")
  const [currentExercise, setCurrentExercise] = useState(0)
  const [showSuggestion, setShowSuggestion] = useState(true)

  const { theme, setTheme } = useTheme()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Get translation helper
  const t = (key: string) => getTranslation(language, key)

  // Initialize language and content
  useEffect(() => {
    const savedLanguage = getStoredLanguage()
    setLanguage(savedLanguage)

    const savedContent = localStorage.getItem("qi-content") || ""
    const savedPin = localStorage.getItem("qi-pin") || ""
    const savedLocked = localStorage.getItem("qi-locked") === "true"

    setContent(savedContent)
    setStoredPin(savedPin)
    setIsLocked(savedLocked && savedPin)
    setShowSuggestion(savedContent.trim() === "")

    // Set random exercise
    setCurrentExercise(Math.floor(Math.random() * focusExercises.length))
  }, [])

  // Auto-save functionality
  useEffect(() => {
    if (!content && !showApp) return

    setAutoSaveStatus("saving")
    const timer = setTimeout(() => {
      localStorage.setItem("qi-content", content)
      setAutoSaveStatus("saved")
      setTimeout(() => setAutoSaveStatus(""), 2000)
    }, 1000)

    return () => clearTimeout(timer)
  }, [content, showApp])

  // Handle language change
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    setStoredLanguage(newLanguage)
  }

  // PIN functionality
  const handleSetPin = () => {
    if (pin.length === 4 && /^\d{4}$/.test(pin)) {
      localStorage.setItem("qi-pin", pin)
      setStoredPin(pin)
      setShowPinDialog(false)
      setPin("")
      toast.success(t("app.pinSet"))
    }
  }

  const handleUnlock = () => {
    if (pin === storedPin) {
      setIsLocked(false)
      localStorage.setItem("qi-locked", "false")
      setShowUnlockDialog(false)
      setPin("")
      toast.success(t("app.unlocked"))
    } else {
      toast.error(t("app.wrongPin"))
    }
  }

  const handleLock = () => {
    if (storedPin) {
      setIsLocked(true)
      localStorage.setItem("qi-locked", "true")
      toast.success(t("app.locked"))
    } else {
      setShowPinDialog(true)
    }
  }

  // Export functions
  const handleExport = (format: string) => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
    const filename = `qi-document-${timestamp}`

    switch (format) {
      case "txt":
        exportToTxt(content, `${filename}.txt`)
        break
      case "docx":
        exportToDocx(content, `${filename}.docx`)
        break
      case "pdf":
        exportToPdf(content, `${filename}.pdf`)
        break
      case "html":
        exportToHtml(content, `${filename}.html`)
        break
    }

    track("export", { format })
  }

  // Import function
  const handleImport = () => {
    fileInputRef.current?.click()
  }

  const handleFileRead = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        setContent(text)
        setShowSuggestion(false)
      }
      reader.readAsText(file)
    }
  }

  // Print function
  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Print Document</title></head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 40px;">
            <pre style="white-space: pre-wrap; word-wrap: break-word;">${content}</pre>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  // Share functions
  const handleShare = (platform: string) => {
    const text = content.slice(0, 100) + (content.length > 100 ? "..." : "")
    const url = window.location.href

    switch (platform) {
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
        break
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
        break
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`)
        break
      case "copy":
        navigator.clipboard.writeText(url)
        toast.success("Link copied to clipboard")
        break
    }
  }

  // Timestamp functions
  const insertTimestamp = () => {
    if (timestampFormat === "none") return

    const now = new Date()
    let timestamp = ""

    switch (timestampFormat) {
      case "date":
        timestamp = now.toLocaleDateString()
        break
      case "time":
        timestamp = now.toLocaleTimeString()
        break
      case "datetime":
        timestamp = now.toLocaleString()
        break
      case "iso":
        timestamp = now.toISOString()
        break
    }

    const textarea = textareaRef.current
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newContent = content.slice(0, start) + timestamp + content.slice(end)
      setContent(newContent)

      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + timestamp.length, start + timestamp.length)
      }, 0)
    }
  }

  // Focus exercise functions
  const handleExerciseClick = (exerciseKey: string) => {
    const exerciseText = t(`focus.exercises.${exerciseKey}`)
    setContent(exerciseText + " ")
    setShowSuggestion(false)
    textareaRef.current?.focus()
    track("focus_exercise_used", { exercise: exerciseKey })
  }

  const handleSuggestionClick = () => {
    const exerciseKey = focusExercises[currentExercise]
    handleExerciseClick(exerciseKey)
  }

  // Word and character count
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
  const charCount = content.length

  // Handle content change
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    setShowSuggestion(e.target.value.trim() === "")
  }

  // Get page size classes
  const getPageSizeClass = () => {
    switch (pageSize) {
      case "A4":
        return "max-w-[210mm]"
      case "Letter":
        return "max-w-[8.5in]"
      case "A5":
        return "max-w-[148mm]"
      default:
        return "max-w-4xl"
    }
  }

  // Landing page
  if (!showApp) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-6">
          <div className="flex items-center gap-2">
            <img src="/qilogo.png" alt="Qi Logo" className="w-8 h-8" />
          </div>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-20 border-none shadow-none">
              <Globe className="w-4 h-4" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">EN</SelectItem>
              <SelectItem value="zh">中文</SelectItem>
            </SelectContent>
          </Select>
        </header>

        {/* Main content */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="max-w-md space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl font-light text-gray-900">{t("landing.title")}</h1>
              <p className="text-xl text-gray-600">{t("landing.subtitle")}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{t("landing.description")}</p>
            </div>

            <Button onClick={() => setShowApp(true)} className="w-full py-3 text-lg font-medium">
              {t("landing.enter")}
            </Button>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center">
          <div className="flex justify-center gap-6 text-sm text-gray-500">
            <button onClick={() => setShowPrivacyDialog(true)} className="hover:text-gray-700 transition-colors">
              {t("landing.footer.privacy")}
            </button>
            <button onClick={() => setShowTermsDialog(true)} className="hover:text-gray-700 transition-colors">
              {t("landing.footer.terms")}
            </button>
            <button onClick={() => setShowContactDialog(true)} className="hover:text-gray-700 transition-colors">
              {t("landing.footer.contact")}
            </button>
          </div>
        </footer>

        {/* Dialogs */}
        <Dialog open={showPrivacyDialog} onOpenChange={setShowPrivacyDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("privacy.title")}</DialogTitle>
              <DialogDescription>{t("privacy.content")}</DialogDescription>
            </DialogHeader>
            <Button onClick={() => setShowPrivacyDialog(false)}>{t("privacy.close")}</Button>
          </DialogContent>
        </Dialog>

        <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("terms.title")}</DialogTitle>
              <DialogDescription>{t("terms.content")}</DialogDescription>
            </DialogHeader>
            <Button onClick={() => setShowTermsDialog(false)}>{t("terms.close")}</Button>
          </DialogContent>
        </Dialog>

        <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("contact.title")}</DialogTitle>
              <DialogDescription>{t("contact.content")}</DialogDescription>
            </DialogHeader>
            <Button onClick={() => setShowContactDialog(false)}>{t("contact.close")}</Button>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // Writing app (locked state)
  if (isLocked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 space-y-4">
            <div className="text-center space-y-2">
              <Lock className="w-12 h-12 mx-auto text-muted-foreground" />
              <h2 className="text-xl font-semibold">{t("app.unlockTitle")}</h2>
              <p className="text-sm text-muted-foreground">{t("app.unlockDescription")}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="unlock-pin">{t("app.enterPin")}</Label>
              <Input
                id="unlock-pin"
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                className="text-center text-2xl tracking-widest"
                placeholder="••••"
              />
            </div>
            <Button onClick={handleUnlock} className="w-full">
              {t("app.unlock")}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Writing app (main interface)
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowApp(false)} className="gap-2">
              <Home className="w-4 h-4" />
              {t("app.home")}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  {viewMode === "single" ? <Eye className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                  {t("app.view")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setViewMode("single")}>
                  <Eye className="w-4 h-4 mr-2" />
                  {t("app.single")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setViewMode("book")}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  {t("app.book")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Page Size */}
            <Select value={pageSize} onValueChange={(value: PageSize) => setPageSize(value)}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A4">A4</SelectItem>
                <SelectItem value="Letter">Letter</SelectItem>
                <SelectItem value="A5">A5</SelectItem>
              </SelectContent>
            </Select>

            {/* Focus Exercises */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Brain className="w-4 h-4" />
                  {t("focus.title")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80">
                <div className="p-2">
                  <h4 className="font-medium text-sm mb-2">{t("focus.subtitle")}</h4>
                  {focusExercises.map((exercise) => (
                    <DropdownMenuItem
                      key={exercise}
                      onClick={() => handleExerciseClick(exercise)}
                      className="cursor-pointer p-3 rounded-md"
                    >
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        <span className="text-sm">{t(`focus.exercises.${exercise}`)}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Share */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Share2 className="w-4 h-4" />
                  {t("app.share")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleShare("twitter")}>
                  {t("app.shareOptions.twitter")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare("facebook")}>
                  {t("app.shareOptions.facebook")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare("linkedin")}>
                  {t("app.shareOptions.linkedin")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleShare("copy")}>{t("app.shareOptions.copy")}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Export */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  {t("app.export")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport("txt")}>
                  <FileText className="w-4 h-4 mr-2" />
                  {t("app.exportOptions.txt")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("docx")}>
                  <FileText className="w-4 h-4 mr-2" />
                  {t("app.exportOptions.docx")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("pdf")}>
                  <FileText className="w-4 h-4 mr-2" />
                  {t("app.exportOptions.pdf")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("html")}>
                  <FileText className="w-4 h-4 mr-2" />
                  {t("app.exportOptions.html")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Print */}
            <Button variant="ghost" size="sm" onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" />
              {t("app.print")}
            </Button>

            {/* Import */}
            <Button variant="ghost" size="sm" onClick={handleImport} className="gap-2">
              <Upload className="w-4 h-4" />
              {t("app.import")}
            </Button>

            {/* Timestamp */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Clock className="w-4 h-4" />
                  {t("app.timestamp")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <div className="p-2">
                  <Select value={timestampFormat} onValueChange={(value: TimestampFormat) => setTimestampFormat(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">{t("app.timestampFormats.none")}</SelectItem>
                      <SelectItem value="date">{t("app.timestampFormats.date")}</SelectItem>
                      <SelectItem value="time">{t("app.timestampFormats.time")}</SelectItem>
                      <SelectItem value="datetime">{t("app.timestampFormats.datetime")}</SelectItem>
                      <SelectItem value="iso">{t("app.timestampFormats.iso")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {timestampFormat !== "none" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={insertTimestamp}>Insert Timestamp</DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* PIN Lock */}
            <Button
              variant="ghost"
              size="sm"
              onClick={storedPin ? handleLock : () => setShowPinDialog(true)}
              className="gap-2"
            >
              {storedPin ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              {t("app.pin")}
            </Button>

            {/* Theme Toggle */}
            <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* Language */}
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-20">
                <Globe className="w-4 h-4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        <div className="relative">
          {/* Focus Exercise Suggestion Card */}
          {showSuggestion && (
            <Card className="mb-4 border-dashed">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Brain className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium text-sm">{t("focus.suggestion.title")}</h3>
                      <p className="text-xs text-muted-foreground">{t("focus.suggestion.description")}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleSuggestionClick} className="gap-2 bg-transparent">
                    <Lightbulb className="w-4 h-4" />
                    {t("focus.suggestion.button")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Writing Area */}
          <div className={`mx-auto ${getPageSizeClass()}`}>
            <div
              className={`bg-card rounded-lg shadow-sm ${
                viewMode === "book" ? "min-h-[800px] p-8 bg-white dark:bg-gray-900 shadow-lg border" : "min-h-[600px]"
              }`}
            >
              <Textarea
                ref={textareaRef}
                value={content}
                onChange={handleContentChange}
                placeholder={t("app.placeholder")}
                className={`w-full h-full resize-none border-0 bg-transparent text-base leading-relaxed focus-visible:ring-0 ${
                  viewMode === "book"
                    ? "min-h-[750px] columns-2 gap-8 column-fill-auto break-words p-0 font-serif text-justify"
                    : "min-h-[600px] p-8"
                }`}
                style={{
                  fontFamily:
                    viewMode === "book" ? "ui-serif, Georgia, Cambria, serif" : "ui-sans-serif, system-ui, sans-serif",
                  lineHeight: viewMode === "book" ? "1.8" : "1.6",
                  columnGap: viewMode === "book" ? "2rem" : "normal",
                  columnRule: viewMode === "book" ? "1px solid #e5e7eb" : "none",
                }}
              />
            </div>
          </div>

          {/* Status Bar */}
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>
                {wordCount} {t("app.wordCount")}
              </span>
              <span>
                {charCount} {t("app.charCount")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {autoSaveStatus === "saving" && <span className="text-yellow-600">{t("app.saving")}</span>}
              {autoSaveStatus === "saved" && <span className="text-green-600">{t("app.autoSaved")}</span>}
            </div>
          </div>
        </div>
      </main>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept=".txt,.md,.doc,.docx" onChange={handleFileRead} className="hidden" />

      {/* PIN Setup Dialog */}
      <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("app.setPinTitle")}</DialogTitle>
            <DialogDescription>{t("app.setPinDescription")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="set-pin">{t("app.enterPin")}</Label>
              <Input
                id="set-pin"
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSetPin()}
                className="text-center text-2xl tracking-widest"
                placeholder="••••"
              />
            </div>
            <Button onClick={handleSetPin} className="w-full">
              {t("app.pin")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
