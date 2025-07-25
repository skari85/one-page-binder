"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Home,
  Download,
  Printer,
  Share2,
  Lock,
  Sun,
  Moon,
  FileText,
  BookOpen,
  Brain,
  Globe,
  Lightbulb,
} from "lucide-react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { track } from "@vercel/analytics"

import { exportToTxt, exportToDocx, exportToPdf, exportToHtml, printDocument } from "@/lib/docx-export"
import { getTranslation } from "@/lib/translations"
import { getDefaultLanguage, setLanguage, type Language } from "@/lib/language"

interface FocusExercise {
  id: string
  prompt: string
}

export default function OnePageBinder() {
  // Core state
  const [content, setContent] = useState("")
  const [isLocked, setIsLocked] = useState(false)
  const [pin, setPin] = useState("")
  const [storedPin, setStoredPin] = useState("")
  const [pinInput, setPinInput] = useState("")
  const [isSettingPin, setIsSettingPin] = useState(false)
  const [confirmPin, setConfirmPin] = useState("")
  const [language, setLanguageState] = useState<Language>("en")
  const [showLanding, setShowLanding] = useState(true)

  // UI state
  const [viewMode, setViewMode] = useState<"single" | "book">("single")
  const [pageSize, setPageSize] = useState<"a4" | "letter" | "a5">("a4")
  const [timestampFormat, setTimestampFormat] = useState<"none" | "iso" | "locale" | "custom">("none")
  const [autoSave, setAutoSave] = useState(true)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [wordCount, setWordCount] = useState(0)
  const [characterCount, setCharacterCount] = useState(0)

  // Focus exercises
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [showExerciseCard, setShowExerciseCard] = useState(false)

  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { theme, setTheme } = useTheme()

  // Get translation helper
  const t = useCallback((key: string) => getTranslation(language, key), [language])

  // Focus exercises
  const focusExercises: FocusExercise[] = [
    { id: "notice", prompt: t("focus.exercises.0") },
    { id: "today", prompt: t("focus.exercises.1") },
    { id: "object", prompt: t("focus.exercises.2") },
    { id: "color", prompt: t("focus.exercises.3") },
    { id: "truth", prompt: t("focus.exercises.4") },
  ]

  // Initialize
  useEffect(() => {
    const savedLanguage = getDefaultLanguage()
    setLanguageState(savedLanguage)

    const savedContent = localStorage.getItem("content")
    if (savedContent) setContent(savedContent)

    const savedPin = localStorage.getItem("pin")
    if (savedPin) {
      setStoredPin(savedPin)
      setIsLocked(true)
    }

    const savedViewMode = localStorage.getItem("viewMode") as "single" | "book"
    if (savedViewMode) setViewMode(savedViewMode)

    const savedPageSize = localStorage.getItem("pageSize") as "a4" | "letter" | "a5"
    if (savedPageSize) setPageSize(savedPageSize)

    const savedTimestampFormat = localStorage.getItem("timestampFormat") as "none" | "iso" | "locale" | "custom"
    if (savedTimestampFormat) setTimestampFormat(savedTimestampFormat)

    // Set random exercise index
    setCurrentExerciseIndex(Math.floor(Math.random() * focusExercises.length))
  }, [])

  // Auto-save
  useEffect(() => {
    if (autoSave && content) {
      const timer = setTimeout(() => {
        localStorage.setItem("content", content)
        setLastSaved(new Date())
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [content, autoSave])

  // Update counts
  useEffect(() => {
    const words = content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
    const characters = content.length
    setWordCount(words)
    setCharacterCount(characters)

    // Show exercise card if content is empty
    setShowExerciseCard(content.trim().length === 0)
  }, [content])

  // Language change handler
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    setLanguage(newLanguage)
    track("language_changed", { language: newLanguage })
  }

  // PIN handlers
  const handleSetPin = () => {
    if (pin === confirmPin && pin.length >= 4) {
      setStoredPin(pin)
      localStorage.setItem("pin", pin)
      setIsSettingPin(false)
      setPin("")
      setConfirmPin("")
      toast.success(t("app.pinSet"))
    }
  }

  const handleUnlock = () => {
    if (pinInput === storedPin) {
      setIsLocked(false)
      setPinInput("")
    } else {
      toast.error(t("app.wrongPin"))
    }
  }

  const handleLock = () => {
    if (storedPin) {
      setIsLocked(true)
    } else {
      setIsSettingPin(true)
    }
  }

  // Export handlers
  const handleExport = (format: "txt" | "docx" | "pdf" | "html") => {
    const filename = `document-${new Date().toISOString().split("T")[0]}`

    try {
      switch (format) {
        case "txt":
          exportToTxt(content, filename)
          break
        case "docx":
          exportToDocx(content, filename)
          break
        case "pdf":
          exportToPdf(content, filename)
          break
        case "html":
          exportToHtml(content, filename)
          break
      }
      track("export", { format })
      toast.success(`Exported as ${format.toUpperCase()}`)
    } catch (error) {
      toast.error(`Failed to export as ${format.toUpperCase()}`)
    }
  }

  // Share handlers
  const handleShare = (platform: string) => {
    const text = content.slice(0, 100) + (content.length > 100 ? "..." : "")
    const url = window.location.href

    let shareUrl = ""
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        break
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
      case "email":
        shareUrl = `mailto:?subject=Shared from One Page Binder&body=${encodeURIComponent(text + "\n\n" + url)}`
        break
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank")
      track("share", { platform })
    }
  }

  // Focus exercise handlers
  const handleUseExercise = (exercise: FocusExercise) => {
    setContent(exercise.prompt + " ")
    setShowExerciseCard(false)
    textareaRef.current?.focus()
    track("focus_exercise_used", { exercise: exercise.id })
  }

  const handleRandomExercise = () => {
    const randomIndex = Math.floor(Math.random() * focusExercises.length)
    setCurrentExerciseIndex(randomIndex)
    handleUseExercise(focusExercises[randomIndex])
  }

  // Add timestamp
  const addTimestamp = () => {
    if (timestampFormat === "none") return

    let timestamp = ""
    const now = new Date()

    switch (timestampFormat) {
      case "iso":
        timestamp = now.toISOString()
        break
      case "locale":
        timestamp = now.toLocaleString()
        break
      case "custom":
        timestamp = now.toLocaleDateString()
        break
    }

    const newContent = content + (content ? "\n\n" : "") + `[${timestamp}] `
    setContent(newContent)
    textareaRef.current?.focus()
  }

  // Landing page
  if (showLanding) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-6">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="text-center space-y-8 max-w-md">
            <div className="space-y-4">
              <h1 className="text-6xl font-light text-gray-900">{t("landing.title")}</h1>
              <p className="text-xl text-gray-600">{t("landing.subtitle")}</p>
            </div>

            <Button onClick={() => setShowLanding(false)} size="lg" className="px-12 py-3 text-lg">
              {t("landing.enter")}
            </Button>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center">
          <div className="flex justify-center gap-6 text-sm text-gray-500">
            <Dialog>
              <DialogTrigger asChild>
                <button className="hover:text-gray-700">{t("landing.footer.privacy")}</button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("dialogs.privacy.title")}</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-gray-600">{t("dialogs.privacy.content")}</p>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <button className="hover:text-gray-700">{t("landing.footer.terms")}</button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("dialogs.terms.title")}</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-gray-600">{t("dialogs.terms.content")}</p>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <button className="hover:text-gray-700">{t("landing.footer.contact")}</button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("dialogs.contact.title")}</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-gray-600">{t("dialogs.contact.content")}</p>
              </DialogContent>
            </Dialog>
          </div>
        </footer>
      </div>
    )
  }

  // PIN lock screen
  if (isLocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 space-y-4">
            <div className="text-center">
              <Lock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold">{t("app.enterPin")}</h2>
            </div>
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-full p-3 border rounded-lg text-center text-2xl tracking-widest"
              placeholder="••••"
              maxLength={6}
              onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
            />
            <Button onClick={handleUnlock} className="w-full">
              {t("app.unlock")}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // PIN setup dialog
  if (isSettingPin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 space-y-4">
            <div className="text-center">
              <Lock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold">{t("app.setPin")}</h2>
            </div>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full p-3 border rounded-lg text-center text-2xl tracking-widest"
              placeholder="••••"
              maxLength={6}
            />
            <input
              type="password"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              className="w-full p-3 border rounded-lg text-center text-2xl tracking-widest"
              placeholder={t("app.confirmPin")}
              maxLength={6}
            />
            <div className="flex gap-2">
              <Button onClick={() => setIsSettingPin(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSetPin} className="flex-1">
                {t("app.setPin")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main app
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowLanding(true)}>
              <Home className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-semibold">{t("app.title")}</h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Focus exercises dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Brain className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-3 border-b">
                  <h3 className="font-semibold">{t("focus.title")}</h3>
                  <p className="text-sm text-gray-600">{t("focus.subtitle")}</p>
                </div>
                {focusExercises.map((exercise, index) => (
                  <DropdownMenuItem
                    key={exercise.id}
                    onClick={() => handleUseExercise(exercise)}
                    className="p-3 cursor-pointer"
                  >
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 mt-0.5 text-yellow-500" />
                      <span className="text-sm">{exercise.prompt}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
                <Separator />
                <DropdownMenuItem onClick={handleRandomExercise} className="p-3">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    <span>Random Exercise</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Export dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport("txt")}>{t("app.exportOptions.txt")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("docx")}>{t("app.exportOptions.docx")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("pdf")}>{t("app.exportOptions.pdf")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("html")}>{t("app.exportOptions.html")}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Print */}
            <Button variant="ghost" size="sm" onClick={() => printDocument(content, "Document")}>
              <Printer className="h-4 w-4" />
            </Button>

            {/* Share dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4" />
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
                <DropdownMenuItem onClick={() => handleShare("email")}>{t("app.shareOptions.email")}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme toggle */}
            <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Language selector */}
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
              </SelectContent>
            </Select>

            {/* Lock button */}
            <Button variant="ghost" size="sm" onClick={handleLock}>
              <Lock className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span>
              {wordCount} {t("app.wordCount")}
            </span>
            <span>
              {characterCount} {t("app.characterCount")}
            </span>
            {lastSaved && (
              <span>
                {t("app.autoSave")}: {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Select value={viewMode} onValueChange={(value: "single" | "book") => setViewMode(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {t("app.singlePage")}
                  </div>
                </SelectItem>
                <SelectItem value="book">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    {t("app.bookView")}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={pageSize} onValueChange={(value: "a4" | "letter" | "a5") => setPageSize(value)}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a4">A4</SelectItem>
                <SelectItem value="letter">Letter</SelectItem>
                <SelectItem value="a5">A5</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Focus exercise card */}
          {showExerciseCard && (
            <Card className="mb-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{t("focus.contextualPrompt")}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {focusExercises[currentExerciseIndex].prompt}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUseExercise(focusExercises[currentExerciseIndex])}
                      >
                        {t("focus.tryExercise")}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Writing area */}
          <Card
            className={`${
              pageSize === "a4" ? "max-w-[210mm]" : pageSize === "letter" ? "max-w-[8.5in]" : "max-w-[148mm]"
            } mx-auto`}
          >
            <CardContent className="p-0">
              <Textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t("app.placeholder")}
                className={`min-h-[600px] border-0 resize-none focus:ring-0 text-lg leading-relaxed ${
                  viewMode === "book" ? "columns-2 gap-8" : ""
                }`}
              />
            </CardContent>
          </Card>

          {/* Timestamp button */}
          {timestampFormat !== "none" && (
            <div className="text-center mt-4">
              <Button variant="outline" onClick={addTimestamp}>
                Add {t("app.timestamp")}
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
