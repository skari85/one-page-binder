"use client"

import { ArrowLeft, FileText, Shield, Zap, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getTranslation, type Language } from "@/lib/translations"
import { useState, useEffect } from "react"

export default function AboutPage() {
  const [language, setLanguage] = useState<Language>("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLanguage = localStorage.getItem("qi-language")
    if (savedLanguage) setLanguage(savedLanguage as Language)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">{getTranslation(language, "appName")}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="px-2 py-1 text-sm bg-background border border-border rounded"
            >
              <option value="en">English</option>
              <option value="zh">中文</option>
            </select>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {getTranslation(language, "backToApp")}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              About One Page Binder
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A minimalist writing tool designed for those who value privacy, simplicity, and reliability.
            </p>
          </div>

          {/* Mission */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              In a world where most writing tools require cloud accounts, internet connections, and complex setups, One
              Page Binder was created to provide a simple, private, and reliable alternative. We believe that the best
              writing tool should be one that gets out of your way and lets you focus on what matters most - your
              thoughts.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">What Makes Us Different</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-background to-muted/20 border border-border/50">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl flex items-center justify-center">
                  <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold">Privacy First</h3>
                <p className="text-muted-foreground">
                  Everything you write stays on your device. No cloud storage, no tracking, no data collection.
                </p>
              </div>

              <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-background to-muted/20 border border-border/50">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl flex items-center justify-center">
                  <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Instant auto-save, zero distractions, and seamless offline experience.
                </p>
              </div>

              <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-background to-muted/20 border border-border/50">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl flex items-center justify-center">
                  <Smartphone className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold">Works Everywhere</h3>
                <p className="text-muted-foreground">
                  Desktop, tablet, or phone - your writing follows you everywhere.
                </p>
              </div>
            </div>
          </div>

          {/* Technology */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Built with Modern Technology</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              One Page Binder is built using Next.js, React, and TypeScript, ensuring a fast, reliable, and maintainable
              codebase. We use local storage for data persistence and modern web APIs for the best possible user
              experience.
            </p>
          </div>

          {/* Open Source */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Open Source</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We believe in transparency and community. One Page Binder is open source, meaning you can inspect the
              code, contribute improvements, or even run your own instance if you prefer.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Get in Touch</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Have questions, suggestions, or want to contribute? We'd love to hear from you! Reach out to us through
              our GitHub repository or contact us directly.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
