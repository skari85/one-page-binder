import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { PWAUpdatePrompt } from "@/components/pwa-update-prompt"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "QI",
  description: "A single-page digital folder for anything you don't want to lose",
  generator: "v0.dev",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  keywords: ["notes", "binder", "digital notebook", "privacy", "local storage"],
  authors: [{ name: "QI" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "QI",
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#020817" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="QI" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#3b82f6" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-152x152.png" />
        <script src="/pwa-utils.js"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Register service worker
              if (typeof registerServiceWorker === 'function') {
                registerServiceWorker();
              }
              
              // Setup offline detection
              if (typeof setupOfflineDetection === 'function') {
                setupOfflineDetection(
                  function() { console.log('App is offline'); },
                  function() { console.log('App is online'); }
                );
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          {children}
          <PWAUpdatePrompt />
        </ThemeProvider>
      </body>
    </html>
  )
}
