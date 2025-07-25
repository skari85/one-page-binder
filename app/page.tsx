"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import {
  Home,
  Download,
  Upload,
  Share2,
  Printer,
  Moon,
  Sun,
  BookOpen,
  FileText,
  Clock,
  Lock,
  Unlock,
  Languages,
  Eye,
  EyeOff,
  Brain,
  Lightbulb,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useLanguage } from "@/lib/language"
import { translations } from "@/lib/translations"
import { exportToDocx } from "@/lib/docx-export"
import { OfflineIndicator } from "@/components/offline-indicator"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { PWAUpdatePrompt } from "@/components/pwa-update-prompt"
import { TauriNativeFS } from "@/components/tauri-native-fs"
import { track } from "@vercel/analytics"

// Focus exercises data
const focusExercises = [
  {
    id: "grounding",
    prompt: {
      en: "Right now I notice...",
      zh: "现在我注意到...",
    },
    description: {
      en: "Ground yourself in the present moment",
      zh: "让自己专注于当下",
    },
  },
  {
    id: "today",
    prompt: {
      en: "Write one sentence that could only happen today.",
      zh: "写一句只有今天才会发生的话。",
    },
    description: {
      en: "Anchor yourself in time and memory",
      zh: "将自己锚定在时间和记忆中",
    },
  },
  {
    id: "perspective",
    prompt: {
      en: "Choose an object near you. What has it seen today?",
      zh: "选择你身边的一个物体。它今天看到了什么？",
    },
    description: {
      en: "Shift perspective and spark imagination",
      zh: "转换视角，激发想象力",
    },
  },
  {
    id: "metaphor",
    prompt: {
      en: "Write a sentence where you swap a feeling with a color.",
      zh: "写一句话，用颜色来替换一种感觉。",
    },
    description: {
      en: "Train metaphorical thinking",
      zh: "训练隐喻思维",
    },
  },
  {
    id: "constraint",
    prompt: {
      en: "Tell me something true in exactly ten words.",
      zh: "用恰好十个字告诉我一些真实的事情。",
    },
    description: {
      en: "Use constraints to drive flow",
      zh: "用限制来驱动思维流动",
    },
  },
]

export default function OnePageBinder() {
  const [isLandingPage, setIsLandingPage] = useState(true)
  const [content, setContent] = useState("")
  const [isBookView, setIsBookView] = useState(false)
  const [pageSize, setPageSize] = useState("a4")
  const [timestampFormat, setTimestampFormat] = useState("locale")
  const [customTimestampFormat, setCustomTimestampFormat] = useState("YYYY-MM-DD HH:mm:ss")
  const [isLocked, setIsLocked] = useState(false)
  const [pin, setPin] = useState("")
  const [enteredPin, setEnteredPin] = useState("")
  const [showPin, setShowPin] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [currentExercise, setCurrentExercise] = useState(0)
  const [showExerciseCard, setShowExerciseCard] = useState(false)

  const { theme, setTheme } = useTheme()
  const { language, setLanguage } = useLanguage()
  const t = translations[language]
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-save functionality
  useEffect(() => {
    if (content && !isLandingPage) {
      const timer = setTimeout(() => {
        localStorage.setItem("one-page-binder-content", content)
        setLastSaved(new Date())
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [content, isLandingPage])

  // Load saved content
  useEffect(() => {
    const saved = localStorage.getItem("one-page-binder-content")
    if (saved) {
      setContent(saved)
    }

    // Set random exercise on load
    setCurrentExercise(Math.floor(Math.random() * focusExercises.length))
  }, [])

  // Show exercise card when editor is empty
  useEffect(() => {
    setShowExerciseCard(!isLandingPage && content.trim() === "")
  }, [content, isLandingPage])

  const handleEnterApp = () => {
    setIsLandingPage(false)
    track("enter_app")
  }

  const handleGoHome = () => {
    setIsLandingPage(true)
    track("go_home")
  }

  const handleExport = async (format: string) => {
    if (!content.trim()) {
      toast.error(t.export.noContent)
      return
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const filename = `one-page-binder-${timestamp}`

    try {
      switch (format) {
        case "txt":
          const txtBlob = new Blob([content], { type: "text/plain" })
          const txtUrl = URL.createObjectURL(txtBlob)
          const txtLink = document.createElement("a")
          txtLink.href = txtUrl
          txtLink.download = `${filename}.txt`
          txtLink.click()
          URL.revokeObjectURL(txtUrl)
          break

        case "docx":
          await exportToDocx(content, `${filename}.docx`, {
            title: "One Page Binder Document",
            author: "One Page Binder",
            includeTimestamp: true,
            timestampFormat: timestampFormat as any,
            customTimestampFormat,
          })
          break

        case "pdf":
          window.print()
          break

        case "html":
          const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <title>One Page Binder Document</title>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
                .timestamp { color: #666; font-style: italic; margin-bottom: 20px; }
                .content { white-space: pre-wrap; }
              </style>
            </head>
            <body>
              <div class="timestamp">${new Date().toLocaleString()}</div>
              <div class="content">${content.replace(/\n/g, "<br>")}</div>
            </body>
            </html>
          `
          const htmlBlob = new Blob([htmlContent], { type: "text/html" })
          const htmlUrl = URL.createObjectURL(htmlBlob)
          const htmlLink = document.createElement("a")
          htmlLink.href = htmlUrl
          htmlLink.download = `${filename}.html`
          htmlLink.click()
          URL.revokeObjectURL(htmlUrl)
          break
      }
      toast.success(t.export.success)
      track("export", { format })
    } catch (error) {
      toast.error(t.export.error)
    }
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      setContent(text)
      toast.success(t.import.success)
      track("import")
    }
    reader.readAsText(file)
  }

  const handleShare = async (platform: string) => {
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
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400")
      track("share", { platform })
    }
  }

  const handleLock = () => {
    if (!pin) {
      toast.error(t.pin.setPinFirst)
      return
    }
    setIsLocked(true)
    track("lock")
  }

  const handleUnlock = () => {
    if (enteredPin === pin) {
      setIsLocked(false)
      setEnteredPin("")
      toast.success(t.pin.unlocked)
      track("unlock")
    } else {
      toast.error(t.pin.incorrect)
    }
  }

  const useExercise = (exercise: (typeof focusExercises)[0]) => {
    const prompt = exercise.prompt[language]
    setContent((prev) => (prev ? `${prev}\n\n${prompt} ` : `${prompt} `))
    setShowExerciseCard(false)
    textareaRef.current?.focus()
    track("use_exercise", { exercise: exercise.id })
  }

  const getPageSizeClass = () => {
    switch (pageSize) {
      case "letter":
        return "max-w-[8.5in] min-h-[11in]"
      case "a5":
        return "max-w-[5.8in] min-h-[8.3in]"
      default:
        return "max-w-[8.3in] min-h-[11.7in]" // A4
    }
  }

  const handleExerciseClick = (exercise: (typeof focusExercises)[0]) => {
    useExercise(exercise)
  }

  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img src="/qilogo.png" alt="Logo" className="w-8 h-8" />
              <span className="font-semibold text-gray-900 dark:text-white">One Page Binder</span>
            </div>

            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Languages className="w-4 h-4 mr-2" />
                    {language === "en" ? "English" : "中文"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setLanguage("en")}>English</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage("zh")}>中文</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-2xl mx-auto">
            <img src="/qilogo.png" alt="One Page Binder" className="w-24 h-24 mx-auto mb-8" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t.landing.title}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">{t.landing.subtitle}</p>
            <Button onClick={handleEnterApp} size="lg" className="px-8 py-3 text-lg">
              {t.landing.enter}
            </Button>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-700 px-4 py-6">
          <div className="max-w-6xl mx-auto flex justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
            <Dialog>
              <DialogTrigger asChild>
                <button className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  {t.footer.privacy}
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{t.privacy.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm">
                  <p>{t.privacy.intro}</p>
                  <div>
                    <h3 className="font-semibold mb-2">{t.privacy.dataCollection.title}</h3>
                    <p>{t.privacy.dataCollection.content}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{t.privacy.dataStorage.title}</h3>
                    <p>{t.privacy.dataStorage.content}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{t.privacy.dataSharing.title}</h3>
                    <p>{t.privacy.dataSharing.content}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{t.privacy.userRights.title}</h3>
                    <p>{t.privacy.userRights.content}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{t.privacy.contact.title}</h3>
                    <p>{t.privacy.contact.content}</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <button className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  {t.footer.terms}
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{t.terms.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm">
                  <p>{t.terms.intro}</p>
                  <div>
                    <h3 className="font-semibold mb-2">{t.terms.acceptance.title}</h3>
                    <p>{t.terms.acceptance.content}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{t.terms.serviceDescription.title}</h3>
                    <p>{t.terms.serviceDescription.content}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{t.terms.userResponsibilities.title}</h3>
                    <p>{t.terms.userResponsibilities.content}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{t.terms.limitations.title}</h3>
                    <p>{t.terms.limitations.content}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{t.terms.changes.title}</h3>
                    <p>{t.terms.changes.content}</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <button className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  {t.footer.contact}
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t.contact.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p>{t.contact.intro}</p>
                  <div className="space-y-2">
                    <p>
                      <strong>{t.contact.email.label}:</strong> {t.contact.email.value}
                    </p>
                    <p>
                      <strong>{t.contact.website.label}:</strong> {t.contact.website.value}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t.contact.response}</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </footer>

        <OfflineIndicator />
        <PWAInstallPrompt />
        <PWAUpdatePrompt />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header Toolbar */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={handleGoHome} className="flex items-center space-x-1">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">{t.toolbar.home}</span>
            </Button>

            <Separator orientation="vertical" className="h-6" />

            <div className="flex items-center space-x-1">
              <Button variant={isBookView ? "default" : "ghost"} size="sm" onClick={() => setIsBookView(!isBookView)}>
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">{t.toolbar.bookView}</span>
              </Button>

              <Select value={pageSize} onValueChange={setPageSize}>
                <SelectTrigger className="w-20 h-8">
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

          <div className="flex items-center space-x-2">
            {/* Focus Exercises Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Brain className="w-4 h-4" />
                  <span className="hidden sm:inline ml-1">{t.focus.title}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80">
                <div className="p-2">
                  <h4 className="font-medium mb-2">{t.focus.title}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{t.focus.subtitle}</p>
                </div>
                <DropdownMenuSeparator />
                {focusExercises.map((exercise, index) => (
                  <DropdownMenuItem
                    key={exercise.id}
                    onClick={() => handleExerciseClick(exercise)}
                    className="flex-col items-start p-3 cursor-pointer"
                  >
                    <div className="font-medium text-sm mb-1">{exercise.prompt[language]}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{exercise.description[language]}</div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline ml-1">{t.toolbar.export}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport("txt")}>
                  <FileText className="w-4 h-4 mr-2" />
                  {t.export.formats.txt}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("docx")}>
                  <FileText className="w-4 h-4 mr-2" />
                  {t.export.formats.docx}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("pdf")}>
                  <Printer className="w-4 h-4 mr-2" />
                  {t.export.formats.pdf}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("html")}>
                  <FileText className="w-4 h-4 mr-2" />
                  {t.export.formats.html}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">{t.toolbar.import}</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline ml-1">{t.toolbar.share}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleShare("twitter")}>Twitter</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare("facebook")}>Facebook</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare("linkedin")}>LinkedIn</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="sm" onClick={() => window.print()}>
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">{t.toolbar.print}</span>
            </Button>

            <Separator orientation="vertical" className="h-6" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Clock className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <div className="p-3 space-y-3">
                  <div>
                    <Label className="text-xs">{t.timestamp.format}</Label>
                    <Select value={timestampFormat} onValueChange={setTimestampFormat}>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="iso">{t.timestamp.formats.iso}</SelectItem>
                        <SelectItem value="locale">{t.timestamp.formats.locale}</SelectItem>
                        <SelectItem value="custom">{t.timestamp.formats.custom}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {timestampFormat === "custom" && (
                    <div>
                      <Label className="text-xs">{t.timestamp.customFormat}</Label>
                      <Input
                        value={customTimestampFormat}
                        onChange={(e) => setCustomTimestampFormat(e.target.value)}
                        className="mt-1"
                        placeholder="YYYY-MM-DD HH:mm:ss"
                      />
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{isLocked ? t.pin.unlock : t.pin.setup}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {!isLocked ? (
                    <>
                      <div>
                        <Label>{t.pin.setPin}</Label>
                        <div className="relative">
                          <Input
                            type={showPin ? "text" : "password"}
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPin(!showPin)}
                          >
                            {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                      <Button onClick={handleLock} disabled={!pin}>
                        {t.pin.lock}
                      </Button>
                    </>
                  ) : (
                    <>
                      <div>
                        <Label>{t.pin.enterPin}</Label>
                        <Input
                          type="password"
                          value={enteredPin}
                          onChange={(e) => setEnteredPin(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleUnlock()}
                        />
                      </div>
                      <Button onClick={handleUnlock}>{t.pin.unlock}</Button>
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Languages className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setLanguage("en")}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("zh")}>中文</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {lastSaved && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
            {t.autosave.saved}: {lastSaved.toLocaleTimeString()}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {isLocked ? (
            <div className="flex items-center justify-center h-96">
              <Card className="p-8 text-center">
                <Lock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h2 className="text-xl font-semibold mb-2">{t.pin.locked}</h2>
                <p className="text-gray-600 dark:text-gray-400">{t.pin.lockedMessage}</p>
              </Card>
            </div>
          ) : (
            <div className={`mx-auto ${getPageSizeClass()}`}>
              {/* Focus Exercise Card */}
              {showExerciseCard && (
                <Card className="mb-4 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">{t.focus.getStarted}</h3>
                        <button
                          onClick={() => handleExerciseClick(focusExercises[currentExercise])}
                          className="text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100 transition-colors cursor-pointer text-left"
                        >
                          <div className="font-medium mb-1">{focusExercises[currentExercise].prompt[language]}</div>
                          <div className="text-sm text-blue-600 dark:text-blue-400">
                            {focusExercises[currentExercise].description[language]}
                          </div>
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className={`${isBookView ? "shadow-lg" : "shadow-sm"} transition-shadow`}>
                <CardContent className="p-0">
                  <Textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={t.editor.placeholder}
                    className="min-h-[600px] border-0 resize-none focus:ring-0 text-base leading-relaxed"
                    style={{
                      fontFamily: language === "zh" ? "system-ui, -apple-system, sans-serif" : "inherit",
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept=".txt,.md,.html" onChange={handleImport} className="hidden" />

      <OfflineIndicator />
      <PWAInstallPrompt />
      <PWAUpdatePrompt />
      <TauriNativeFS />
    </div>
  )
}
