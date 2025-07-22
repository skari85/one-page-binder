import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Qi - A quiet place to write",
  description: "A minimalist writing app that stores everything locally. No cloud, no tracking, zero distractions.",
  keywords: ["writing", "notes", "minimalist", "privacy", "local storage", "distraction-free"],
  authors: [{ name: "Qi Team" }],
  creator: "Qi Team",
  publisher: "Qi Team",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://qi-writer.vercel.app"),
  openGraph: {
    title: "Qi - A quiet place to write",
    description: "A minimalist writing app that stores everything locally. No cloud, no tracking, zero distractions.",
    url: "https://qi-writer.vercel.app",
    siteName: "Qi",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Qi - A quiet place to write",
    description: "A minimalist writing app that stores everything locally. No cloud, no tracking, zero distractions.",
    creator: "@qi_writer",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-icon.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
