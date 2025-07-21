"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Share, Copy, Download } from "lucide-react"
import { QRCodeGenerator } from "./qr-code-generator"

interface PrivateShareProps {
  content: string
  quickNotes: string
}

// Simple XOR encryption (for demo - use proper crypto in production)
const encrypt = (text: string, password: string): string => {
  let result = ""
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ password.charCodeAt(i % password.length))
  }
  return btoa(result) // Base64 encode
}

const decrypt = (encryptedText: string, password: string): string => {
  try {
    const decoded = atob(encryptedText) // Base64 decode
    let result = ""
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(decoded.charCodeAt(i) ^ password.charCodeAt(i % password.length))
    }
    return result
  } catch {
    return "Invalid encrypted data or password"
  }
}

export function PrivateShare({ content, quickNotes }: PrivateShareProps) {
  const [shareMode, setShareMode] = useState<"encrypt" | "decrypt">("encrypt")
  const [contentType, setContentType] = useState<"main" | "notes">("main")
  const [password, setPassword] = useState("")
  const [encryptedData, setEncryptedData] = useState("")
  const [decryptedData, setDecryptedData] = useState("")
  const [inputData, setInputData] = useState("")

  const handleEncrypt = () => {
    if (!password) return

    const dataToEncrypt = contentType === "main" ? content : quickNotes
    const encrypted = encrypt(dataToEncrypt, password)
    setEncryptedData(encrypted)
  }

  const handleDecrypt = () => {
    if (!password || !inputData) return

    const decrypted = decrypt(inputData, password)
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Share className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Private Share</DialogTitle>
        </DialogHeader>

        <Tabs value={shareMode} onValueChange={(value) => setShareMode(value as "encrypt" | "decrypt")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="encrypt">Encrypt & Share</TabsTrigger>
            <TabsTrigger value="decrypt">Decrypt & Receive</TabsTrigger>
          </TabsList>

          <TabsContent value="encrypt" className="space-y-4">
            <div className="space-y-2">
              <Label>Content to Share</Label>
              <Select value={contentType} onValueChange={(value: "main" | "notes") => setContentType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">Main Content</SelectItem>
                  <SelectItem value="notes">Quick Notes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Encryption Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password for encryption"
              />
            </div>

            <Button onClick={handleEncrypt} disabled={!password} className="w-full">
              Encrypt Content
            </Button>

            {encryptedData && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Encrypted Data</Label>
                  <Textarea value={encryptedData} readOnly className="h-32 font-mono text-xs" />
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(encryptedData)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadEncrypted}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>QR Code</Label>
                  <QRCodeGenerator data={encryptedData} />
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Security Note:</strong> Share the encrypted data and password separately for maximum
                    security. The recipient needs both to decrypt your content.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="decrypt" className="space-y-4">
            <div className="space-y-2">
              <Label>Encrypted Data</Label>
              <Textarea
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                placeholder="Paste encrypted data here or scan QR code"
                className="h-32 font-mono text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label>Decryption Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password for decryption"
              />
            </div>

            <Button onClick={handleDecrypt} disabled={!password || !inputData} className="w-full">
              Decrypt Content
            </Button>

            {decryptedData && (
              <div className="space-y-2">
                <Label>Decrypted Content</Label>
                <Textarea value={decryptedData} readOnly className="h-48" />
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(decryptedData)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Decrypted Content
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
