import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from "@vercel/analytics/react"
import { Suspense } from "react"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "Qi - A quiet place to write",
  description: "A minimalist writing app that stores everything locally. No cloud, no tracking, just writing.",
  keywords: ["writing", "notes", "privacy", "local storage", "minimalist"],
  authors: [{ name: "Qi Team" }],
  creator: "Qi Team",
  publisher: "Qi Team",
  robots: "index, follow",
  openGraph: {
    title: "Qi - A quiet place to write",
    description: "A minimalist writing app that stores everything locally. No cloud, no tracking, just writing.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Qi - A quiet place to write",
    description: "A minimalist writing app that stores everything locally. No cloud, no tracking, just writing.",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
