import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Scale, FileText, Shield, AlertTriangle, Mail, Gavel } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service - Qi",
  description: "Terms of service for using Qi, the privacy-focused writing app.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
              <p className="text-muted-foreground">Simple terms for using Qi</p>
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
            {/* Introduction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Scale className="w-5 h-5 mr-2" />
                  Agreement to Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  By using Qi, you agree to these terms of service. These terms are designed to be simple and fair,
                  reflecting our commitment to providing a straightforward, privacy-focused writing experience.
                </p>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm">
                    <strong>In simple terms:</strong> Qi is a free writing app that stores everything locally on your
                    device. Use it responsibly, back up your important work, and understand that we can't recover data
                    that's lost locally.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Service Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Description of Service
                </CardTitle>
                <CardDescription>What Qi provides</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Qi is a web-based writing application that provides:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>A distraction-free writing environment</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Local storage of your content (no cloud storage)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Export functionality for your documents</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Privacy-focused features with no tracking</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Offline functionality</span>
                  </li>
                </ul>

                <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
                  <h4 className="font-semibold mb-2">Free to Use</h4>
                  <p className="text-sm">
                    Qi is provided free of charge for personal and commercial use. There are no subscription fees,
                    premium features, or hidden costs.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* User Responsibilities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Your Responsibilities
                </CardTitle>
                <CardDescription>What we expect from users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>As a user of Qi, you agree to:</p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Content Responsibility:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Use Qi for lawful purposes only</li>
                      <li>• Not use the service to create, store, or share illegal content</li>
                      <li>• Respect intellectual property rights</li>
                      <li>• Take responsibility for your own content</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Data Management:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Regularly back up important content using the export feature</li>
                      <li>• Understand that data is stored locally in your browser</li>
                      <li>• Take precautions to protect your device and browser data</li>
                      <li>• Not attempt to reverse engineer or modify the application</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Appropriate Use:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Not attempt to overload or disrupt the service</li>
                      <li>• Not use automated tools to access the service excessively</li>
                      <li>• Report any security vulnerabilities responsibly</li>
                      <li>• Respect the intended use of the application</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data and Privacy */}
            <Card>
              <CardHeader>
                <CardTitle>Data Ownership and Privacy</CardTitle>
                <CardDescription>Your content belongs to you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
                  <h4 className="font-semibold mb-2">You Own Your Content</h4>
                  <p className="text-sm">
                    All content you create in Qi remains your intellectual property. We have no claim to your writing,
                    ideas, or creative work.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Data Storage:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Your content is stored locally on your device only</li>
                    <li>• We have no access to your stored content</li>
                    <li>• No data is transmitted to our servers</li>
                    <li>• You are responsible for backing up your own data</li>
                  </ul>
                </div>

                <p className="text-sm text-muted-foreground">
                  For detailed information about how we handle privacy, please see our
                  <Link href="/privacy" className="text-primary hover:underline ml-1">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </CardContent>
            </Card>

            {/* Service Limitations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Service Limitations
                </CardTitle>
                <CardDescription>Important limitations to understand</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <h4 className="font-semibold mb-2">Service "As Is"</h4>
                  <p className="text-sm">
                    Qi is provided "as is" without warranties of any kind. While we strive to provide a reliable
                    service, we cannot guarantee uninterrupted availability or error-free operation.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Technical Limitations:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Local storage is subject to browser limitations</li>
                      <li>• Service depends on your browser and device capabilities</li>
                      <li>• We cannot recover data lost due to browser issues</li>
                      <li>• Features may vary across different browsers</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Liability Limitations:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• We are not liable for data loss or corruption</li>
                      <li>• Users are responsible for backing up important content</li>
                      <li>• We cannot guarantee data recovery</li>
                      <li>• Service interruptions may occur without notice</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Modifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gavel className="w-5 h-5 mr-2" />
                  Service Changes and Termination
                </CardTitle>
                <CardDescription>How we handle changes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Service Updates:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• We may update Qi to add features or fix issues</li>
                      <li>• Updates will not compromise your existing data</li>
                      <li>• Major changes will be communicated when possible</li>
                      <li>• You can continue using older versions if preferred</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Terms Changes:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• We may update these terms occasionally</li>
                      <li>• Changes will be posted with an updated date</li>
                      <li>• Continued use constitutes acceptance of new terms</li>
                      <li>• Significant changes will be highlighted</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Your Right to Discontinue:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• You can stop using Qi at any time</li>
                      <li>• Your local data will remain on your device</li>
                      <li>• Export your data before discontinuing if desired</li>
                      <li>• No cancellation process required</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Information
                </CardTitle>
                <CardDescription>Get in touch with questions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  If you have questions about these terms of service or need clarification about any aspect of using Qi,
                  please contact us:
                </p>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    <strong>Email:</strong> overthinkr9@gmail.com
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    We'll do our best to respond to your questions promptly and helpfully.
                  </p>
                </div>

                <Button asChild>
                  <a href="mailto:overthinkr9@gmail.com">Contact Us</a>
                </Button>
              </CardContent>
            </Card>

            {/* Governing Law */}
            <Card>
              <CardHeader>
                <CardTitle>Governing Law</CardTitle>
                <CardDescription>Legal jurisdiction</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  These terms are governed by applicable laws. Any disputes will be resolved through appropriate legal
                  channels. However, given the nature of Qi as a local-storage-only application, most issues can be
                  resolved through direct communication.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
