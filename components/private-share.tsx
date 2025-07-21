"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, Copy, Download, QrCode, Lock, Unlock } from "lucide-react"
import { QRCodeGenerator } from "./qr-code-generator"

interface PrivateShareProps {
  content: string
  quickNotes: string
}

export function PrivateShare({ content, quickNotes }: PrivateShareProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [encryptedData, setEncryptedData] = useState("")
  const [decryptedData, setDecryptedData] = useState("")
  const [decryptPassword, setDecryptPassword] = useState("")
  const [encryptedInput, setEncryptedInput] = useState("")
  const [shareMode, setShareMode] = useState<"content" | "notes">("content")

  // Simple XOR encryption (for demo - use proper crypto in production)
  const encrypt = (text: string, key: string): string => {
    let result = ""
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length))
    }
    return btoa(result) // Base64 encode
  }

  const decrypt = (encryptedText: string, key: string): string => {
    try {
      const decoded = atob(encryptedText) // Base64 decode
      let result = ""
      for (let i = 0; i < decoded.length; i++) {
        result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length))
      }
      return result
    } catch {
      return "Invalid encrypted data or password"
    }
  }

  const handleEncrypt = () => {
    if (!password) return
    const dataToEncrypt = shareMode === "content" ? content : quickNotes
    const encrypted = encrypt(dataToEncrypt, password)
    setEncryptedData(encrypted)
  }

  const handleDecrypt = () => {
    if (!decryptPassword || !encryptedInput) return
    const decrypted = decrypt(encryptedInput, decryptPassword)
    setDecryptedData(decrypted)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadEncrypted = () => {
    if (!encryptedData) return
    const blob = new Blob([encryptedData], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `qi-encrypted-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" title="Private Share">
          <Send className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Private Share
          </DialogTitle>
          <DialogDescription>
            Share your content privately using encryption and QR codes. No external services required.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="encrypt" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="encrypt">Encrypt & Share</TabsTrigger>
            <TabsTrigger value="decrypt">Decrypt & Receive</TabsTrigger>
          </TabsList>

          <TabsContent value="encrypt" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Encrypt Your Content</CardTitle>
                <CardDescription>
                  Choose what to share and set a password. Share the encrypted data and password separately.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>What to share</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={shareMode === "content" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShareMode("content")}
                    >
                      Main Content ({content.length} chars)
                    </Button>
                    <Button
                      variant={shareMode === "notes" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShareMode("notes")}
                    >
                      Quick Notes ({quickNotes.length} chars)
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Encryption Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <Button onClick={handleEncrypt} disabled={!password} className="w-full">
                  <Lock className="h-4 w-4 mr-2" />
                  Encrypt Content
                </Button>

                {encryptedData && (
                  <div className="space-y-3 p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Encrypted Data</Label>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => copyToClipboard(encryptedData)}>
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                        <Button size="sm" variant="outline" onClick={downloadEncrypted}>
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                    <Textarea value={encryptedData} readOnly className="font-mono text-xs" rows={4} />

                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <QrCode className="h-4 w-4" />
                        QR Code
                      </Label>
                      <QRCodeGenerator data={encryptedData} />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="decrypt" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Decrypt Received Content</CardTitle>
                <CardDescription>Paste the encrypted data and enter the password to decrypt.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="encrypted-input">Encrypted Data</Label>
                  <Textarea
                    id="encrypted-input"
                    placeholder="Paste encrypted data here..."
                    value={encryptedInput}
                    onChange={(e) => setEncryptedInput(e.target.value)}
                    className="font-mono text-xs"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="decrypt-password">Password</Label>
                  <Input
                    id="decrypt-password"
                    type="password"
                    placeholder="Enter password"
                    value={decryptPassword}
                    onChange={(e) => setDecryptPassword(e.target.value)}
                  />
                </div>

                <Button onClick={handleDecrypt} disabled={!decryptPassword || !encryptedInput} className="w-full">
                  <Unlock className="h-4 w-4 mr-2" />
                  Decrypt Content
                </Button>

                {decryptedData && (
                  <div className="space-y-2 p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Decrypted Content</Label>
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(decryptedData)}>
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <Textarea value={decryptedData} readOnly className="font-mono text-sm" rows={8} />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
