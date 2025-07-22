"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  ExternalLink,
  BookOpen,
  FileText,
  Moon,
  Sun,
  Share2,
  Download,
  Clock,
  Lock,
  ChevronLeft,
  ChevronRight,
  Printer,
  FileDown,
  Upload,
} from "lucide-react"
import { useTheme } from "next-themes"
import { exportToDocx } from "@/lib/docx-export"
import { getTranslation, type Language } from "@/lib/translation"
import { getLanguage, setLanguage } from "@/lib/language"
import { translations } from "@/lib/translations"

const CHARS_PER_PAGE = 2000
const LINES_PER_PAGE = 50

interface TimestampedContent {
  id: string
  content: string
  timestamp: Date
}

type TimestampFormat = "datetime" | "date" | "time"

export default function QiApp() {
  const [content, setContent] = useState("")
  const [timestampedContent, setTimestampedContent] = useState<TimestampedContent[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLocked, setIsLocked] = useState(false)
  const [pin, setPin] = useState("")
  const [enteredPin, setEnteredPin] = useState("")
  const [showPinDialog, setShowPinDialog] = useState(false)
  const [showUnlockDialog, setShowUnlockDialog] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [timestampFormat, setTimestampFormat] = useState<TimestampFormat>("datetime")
  const [language, setLanguageState] = useState<Language>("en")
  const [mounted, setMounted] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { theme, setTheme } = useTheme()

  const t = (key: string) => getTranslation(language, key)

  useEffect(() => {
    setMounted(true)
    const savedLanguage = getLanguage()
    setLanguageState(savedLanguage)

    const savedContent = localStorage.getItem("qi-content")
    const savedTimestampedContent = localStorage.getItem("qi-timestamped-content")
    const savedPin = localStorage.getItem("qi-pin")
    const savedLocked = localStorage.getItem("qi-locked")
    const savedTimestampFormat = localStorage.getItem("qi-timestamp-format")

    if (savedContent) setContent(savedContent)
    if (savedTimestampedContent) {
      try {
        const parsed = JSON.parse(savedTimestampedContent)
        setTimestampedContent(
          parsed.map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          })),
        )
      } catch (e) {
        console.error("Failed to parse timestamped content:", e)
      }
    }
    if (savedPin) setPin(savedPin)
    if (savedLocked === "true") setIsLocked(true)
    if (savedTimestampFormat) setTimestampFormat(savedTimestampFormat as TimestampFormat)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("qi-content", content)
    }
  }, [content, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("qi-timestamped-content", JSON.stringify(timestampedContent))
    }
  }, [timestampedContent, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("qi-timestamp-format", timestampFormat)
    }
  }, [timestampFormat, mounted])

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    setLanguage(newLanguage)
  }

  const formatTimestamp = (date: Date) => {
    const options: Intl.DateTimeFormatOptions =
      timestampFormat === "datetime"
        ? { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
        : timestampFormat === "date"
          ? { year: "numeric", month: "short", day: "numeric" }
          : { hour: "2-digit", minute: "2-digit" }

    return date.toLocaleDateString(language === "zh" ? "zh-CN" : "en-US", options)
  }

  const addTimestamp = useCallback(() => {
    const now = new Date()
    const newEntry: TimestampedContent = {
      id: Date.now().toString(),
      content: content,
      timestamp: now,
    }
    setTimestampedContent((prev) => [...prev, newEntry])
    setContent("")
  }, [content])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "t") {
        e.preventDefault()
        addTimestamp()
      }
    },
    [addTimestamp],
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  const totalPages = Math.max(
    1,
    Math.ceil(
      (content.length + timestampedContent.reduce((acc, item) => acc + item.content.length, 0)) / CHARS_PER_PAGE,
    ),
  )

  const getPageContent = (pageNum: number) => {
    const allContent =
      timestampedContent.map((item) => `${formatTimestamp(item.timestamp)}\n${item.content}`).join("\n\n") +
      (content ? `\n\n${content}` : "")

    const startChar = (pageNum - 1) * CHARS_PER_PAGE
    const endChar = pageNum * CHARS_PER_PAGE
    return allContent.slice(startChar, endChar)
  }

  const handleSetPin = () => {
    if (pin.length === 4) {
      localStorage.setItem("qi-pin", pin)
      setShowPinDialog(false)
    }
  }

  const handleUnlock = () => {
    if (enteredPin === pin) {
      setIsLocked(false)
      localStorage.setItem("qi-locked", "false")
      setShowUnlockDialog(false)
      setEnteredPin("")
    }
  }

  const handleLock = () => {
    if (pin) {
      setIsLocked(true)
      localStorage.setItem("qi-locked", "true")
    } else {
      setShowPinDialog(true)
    }
  }

  const exportAsText = () => {
    const allContent =
      timestampedContent.map((item) => `${formatTimestamp(item.timestamp)}\n${item.content}`).join("\n\n") +
      (content ? `\n\n${content}` : "")

    const blob = new Blob([allContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "qi-writing.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportAsDocx = async () => {
    const allContent =
      timestampedContent.map((item) => `${formatTimestamp(item.timestamp)}\n${item.content}`).join("\n\n") +
      (content ? `\n\n${content}` : "")

    await exportToDocx(allContent, "qi-writing.docx")
  }

  const exportAsPdf = () => {
    window.print()
  }

  const importFromFile = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".txt"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const text = e.target?.result as string
          setContent((prev) => prev + (prev ? "\n\n" : "") + text)
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  if (!mounted) {
    return null
  }

  if (isLocked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Lock className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <h2 className="text-xl font-semibold">{t("enterPinTitle")}</h2>
                <p className="text-sm text-muted-foreground mt-1">{t("enterPinDescription")}</p>
              </div>
              <div className="space-y-3">
                <Input
                  type="password"
                  placeholder={t("enterPin")}
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value)}
                  maxLength={4}
                  className="text-center text-lg tracking-widest"
                />
                <Button onClick={handleUnlock} className="w-full" disabled={enteredPin.length !== 4}>
                  {t("unlock")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          {/* Left side - App name and status */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold">{t("appName")}</h1>
              <Badge variant="secondary" className="text-xs">
                {t("page")} {currentPage} {t("of")} {totalPages}
              </Badge>
            </div>
          </div>

          {/* Right side - All controls */}
          <div className="flex items-center space-x-1">
            {/* Language Selector */}
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-20 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{translations.en.english}</SelectItem>
                <SelectItem value="zh">{translations.zh.chinese}</SelectItem>
              </SelectContent>
            </Select>

            {/* Navigation */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="h-6" />

            {/* View Mode */}
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <BookOpen className="h-4 w-4" />
            </Button>

            {/* Page Size */}
            <Select defaultValue="a4">
              <SelectTrigger className="w-16 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a4">A4</SelectItem>
                <SelectItem value="letter">Letter</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
              </SelectContent>
            </Select>

            {/* Theme Toggle */}
            <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Share */}
            <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("shareTitle")}</DialogTitle>
                  <DialogDescription>{t("shareDescription")}</DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <Button className="w-full bg-transparent" variant="outline">
                    {t("shareOnTwitter")}
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline">
                    {t("shareOnFacebook")}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Export Options */}
            <Select
              onValueChange={(value) => {
                switch (value) {
                  case "txt":
                    exportAsText()
                    break
                  case "docx":
                    exportAsDocx()
                    break
                  case "pdf":
                    exportAsPdf()
                    break
                  case "print":
                    window.print()
                    break
                  case "import":
                    importFromFile()
                    break
                }
              }}
            >
              <SelectTrigger className="w-10 h-9">
                <Download className="h-4 w-4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="txt">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{t("exportAsTxt")}</div>
                      <div className="text-xs text-muted-foreground">{t("exportAsTxtDesc")}</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="docx">
                  <div className="flex items-center space-x-2">
                    <FileDown className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{t("exportAsDocx")}</div>
                      <div className="text-xs text-muted-foreground">{t("exportAsDocxDesc")}</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="pdf">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{t("exportAsPdf")}</div>
                      <div className="text-xs text-muted-foreground">{t("exportAsPdfDesc")}</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="print">
                  <div className="flex items-center space-x-2">
                    <Printer className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{t("printDocument")}</div>
                      <div className="text-xs text-muted-foreground">{t("printDocumentDesc")}</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="import">
                  <div className="flex items-center space-x-2">
                    <Upload className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{t("importFromFile")}</div>
                      <div className="text-xs text-muted-foreground">{t("importFromFileDesc")}</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Timestamp Format */}
            <Select value={timestampFormat} onValueChange={(value: TimestampFormat) => setTimestampFormat(value)}>
              <SelectTrigger className="w-10 h-9">
                <Clock className="h-4 w-4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="datetime">{t("timestampFormats.datetime")}</SelectItem>
                <SelectItem value="date">{t("timestampFormats.date")}</SelectItem>
                <SelectItem value="time">{t("timestampFormats.time")}</SelectItem>
              </SelectContent>
            </Select>

            {/* Lock */}
            <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" onClick={pin ? handleLock : undefined}>
                  <Lock className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("setPinTitle")}</DialogTitle>
                  <DialogDescription>{t("setPinDescription")}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    type="password"
                    placeholder={t("enterPin")}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    maxLength={4}
                    className="text-center text-lg tracking-widest"
                  />
                  <Button onClick={handleSetPin} className="w-full" disabled={pin.length !== 4}>
                    {t("setPin")}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Previous Content Display */}
          {timestampedContent.length > 0 && (
            <div className="space-y-6 mb-8">
              {timestampedContent.map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="text-sm text-muted-foreground font-medium">{formatTimestamp(item.timestamp)}</div>
                  <div className="whitespace-pre-wrap text-foreground leading-relaxed">{item.content}</div>
                </div>
              ))}
            </div>
          )}

          {/* Current Writing Area */}
          <div className="space-y-4">
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={timestampedContent.length > 0 ? t("continueWriting") : t("startWritingTimestamps")}
              className="min-h-[400px] resize-none border-0 shadow-none text-base leading-relaxed focus-visible:ring-0 p-0"
              style={{ fontSize: "16px", lineHeight: "1.6" }}
            />

            {content && (
              <div className="flex justify-end">
                <Button onClick={addTimestamp} variant="outline" size="sm">
                  <Clock className="h-4 w-4 mr-2" />
                  Add Timestamp (Ctrl+T)
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
