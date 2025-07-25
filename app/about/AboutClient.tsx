"use client"

import { CardDescription } from "@/components/ui/card"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Shield, Zap, Globe, Heart, Code } from "lucide-react"

export default function AboutClient() {
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
            <CardTitle>About Qi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Qi is a minimalist writing application designed for privacy and focus. All your writing is stored locally
              on your device - nothing is sent to external servers.
            </p>
            <p>
              Features include PIN protection, multiple export formats, focus exercises, and both single page and book
              views for different writing experiences.
            </p>
            <p>The app supports both English and Chinese languages and works offline as a Progressive Web App.</p>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
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
                <li>• PIN protection for added security</li>
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
                <li>• Focus exercises to enhance productivity</li>
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
                <li>• Available as a Progressive Web App</li>
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
        <Card className="mt-8">
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
              without the bloat, distractions, or privacy concerns of modern software. We believe that the best tools
              are often the simplest ones.
            </p>
            <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
              "The best writing app is the one that gets out of your way and lets you write."
            </blockquote>
          </CardContent>
        </Card>

        {/* Technical Details */}
        <Card className="mt-8">
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
        <Card className="mt-8">
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
  )
}
