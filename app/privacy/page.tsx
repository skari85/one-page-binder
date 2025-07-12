import { ArrowLeft, FileText, Shield, Eye, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your privacy is our top priority. Learn how we protect your data and maintain your trust.
            </p>
          </div>

          {/* Privacy Commitment */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Our Privacy Commitment</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At One Page Binder, we believe that your writing is personal and should remain private. 
              We've designed our application with privacy as the foundation, not an afterthought.
            </p>
          </div>

          {/* Key Principles */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Key Privacy Principles</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-background to-muted/20 border border-border/50">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl flex items-center justify-center">
                  <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold">Local Storage Only</h3>
                <p className="text-muted-foreground">
                  All your data is stored locally on your device. We never send your content to our servers.
                </p>
              </div>

              <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-background to-muted/20 border border-border/50">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl flex items-center justify-center">
                  <Eye className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold">No Tracking</h3>
                <p className="text-muted-foreground">
                  We don't track your usage, collect analytics, or monitor your behavior in any way.
                </p>
              </div>

              <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-background to-muted/20 border border-border/50">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl flex items-center justify-center">
                  <Lock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold">No Accounts Required</h3>
                <p className="text-muted-foreground">
                  You don't need to create an account or provide any personal information to use our app.
                </p>
              </div>

              <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-background to-muted/20 border border-border/50">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl flex items-center justify-center">
                  <FileText className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold">Open Source</h3>
                <p className="text-muted-foreground">
                  Our code is open source, so you can verify exactly how we handle your data.
                </p>
              </div>
            </div>
          </div>

          {/* Data Collection */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">What We Don't Collect</h2>
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground leading-relaxed">
                We want to be completely transparent about what we do and don't collect:
              </p>
              <ul className="space-y-2 text-lg text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>We don't collect your writing content</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>We don't collect personal information</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>We don't track your usage patterns</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>We don't use cookies for tracking</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>We don't share data with third parties</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Technical Details */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Technical Details</h2>
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground leading-relaxed">
                For the technically curious, here's how we ensure your privacy:
              </p>
              <ul className="space-y-2 text-lg text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>All data is stored in your browser's localStorage</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>No server-side storage of your content</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>No network requests for your writing data</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Works completely offline</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Updates */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Updates to This Policy</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We may update this privacy policy from time to time. Any changes will be posted on this page, 
              and we encourage you to review it periodically. Your continued use of One Page Binder after 
              any changes constitutes acceptance of the updated policy.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Questions About Privacy?</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              If you have any questions about our privacy practices or this policy, please don't hesitate 
              to reach out to us. We're committed to transparency and will be happy to address any concerns.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
