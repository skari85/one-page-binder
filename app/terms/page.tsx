import { ArrowLeft, FileText, Scale, Shield, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">One Page Binder</h1>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to App
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Terms of Service
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Please read these terms carefully before using One Page Binder.
            </p>
          </div>

          {/* Acceptance */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Acceptance of Terms</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              By accessing and using One Page Binder, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </div>

          {/* Service Description */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Service Description</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              One Page Binder is a minimalist writing tool that allows users to create, edit, and store text content locally on their devices. 
              The service is provided "as is" and we make no warranties about the reliability or availability of the service.
            </p>
          </div>

          {/* User Responsibilities */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">User Responsibilities</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-background to-muted/20 border border-border/50">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl flex items-center justify-center">
                  <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold">Data Backup</h3>
                <p className="text-muted-foreground">
                  You are responsible for backing up your own data. While we provide export functionality, 
                  we cannot guarantee against data loss.
                </p>
              </div>

              <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-background to-muted/20 border border-border/50">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl flex items-center justify-center">
                  <Scale className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold">Legal Use</h3>
                <p className="text-muted-foreground">
                  You agree to use the service only for lawful purposes and in accordance with these terms.
                </p>
              </div>

              <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-background to-muted/20 border border-border/50">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold">No Harmful Content</h3>
                <p className="text-muted-foreground">
                  You agree not to use the service to create, store, or distribute harmful, illegal, or inappropriate content.
                </p>
              </div>

              <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-background to-muted/20 border border-border/50">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl flex items-center justify-center">
                  <FileText className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold">Content Ownership</h3>
                <p className="text-muted-foreground">
                  You retain full ownership of all content you create using the service.
                </p>
              </div>
            </div>
          </div>

          {/* Limitations */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Limitations of Liability</h2>
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground leading-relaxed">
                One Page Binder is provided on an "as is" and "as available" basis. We disclaim all warranties, 
                express or implied, including but not limited to:
              </p>
              <ul className="space-y-2 text-lg text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Warranties of merchantability or fitness for a particular purpose</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Warranties that the service will be uninterrupted or error-free</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Warranties regarding the security of your data</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Warranties that defects will be corrected</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Data Storage */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Data Storage and Privacy</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Your data is stored locally on your device using your browser's localStorage. We do not have access to your content, 
              and we do not store any of your data on our servers. Please refer to our Privacy Policy for more details about 
              how we handle your data.
            </p>
          </div>

          {/* Service Availability */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Service Availability</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              While we strive to maintain high availability, we do not guarantee that the service will be available at all times. 
              The service may be temporarily unavailable due to maintenance, updates, or other factors beyond our control.
            </p>
          </div>

          {/* Updates */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Updates to Terms</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We reserve the right to modify these terms at any time. We will notify users of any material changes by posting 
              the updated terms on this page. Your continued use of the service after any changes constitutes acceptance of the updated terms.
            </p>
          </div>

          {/* Termination */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Termination</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              You may stop using the service at any time. We may terminate or suspend access to the service immediately, 
              without prior notice, for any reason, including if you breach these terms.
            </p>
          </div>

          {/* Governing Law */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Governing Law</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which 
              One Page Binder operates, without regard to its conflict of law provisions.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Contact Information</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              If you have any questions about these terms of service, please contact us through our GitHub repository 
              or reach out to us directly. We're committed to transparency and will be happy to address any concerns.
            </p>
          </div>

          {/* Last Updated */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Last Updated</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              These terms were last updated on January 1, 2024. We encourage you to review these terms periodically 
              to stay informed about our practices.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}