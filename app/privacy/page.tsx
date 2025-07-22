"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Globe } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Privacy() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">气</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">{t("title")}</h1>
                <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Globe className="h-4 w-4 mr-2" />
                {t("language")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setLanguage("en")}>English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("zh")}>中文</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{t("privacyTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">{t("privacyIntro")}</p>

              <div>
                <h3 className="font-medium mb-2">{t("privacyDataCollection")}</h3>
                <p className="text-sm text-muted-foreground">{t("privacyDataCollectionText")}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">{t("privacyLocalStorage")}</h3>
                <p className="text-sm text-muted-foreground">{t("privacyLocalStorageText")}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">{t("privacyNoTracking")}</h3>
                <p className="text-sm text-muted-foreground">{t("privacyNoTrackingText")}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">{t("privacyOpenSource")}</h3>
                <p className="text-sm text-muted-foreground">{t("privacyOpenSourceText")}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
