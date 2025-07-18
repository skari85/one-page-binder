"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Key, Copy, Eye, EyeOff, Download } from "lucide-react"
import { QRCodeGenerator } from "./qr-code-generator"

interface PrivateShareProps {
  isOpen: boolean
  onClose: () => void
  content: string
  quickNotes: string
}

export function PrivateShare({ isOpen, onClose, content, quickNotes }: PrivateShareProps) {
  const [password, setPassword] = useState("")
  const [encryptedData, setEncryptedData] = useState("")
  const [decryptedData, setDecryptedData] = useState("")
  const [decryptPassword, setDecryptPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [shareMode, setShareMode] = useState<"content" | "notes">("content")
  const [encryptedInput, setEncryptedInput] = useState("")

  // Simple XOR encryption (for demo - use proper crypto in production)
  const encrypt = (text: string, key: string): string => {
    if (!text || !key) return ""
    let result = ""
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length))
    }
    return btoa(result) // Base64 encode
  }

  const decrypt = (encryptedText: string, key: string): string => {
    if (!encryptedText || !key) return ""
    try {
      const decoded = atob(encryptedText) // Base64 decode
      let result = ""
      for (let i = 0; i < decoded.length; i++) {
        result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length))
      }
      return result
    } catch (error) {
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
    a.download = `encrypted-${shareMode}-${new Date().toISOString().split("T")[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const reset = () => {
    setPassword("")
    setEncryptedData("")
    setDecryptedData("")
    setDecryptPassword("")
    setEncryptedInput("")
  }

  useEffect(() => {
    if (!isOpen) {
      reset()
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Key className="w-5 h-5 mr-2" />
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
            <div className="space-y-4">
              <div>
                <Label>What to share:</Label>
                <Tabs value={shareMode} onValueChange={(value) => setShareMode(value as "content" | "notes")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="content">Main Content</TabsTrigger>
                    <TabsTrigger value="notes">Quick Notes</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div>
                <Label htmlFor="password">Encryption Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter a strong password"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <Button onClick={handleEncrypt} disabled={!password} className="w-full">
                <Key className="w-4 h-4 mr-2" />
                Encrypt {shareMode === "content" ? "Content" : "Notes"}
              </Button>

              {encryptedData && (
                <div className="space-y-4">
                  <div>
                    <Label>Encrypted Data (share this):</Label>
                    <div className="relative">
                      <Textarea value={encryptedData} readOnly className="font-mono text-xs" rows={4} />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2"
                        onClick={() => copyToClipboard(encryptedData)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={downloadEncrypted} variant="outline" className="flex-1 bg-transparent">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button onClick={() => copyToClipboard(encryptedData)} variant="outline" className="flex-1">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>

                  <div>
                    <Label>QR Code (for easy sharing):</Label>
                    <div className="flex justify-center p-4 bg-white rounded-lg">
                      <QRCodeGenerator data={encryptedData} size={200} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Scan this QR code to get the encrypted data. The password must be shared separately.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="decrypt" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="encrypted-input">Encrypted Data</Label>
                <Textarea
                  id="encrypted-input"
                  value={encryptedInput}
                  onChange={(e) => setEncryptedInput(e.target.value)}
                  placeholder="Paste the encrypted data here or scan QR code"
                  className="font-mono text-xs"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="decrypt-password">Decryption Password</Label>
                <Input
                  id="decrypt-password"
                  type="password"
                  value={decryptPassword}
                  onChange={(e) => setDecryptPassword(e.target.value)}
                  placeholder="Enter the password"
                />
              </div>

              <Button onClick={handleDecrypt} disabled={!decryptPassword || !encryptedInput} className="w-full">
                <Key className="w-4 h-4 mr-2" />
                Decrypt Data
              </Button>

              {decryptedData && (
                <div>
                  <Label>Decrypted Content:</Label>
                  <Textarea value={decryptedData} readOnly className="font-mono" rows={8} />
                  <Button onClick={() => copyToClipboard(decryptedData)} variant="outline" className="w-full mt-2">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Decrypted Content
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
