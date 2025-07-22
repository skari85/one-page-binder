"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Download,
  FileText,
  FileImage,
  Printer,
  Upload,
  Clock,
  Lock,
  Unlock,
  Share2,
  Info,
  Shield,
  FileCheck,
  Mail,
  Languages,
  Brain,
  Lightbulb,
} from "lucide-react"
import { useLanguage } from "@/lib/language"
import { getTranslation } from "@/lib/translations"
import { exportToTxt, exportToDocx, exportToPdf, exportToHtml, printDocument } from "@/lib/docx-export"
import { TauriNativeFS } from "@/components/tauri-native-fs"
import { track } from "@vercel/analytics"

// Focus exercises data
const exerciseKeys = ["rightNow", "todayOnly", "objectView", "colorFeeling", "tenWords"] as const

export default function WritingApp() {
  const { language, setLanguage } = useLanguage()
  const t = (key: string) => getTranslation(language, key)

  const [content, setContent] = useState("")
  const [isLocked, setIsLocked] = useState(false)
  const [pin, setPin] = useState("")
  const [enteredPin, setEnteredPin] = useState("")
  const [showPinDialog, setShowPinDialog] = useState(false)
  const [showUnlockDialog, setShowUnlockDialog] = useState(false)
  const [timestampFormat, setTimestampFormat] = useState<"none" | "date" | "time" | "datetime">("none")
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showAboutDialog, setShowAboutDialog] = useState(false)
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false)
  const [showTermsDialog, setShowTermsDialog] = useState(false)
  const [showContactDialog, setShowContactDialog] = useState(false)
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [currentExercise, setCurrentExercise] = useState<string>("")

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize random exercise on mount
  useEffect(() => {
    const randomExercise = exerciseKeys[Math.floor(Math.random() * exerciseKeys.length)]
    setCurrentExercise(randomExercise)
  }, [])

  // Load saved content and settings
  useEffect(() => {
    const savedContent = localStorage.getItem("qi-content")
    const savedPin = localStorage.getItem("qi-pin")
    const savedTimestampFormat = localStorage.getItem("qi-timestamp-format")

    if (savedContent) setContent(savedContent)
    if (savedPin) {
      setPin(savedPin)
      setIsLocked(true)
      setShowUnlockDialog(true)
    }
    if (savedTimestampFormat) {
      setTimestampFormat(savedTimestampFormat as "none" | "date" | "time" | "datetime")
    }
  }, [])

  // Save content to localStorage
  useEffect(() => {
    localStorage.setItem("qi-content", content)

    // Update word and character counts
    const words = content.trim() ? content.trim().split(/\s+/).length : 0
    const chars = content.length
    setWordCount(words)
    setCharCount(chars)
  }, [content])

  // Save timestamp format
  useEffect(() => {
    localStorage.setItem("qi-timestamp-format", timestampFormat)
  }, [timestampFormat])

  const insertTimestamp = useCallback(() => {
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
    }

    if (timestamp && textareaRef.current) {
      const textarea = textareaRef.current
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newContent = content.substring(0, start) + timestamp + " " + content.substring(end)
      setContent(newContent)

      // Set cursor position after timestamp
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + timestamp.length + 1
        textarea.focus()
      }, 0)
    }
  }, [content, timestampFormat])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "t") {
        e.preventDefault()
        insertTimestamp()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [insertTimestamp])

  const handleSetPin = () => {
    if (pin.length === 4) {
      localStorage.setItem("qi-pin", pin)
      setIsLocked(true)
      setShowPinDialog(false)
      track("pin_set")
    }
  }

  const handleUnlock = () => {
    if (enteredPin === pin) {
      setIsLocked(false)
      setShowUnlockDialog(false)
      setEnteredPin("")
      track("app_unlocked")
    }
  }

  const handleRemovePin = () => {
    localStorage.removeItem("qi-pin")
    setPin("")
    setIsLocked(false)
    setEnteredPin("")
    track("pin_removed")
  }

  const handleImport = () => {
    fileInputRef.current?.click()
  }

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "text/plain") {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        setContent(text)
        track("file_imported")
      }
      reader.readAsText(file)
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSubmitStatus("success")
      setContactForm({ name: "", email: "", message: "" })
      track("contact_form_submitted")
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleExerciseClick = (exerciseKey: string) => {
    const exercise = t(`exercises.${exerciseKey}`)
    if (typeof exercise === "object" && exercise.prompt) {
      setContent(exercise.prompt + "\n\n")
      textareaRef.current?.focus()
      track("exercise_used", { exercise: exerciseKey })
    }
  }

  const shareUrl = typeof window !== "undefined" ? window.location.origin : ""
  const shareText = `${t("shareDescription")} - ${t("tagline")}`

  if (isLocked && showUnlockDialog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 space-y-4">
            <div className="text-center space-y-2">
              <Lock className="h-12 w-12 mx-auto text-slate-400" />
              <h2 className="text-xl font-semibold">{t("enterPinTitle")}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">{t("enterPinDescription")}</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="unlock-pin">{t("enterPin")}</Label>
                <Input
                  id="unlock-pin"
                  type="password"
                  maxLength={4}
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                  className="text-center text-lg tracking-widest"
                  placeholder="••••"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUnlock} className="flex-1" disabled={enteredPin.length !== 4}>
                  <Unlock className="h-4 w-4 mr-2" />
                  {t("unlock")}
                </Button>
                <Button variant="outline" onClick={handleRemovePin}>
                  {t("remove")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
              {t("appName")}
            </h1>
            <Badge variant="secondary" className="text-xs">
              {t("tagline")}
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            {/* Focus Exercises Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Brain className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>{t("focusExercises")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {exerciseKeys.map((key) => {
                  const exercise = t(`exercises.${key}`)
                  if (typeof exercise === "object") {
                    return (
                      <DropdownMenuItem
                        key={key}
                        onClick={() => handleExerciseClick(key)}
                        className="flex flex-col items-start space-y-1 p-3 cursor-pointer"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{exercise.icon}</span>
                          <span className="font-medium text-sm">{exercise.title}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{exercise.prompt}</p>
                        <Badge variant="outline" className="text-xs">
                          {exercise.category}
                        </Badge>
                      </DropdownMenuItem>
                    )
                  }
                  return null
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Languages className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("en")}>{t("english")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("zh")}>{t("chinese")}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Export Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t("exportOptions")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => exportToTxt(content, t("appName"))}>
                  <FileText className="h-4 w-4 mr-2" />
                  <div className="flex flex-col">
                    <span>{t("exportAsTxt")}</span>
                    <span className="text-xs text-slate-500">{t("exportAsTxtDesc")}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportToDocx(content, t("appName"))}>
                  <FileImage className="h-4 w-4 mr-2" />
                  <div className="flex flex-col">
                    <span>{t("exportAsDocx")}</span>
                    <span className="text-xs text-slate-500">{t("exportAsDocxDesc")}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportToPdf(content, t("appName"))}>
                  <FileCheck className="h-4 w-4 mr-2" />
                  <div className="flex flex-col">
                    <span>{t("exportPdf")}</span>
                    <span className="text-xs text-slate-500">{t("exportPdfDesc")}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportToHtml(content, t("appName"))}>
                  <FileText className="h-4 w-4 mr-2" />
                  <div className="flex flex-col">
                    <span>{t("exportHtml")}</span>
                    <span className="text-xs text-slate-500">{t("exportHtmlDesc")}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => printDocument(content, t("appName"))}>
                  <Printer className="h-4 w-4 mr-2" />
                  <div className="flex flex-col">
                    <span>{t("printDocument")}</span>
                    <span className="text-xs text-slate-500">{t("printDocumentDesc")}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleImport}>
                  <Upload className="h-4 w-4 mr-2" />
                  <div className="flex flex-col">
                    <span>{t("importFromFile")}</span>
                    <span className="text-xs text-slate-500">{t("importFromFileDesc")}</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Timestamp Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Clock className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t("timestampFormat")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTimestampFormat("none")}>
                  {t("timestampNone")}
                  {timestampFormat === "none" && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimestampFormat("date")}>
                  {t("timestampDate")}
                  {timestampFormat === "date" && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimestampFormat("time")}>
                  {t("timestampTime")}
                  {timestampFormat === "time" && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimestampFormat("datetime")}>
                  {t("timestampDateTime")}
                  {timestampFormat === "datetime" && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* PIN/Lock Button */}
            <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Lock className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("setPinTitle")}</DialogTitle>
                  <DialogDescription>{t("setPinDescription")}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="pin">{t("setPin")}</Label>
                    <Input
                      id="pin"
                      type="password"
                      maxLength={4}
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className="text-center text-lg tracking-widest"
                      placeholder="••••"
                    />
                  </div>
                  <Button onClick={handleSetPin} className="w-full" disabled={pin.length !== 4}>
                    {t("setPin")}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* More Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Info className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowShareDialog(true)}>
                  <Share2 className="h-4 w-4 mr-2" />
                  {t("shareTitle")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowAboutDialog(true)}>
                  <Info className="h-4 w-4 mr-2" />
                  {t("about")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowPrivacyDialog(true)}>
                  <Shield className="h-4 w-4 mr-2" />
                  {t("privacy")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowTermsDialog(true)}>
                  <FileCheck className="h-4 w-4 mr-2" />
                  {t("terms")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowContactDialog(true)}>
                  <Mail className="h-4 w-4 mr-2" />
                  {t("contact")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Focus Exercise Suggestion (appears when content is empty) */}
          {!content.trim() && currentExercise && (
            <Card className="border-dashed border-2 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="space-y-2 flex-1">
                    <p className="text-sm text-slate-600 dark:text-slate-400">{t("tryThis")}</p>
                    {(() => {
                      const exercise = t(`exercises.${currentExercise}`)
                      if (typeof exercise === "object") {
                        return (
                          <div className="cursor-pointer group" onClick={() => handleExerciseClick(currentExercise)}>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-lg">{exercise.icon}</span>
                              <span className="font-medium text-sm group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                                {exercise.title}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                              {exercise.prompt}
                            </p>
                          </div>
                        )
                      }
                      return null
                    })()}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Writing Area */}
          <Card className="shadow-lg">
            <CardContent className="p-0">
              <Textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={timestampFormat !== "none" ? t("startWritingTimestamps") : t("startWriting")}
                className="min-h-[60vh] border-0 resize-none focus:ring-0 text-lg leading-relaxed p-8"
              />
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-4">
              <span>
                {wordCount} {t("wordCount")}
              </span>
              <Separator orientation="vertical" className="h-4" />
              <span>
                {charCount} {t("characterCount")}
              </span>
            </div>
            {timestampFormat !== "none" && <div className="text-xs">Ctrl/Cmd + T to insert timestamp</div>}
          </div>

          {/* Tauri Native FS Component */}
          <TauriNativeFS content={content} onContentChange={setContent} />
        </div>
      </main>

      {/* Hidden file input for import */}
      <input ref={fileInputRef} type="file" accept=".txt" onChange={handleFileImport} className="hidden" />

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("shareTitle")}</DialogTitle>
            <DialogDescription>{t("shareDescription")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Button
              onClick={() =>
                window.open(
                  `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
                  "_blank",
                )
              }
              className="w-full"
            >
              {t("shareOnTwitter")}
            </Button>
            <Button
              onClick={() =>
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank")
              }
              variant="outline"
              className="w-full"
            >
              {t("shareOnFacebook")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* About Dialog */}
      <Dialog open={showAboutDialog} onOpenChange={setShowAboutDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("aboutTitle")}</DialogTitle>
            <DialogDescription>{t("aboutDescription")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">{t("aboutFeatures")}</h4>
              <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                <li>• {t("aboutFeature1")}</li>
                <li>• {t("aboutFeature2")}</li>
                <li>• {t("aboutFeature3")}</li>
                <li>• {t("aboutFeature4")}</li>
                <li>• {t("aboutFeature5")}</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Dialog */}
      <Dialog open={showPrivacyDialog} onOpenChange={setShowPrivacyDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("privacyContent.title")}</DialogTitle>
            <DialogDescription>{t("privacyContent.subtitle")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">{t("privacyContent.localOnly")}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">{t("privacyContent.localOnlyDesc")}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t("privacyContent.noTracking")}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">{t("privacyContent.noTrackingDesc")}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t("privacyContent.noAccounts")}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">{t("privacyContent.noAccountsDesc")}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t("privacyContent.openSource")}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">{t("privacyContent.openSourceDesc")}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t("privacyContent.dataCollection")}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">{t("privacyContent.dataCollectionList")}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t("privacyContent.technical")}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">{t("privacyContent.technicalList")}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Terms Dialog */}
      <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("termsContent.title")}</DialogTitle>
            <DialogDescription>{t("termsContent.subtitle")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">{t("termsContent.acceptance")}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">{t("termsContent.service")}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t("termsContent.responsibilities")}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">{t("termsContent.responsibilitiesList")}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t("termsContent.limitations")}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">{t("termsContent.limitationsList")}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">{t("termsContent.termination")}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">{t("termsContent.contact")}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("contactTitle")}</DialogTitle>
            <DialogDescription>{t("contactDescription")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <Label htmlFor="contact-name">{t("contactName")}</Label>
              <Input
                id="contact-name"
                value={contactForm.name}
                onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder={t("contactNamePlaceholder")}
                required
              />
            </div>
            <div>
              <Label htmlFor="contact-email">{t("contactEmail")}</Label>
              <Input
                id="contact-email"
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder={t("contactEmailPlaceholder")}
                required
              />
            </div>
            <div>
              <Label htmlFor="contact-message">{t("contactMessage")}</Label>
              <Textarea
                id="contact-message"
                value={contactForm.message}
                onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                placeholder={t("contactMessagePlaceholder")}
                rows={4}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t("contactSending") : t("contactSend")}
            </Button>
            {submitStatus === "success" && <p className="text-sm text-green-600">{t("contactSuccess")}</p>}
            {submitStatus === "error" && <p className="text-sm text-red-600">{t("contactError")}</p>}
          </form>
          <div className="pt-4 border-t">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {t("contactDirectEmail")}{" "}
              <a href="mailto:overthinkr9@gmail.com" className="text-blue-600 hover:underline">
                overthinkr9@gmail.com
              </a>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
