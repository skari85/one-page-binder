"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, Eye, EyeOff, QrCode } from "lucide-react"
import { QRCodeGenerator } from "./qr-code-generator"

interface PrivateShareProps {
  content: string
  quickNotes: string
  icon: React.ReactNode
}

// Simple XOR encryption for basic privacy
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
    return "Invalid encrypted data or key"
  }
}

export function PrivateShare({ content, quickNotes, icon }: PrivateShareProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [shareKey, setShareKey] = useState("")
  const [encryptedData, setEncryptedData] = useState("")
  const [decryptKey, setDecryptKey] = useState("")
  const [decryptedData, setDecryptedData] = useState("")
  const [showDecrypted, setShowDecrypted] = useState(false)
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt")
  const [showQR, setShowQR] = useState(false)

  const generateShareKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = ""
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setShareKey(result)
  }

  const handleEncrypt = () => {
    if (!shareKey) {
      generateShareKey()
      return
    }

    const dataToEncrypt = JSON.stringify({
      content,
      quickNotes,
      timestamp: Date.now(),
    })

    const encrypted = encrypt(dataToEncrypt, shareKey)
    setEncryptedData(encrypted)
  }

  const handleDecrypt = () => {
    if (!decryptKey || !encryptedData) return

    const decrypted = decrypt(encryptedData, decryptKey)
    try {
      const parsed = JSON.parse(decrypted)
      setDecryptedData(
        `Content:\n${parsed.content}\n\nQuick Notes:\n${parsed.quickNotes}\n\nShared: ${new Date(parsed.timestamp).toLocaleString()}`,
      )
    } catch {
      setDecryptedData(decrypted)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const reset = () => {
    setShareKey("")
    setEncryptedData("")
    setDecryptKey("")
    setDecryptedData("")
    setShowDecrypted(false)
    setShowQR(false)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) reset()
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          {icon}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Private Share</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Mode Toggle */}
          <div className="flex gap-2">
            <Button variant={mode === "encrypt" ? "default" : "outline"} onClick={() => setMode("encrypt")} size="sm">
              Encrypt & Share
            </Button>
            <Button variant={mode === "decrypt" ? "default" : "outline"} onClick={() => setMode("decrypt")} size="sm">
              Decrypt Received
            </Button>
          </div>

          {mode === "encrypt" ? (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Encrypt your content with a secure key for private sharing. No data is sent to any server.
              </div>

              {/* Generate/Set Key */}
              <div className="space-y-2">
                <Label>Encryption Key</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter custom key or generate one"
                    value={shareKey}
                    onChange={(e) => setShareKey(e.target.value)}
                  />
                  <Button onClick={generateShareKey} variant="outline">
                    Generate
                  </Button>
                </div>
              </div>

              {/* Encrypt Button */}
              <Button onClick={handleEncrypt} disabled={!shareKey} className="w-full">
                Encrypt Content
              </Button>

              {/* Encrypted Result */}
              {encryptedData && (
                <div className="space-y-3">
                  <Label>Encrypted Data (share this)</Label>
                  <Card>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Encrypted Content</span>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => copyToClipboard(encryptedData)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setShowQR(!showQR)}>
                            <QrCode className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Textarea value={encryptedData} readOnly className="font-mono text-xs h-24 resize-none" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Decryption Key (share separately)</span>
                        <Button size="sm" variant="ghost" onClick={() => copyToClipboard(shareKey)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input value={shareKey} readOnly className="font-mono" />
                    </CardContent>
                  </Card>

                  {showQR && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center space-y-3">
                          <Label>QR Code for Encrypted Data</Label>
                          <QRCodeGenerator data={encryptedData} />
                          <p className="text-xs text-muted-foreground">
                            Scan this QR code to get the encrypted data. The key must be shared separately.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded">
                    <strong>Security Note:</strong> Share the encrypted data and key through different channels for
                    better security. The encryption is basic and suitable for casual privacy, not sensitive data.
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Decrypt content that was shared with you using the encryption key.
              </div>

              {/* Encrypted Data Input */}
              <div className="space-y-2">
                <Label>Encrypted Data</Label>
                <Textarea
                  placeholder="Paste the encrypted data here"
                  value={encryptedData}
                  onChange={(e) => setEncryptedData(e.target.value)}
                  className="font-mono text-xs h-24"
                />
              </div>

              {/* Decryption Key Input */}
              <div className="space-y-2">
                <Label>Decryption Key</Label>
                <Input
                  placeholder="Enter the decryption key"
                  value={decryptKey}
                  onChange={(e) => setDecryptKey(e.target.value)}
                  className="font-mono"
                />
              </div>

              {/* Decrypt Button */}
              <Button onClick={handleDecrypt} disabled={!encryptedData || !decryptKey} className="w-full">
                Decrypt Content
              </Button>

              {/* Decrypted Result */}
              {decryptedData && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Decrypted Content</Label>
                    <Button size="sm" variant="ghost" onClick={() => setShowDecrypted(!showDecrypted)}>
                      {showDecrypted ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Card>
                    <CardContent className="p-3">
                      <Textarea
                        value={showDecrypted ? decryptedData : "••••••••••••••••••••"}
                        readOnly
                        className="font-mono text-sm h-48 resize-none"
                      />
                    </CardContent>
                  </Card>
                  <Button onClick={() => copyToClipboard(decryptedData)} variant="outline" className="w-full">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Decrypted Content
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
