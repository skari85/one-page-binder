"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Download, FileText, Globe, Info, Shield, FileCheck, Mail, Send } from "lucide-react"
import { saveAs } from "file-saver"
import { Document, Packer, Paragraph, TextRun } from "docx"
import { useLanguage } from "@/lib/language"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function Home() {
  const [content, setContent] = useState("")
  const [timestampFormat, setTimestampFormat] = useState("none")
  const [isClient, setIsClient] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { language, setLanguage, t } = useLanguage()

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Load content from localStorage
    const savedContent = localStorage.getItem("qi-content")
    if (savedContent) {
      setContent(savedContent)
    }

    // Load timestamp format
    const savedTimestampFormat = localStorage.getItem("qi-timestamp-format")
    if (savedTimestampFormat) {
      setTimestampFormat(savedTimestampFormat)
    }
  }, [])

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("qi-content", content)
    }
  }, [content, isClient])

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("qi-timestamp-format", timestampFormat)
    }
  }, [timestampFormat, isClient])

  const getWordCount = (text: string) => {
    return text.trim() === "" ? 0 : text.trim().split(/\s+/).length
  }

  const getCharacterCount = (text: string) => {
    return text.length
  }

  const addTimestamp = () => {
    if (timestampFormat === "none") return ""

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
      default:
        return ""
    }

    return `\n\n--- ${timestamp} ---\n`
  }

  const exportAsText = () => {
    const contentWithTimestamp = content + addTimestamp()
    const blob = new Blob([contentWithTimestamp], { type: "text/plain;charset=utf-8" })
    saveAs(blob, "qi-document.txt")
  }

  const exportAsDocx = async () => {
    const contentWithTimestamp = content + addTimestamp()
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: contentWithTimestamp.split("\n").map(
            (line) =>
              new Paragraph({
                children: [new TextRun(line || " ")],
              }),
          ),
        },
      ],
    })

    const blob = await Packer.toBlob(doc)
    saveAs(blob, "qi-document.docx")
  }

  const exportAsHtml = () => {
    const contentWithTimestamp = content + addTimestamp()
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Qi Document</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        pre { white-space: pre-wrap; word-wrap: break-word; }
    </style>
</head>
<body>
    <pre>${contentWithTimestamp}</pre>
</body>
</html>`
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" })
    saveAs(blob, "qi-document.html")
  }

  const exportAsPdf = () => {
    // For PDF export, we'll create an HTML version and let the user print to PDF
    const contentWithTimestamp = content + addTimestamp()
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Qi Document</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        pre { white-space: pre-wrap; word-wrap: break-word; }
        @media print { body { margin: 0; } }
    </style>
</head>
<body>
    <pre>${contentWithTimestamp}</pre>
    <script>window.print();</script>
</body>
</html>`
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    window.open(url, "_blank")
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate form submission - in a real app, you'd send this to your backend
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSubmitSuccess(true)
      setContactForm({ name: "", email: "", message: "" })
      toast.success(t("contactSuccess"))
    } catch (error) {
      toast.error(t("contactError"))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isClient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">气</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">{t("title")}</h1>
                <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Globe className="h-4 w-4 mr-2" />
                  {t("language")}
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
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">
                  {t("title")} - {t("subtitle")}
                </CardTitle>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <Badge variant="secondary">
                      {getWordCount(content)} {t("wordCount")}
                    </Badge>
                    <Badge variant="outline">
                      {getCharacterCount(content)} {t("characterCount")}
                    </Badge>
                  </div>

                  {/* Export Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        {t("export")}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>{t("exportAs")}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={exportAsText}>
                        <FileText className="h-4 w-4 mr-2" />
                        <div>
                          <div>{t("exportTxt")}</div>
                          <div className="text-xs text-muted-foreground">{t("exportTxtDesc")}</div>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={exportAsDocx}>
                        <FileText className="h-4 w-4 mr-2" />
                        <div>
                          <div>{t("exportDocx")}</div>
                          <div className="text-xs text-muted-foreground">{t("exportDocxDesc")}</div>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={exportAsPdf}>
                        <FileText className="h-4 w-4 mr-2" />
                        <div>
                          <div>{t("exportPdf")}</div>
                          <div className="text-xs text-muted-foreground">{t("exportPdfDesc")}</div>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={exportAsHtml}>
                        <FileText className="h-4 w-4 mr-2" />
                        <div>
                          <div>{t("exportHtml")}</div>
                          <div className="text-xs text-muted-foreground">{t("exportHtmlDesc")}</div>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>{t("timestampFormat")}</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => setTimestampFormat("none")}>
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${timestampFormat === "none" ? "bg-primary" : "bg-muted"}`}
                          />
                          {t("timestampNone")}
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTimestampFormat("date")}>
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${timestampFormat === "date" ? "bg-primary" : "bg-muted"}`}
                          />
                          {t("timestampDate")}
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTimestampFormat("time")}>
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${timestampFormat === "time" ? "bg-primary" : "bg-muted"}`}
                          />
                          {t("timestampTime")}
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTimestampFormat("datetime")}>
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${timestampFormat === "datetime" ? "bg-primary" : "bg-muted"}`}
                          />
                          {t("timestampDateTime")}
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t("placeholder")}
                className="min-h-[60vh] resize-none border-0 focus-visible:ring-0 text-base leading-relaxed"
                style={{ fontSize: "16px" }}
              />
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">气</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {t("title")} - {t("subtitle")}
              </span>
            </div>

            <div className="flex items-center space-x-6">
              {/* About Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Info className="h-4 w-4 mr-2" />
                    {t("about")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{t("aboutTitle")}</DialogTitle>
                    <DialogDescription>{t("aboutDescription")}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">{t("aboutFeatures")}</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Shield className="h-4 w-4 mr-2" />
                    {t("privacy")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{t("privacyTitle")}</DialogTitle>
                    <DialogDescription>{t("privacyIntro")}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">{t("privacyDataCollection")}</h4>
                      <p className="text-sm text-muted-foreground">{t("privacyDataCollectionText")}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">{t("privacyLocalStorage")}</h4>
                      <p className="text-sm text-muted-foreground">{t("privacyLocalStorageText")}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">{t("privacyNoTracking")}</h4>
                      <p className="text-sm text-muted-foreground">{t("privacyNoTrackingText")}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">{t("privacyOpenSource")}</h4>
                      <p className="text-sm text-muted-foreground">{t("privacyOpenSourceText")}</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Terms Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <FileCheck className="h-4 w-4 mr-2" />
                    {t("terms")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{t("termsTitle")}</DialogTitle>
                    <DialogDescription>{t("termsIntro")}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">{t("termsUse")}</h4>
                      <p className="text-sm text-muted-foreground">{t("termsUseText")}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">{t("termsData")}</h4>
                      <p className="text-sm text-muted-foreground">{t("termsDataText")}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">{t("termsLimitations")}</h4>
                      <p className="text-sm text-muted-foreground">{t("termsLimitationsText")}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">{t("termsContact")}</h4>
                      <p className="text-sm text-muted-foreground">{t("termsContactText")}</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Contact Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    {t("contact")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{t("contactTitle")}</DialogTitle>
                    <DialogDescription>{t("contactDescription")}</DialogDescription>
                  </DialogHeader>

                  {submitSuccess ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="h-6 w-6 text-green-600" />
                      </div>
                      <p className="text-green-600 font-medium">{t("contactSuccess")}</p>
                      <Button variant="outline" className="mt-4 bg-transparent" onClick={() => setSubmitSuccess(false)}>
                        {t("close")}
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">{t("contactName")}</Label>
                        <Input
                          id="name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder={t("contactNamePlaceholder")}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">{t("contactEmail")}</Label>
                        <Input
                          id="email"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder={t("contactEmailPlaceholder")}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="message">{t("contactMessage")}</Label>
                        <Textarea
                          id="message"
                          value={contactForm.message}
                          onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                          placeholder={t("contactMessagePlaceholder")}
                          rows={4}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {t("contactSending")}
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            {t("contactSend")}
                          </>
                        )}
                      </Button>

                      <Separator />

                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">{t("contactDirectEmail")}</p>
                        <a href="mailto:overthinkr9@gmail.com" className="text-sm text-primary hover:underline">
                          overthinkr9@gmail.com
                        </a>
                      </div>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
