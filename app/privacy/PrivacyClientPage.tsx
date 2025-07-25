"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function PrivacyClientPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to App
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Your privacy is important to us. This application stores all data locally on your device. We do not
              collect, store, or transmit any personal information or writing content to external servers.
            </p>
            <p>
              All your writing, settings, and preferences are stored in your browser's local storage. This means your
              data never leaves your device unless you explicitly export it.
            </p>
            <p>
              We use Vercel Analytics to understand how the application is used, but this only tracks page views and
              does not collect any personal information or content.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
