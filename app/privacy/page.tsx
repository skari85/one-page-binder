import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Shield, Database, Eye, Lock, Code, Globe } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy - Qi",
  description: "Learn how Qi protects your privacy with local-only storage and no tracking.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
              <p className="text-muted-foreground">Your privacy is our top priority</p>
            </div>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to App
              </Button>
            </Link>
          </div>

          {/* Last Updated */}
          <div className="mb-8 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Last updated:</strong> January 2025
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Privacy Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Qi is designed with privacy as a fundamental principle, not an afterthought. We believe your writing
                  is personal and should remain completely under your control.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">✓ What We Do</h4>
                    <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                      <li>• Store everything locally on your device</li>
                      <li>• Provide a completely offline experience</li>
                      <li>• Keep our code open and transparent</li>
                      <li>• Respect your digital privacy rights</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">✗ What We Don't Do</h4>
                    <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                      <li>• Collect any personal information</li>
                      <li>• Track your usage or behavior</li>
                      <li>• Store your content on our servers</li>
                      <li>• Use cookies or analytics</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Collection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  Data Collection
                </CardTitle>
                <CardDescription>What information we collect (spoiler: none)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
                  <h4 className="font-semibold mb-2">Zero Data Collection Policy</h4>
                  <p className="text-sm">
                    Qi does not collect, store, or transmit any personal data, writing content, or usage information. We
                    have no servers, no databases, and no way to access your content.
                  </p>
                </div>

                <h4 className="font-semibold">Specifically, we do NOT collect:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span>
                      <strong>Personal Information:</strong> Names, email addresses, phone numbers, or any identifying
                      information
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span>
                      <strong>Writing Content:</strong> Your documents, notes, or any text you write in Qi
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span>
                      <strong>Usage Analytics:</strong> How you use the app, what features you access, or when you use
                      it
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span>
                      <strong>Device Information:</strong> Your device type, browser, operating system, or IP address
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span>
                      <strong>Location Data:</strong> Your geographic location or timezone
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Local Storage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="w-5 h-5 mr-2" />
                  Local Storage
                </CardTitle>
                <CardDescription>How your data is stored on your device</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  All your writing is stored locally in your browser using the Web Storage API (localStorage). This
                  means your content never leaves your device.
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">What's Stored Locally:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Your writing content</li>
                      <li>• App preferences (theme, language, timestamp format)</li>
                      <li>• PIN/lock settings (if you choose to set one)</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Important Notes:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Data is tied to your specific browser and device</li>
                      <li>• Clearing browser data will remove your content</li>
                      <li>• We recommend regular backups using the export feature</li>
                      <li>• No one else can access your locally stored data</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* No Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  No Tracking Policy
                </CardTitle>
                <CardDescription>We don't watch what you do</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Qi operates on a strict no-tracking policy. We don't use any analytics services, tracking pixels, or
                  monitoring tools.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">No Analytics:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• No Google Analytics</li>
                      <li>• No Facebook Pixel</li>
                      <li>• No usage tracking</li>
                      <li>• No performance monitoring</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">No Cookies:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• No tracking cookies</li>
                      <li>• No advertising cookies</li>
                      <li>• No session cookies</li>
                      <li>• No third-party cookies</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Open Source */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="w-5 h-5 mr-2" />
                  Open Source Transparency
                </CardTitle>
                <CardDescription>Verify our privacy claims yourself</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Qi is open source, which means you can inspect our code to verify that we do exactly what we say we do
                  - nothing more, nothing less.
                </p>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Transparency Benefits:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Anyone can review our source code</li>
                    <li>• Security researchers can audit our practices</li>
                    <li>• No hidden functionality or backdoors</li>
                    <li>• Community-driven development and oversight</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Third Parties */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Third-Party Services
                </CardTitle>
                <CardDescription>External services we use (if any)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
                  <h4 className="font-semibold mb-2">No Third-Party Integrations</h4>
                  <p className="text-sm">
                    Qi operates completely independently without any third-party services, APIs, or integrations that
                    could compromise your privacy.
                  </p>
                </div>

                <p className="text-sm text-muted-foreground">
                  We don't use CDNs, external fonts, analytics services, or any other third-party resources that could
                  potentially track you or access your data.
                </p>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card>
              <CardHeader>
                <CardTitle>Your Privacy Rights</CardTitle>
                <CardDescription>What you can do with your data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Since all your data is stored locally on your device, you have complete control over it:</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">You Can:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Export your data at any time</li>
                      <li>• Delete your data by clearing browser storage</li>
                      <li>• Move your data to another device</li>
                      <li>• Use the app completely offline</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">We Cannot:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Access your stored content</li>
                      <li>• Recover deleted data</li>
                      <li>• Share data with third parties</li>
                      <li>• Track your usage patterns</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Questions About Privacy?</CardTitle>
                <CardDescription>We're here to help</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  If you have any questions about this privacy policy or how Qi handles your data, please don't hesitate
                  to contact us.
                </p>
                <Button asChild>
                  <a href="mailto:overthinkr9@gmail.com">Contact Us</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
