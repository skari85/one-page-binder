import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileText, Shield, Zap, Globe, Heart, Code } from "lucide-react"

export const metadata: Metadata = {
  title: "About - Qi",
  description: "Learn more about Qi, a minimalist writing app focused on privacy and simplicity.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">About Qi</h1>
              <p className="text-muted-foreground">A quiet place to write</p>
            </div>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to App
              </Button>
            </Link>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Introduction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  What is Qi?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Qi (气) is a minimalist writing application designed with privacy and simplicity at its core. Named
                  after the Chinese concept of life force or energy flow, Qi provides a distraction-free environment
                  where your thoughts can flow freely onto the digital page.
                </p>
                <p>
                  Unlike traditional writing apps that store your data in the cloud, Qi keeps everything local on your
                  device. This means your writing remains private, secure, and accessible even when you're offline.
                </p>
              </CardContent>
            </Card>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Privacy First
                  </CardTitle>
                  <CardDescription>Your data stays with you</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• All content stored locally in your browser</li>
                    <li>• No cloud storage or data transmission</li>
                    <li>• No tracking, analytics, or cookies</li>
                    <li>• No account registration required</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Simple & Fast
                  </CardTitle>
                  <CardDescription>Focus on what matters</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Clean, distraction-free interface</li>
                    <li>• Automatic saving as you type</li>
                    <li>• Instant startup, no loading screens</li>
                    <li>• Works completely offline</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    Universal Access
                  </CardTitle>
                  <CardDescription>Write anywhere, anytime</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Works in any modern web browser</li>
                    <li>• Responsive design for all devices</li>
                    <li>• Multiple export formats (TXT, DOCX, PDF)</li>
                    <li>• Bilingual support (English & Chinese)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Code className="w-5 h-5 mr-2" />
                    Open Source
                  </CardTitle>
                  <CardDescription>Transparent and trustworthy</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Source code available for review</li>
                    <li>• Community-driven development</li>
                    <li>• No hidden functionality</li>
                    <li>• Built with modern web technologies</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Philosophy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  Our Philosophy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  In an age of constant connectivity and data harvesting, we believe that writing should be a personal,
                  private act. Your thoughts, ideas, and creative expressions deserve to remain yours alone.
                </p>
                <p>
                  Qi embodies the principle of digital minimalism - providing just what you need to write effectively,
                  without the bloat, distractions, or privacy concerns of modern software. We believe that the best
                  tools are often the simplest ones.
                </p>
                <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                  "The best writing app is the one that gets out of your way and lets you write."
                </blockquote>
              </CardContent>
            </Card>

            {/* Technical Details */}
            <Card>
              <CardHeader>
                <CardTitle>Technical Details</CardTitle>
                <CardDescription>For the curious minds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Built With:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Next.js 15 with React 19</li>
                    <li>• TypeScript for type safety</li>
                    <li>• Tailwind CSS for styling</li>
                    <li>• Radix UI for accessible components</li>
                    <li>• Local Storage API for data persistence</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Browser Compatibility:</h4>
                  <p className="text-sm text-muted-foreground">
                    Qi works in all modern browsers that support ES6+ and the Local Storage API. This includes Chrome,
                    Firefox, Safari, and Edge (recent versions).
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
                <CardDescription>We'd love to hear from you</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Have questions, suggestions, or just want to say hello? We're always happy to hear from our users.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild>
                    <a href="mailto:overthinkr9@gmail.com">Contact Us</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/">Try Qi Now</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
