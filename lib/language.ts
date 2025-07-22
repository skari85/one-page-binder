"use client"

import { translations, type Language } from "./translations"

export function getLanguage(): Language {
  if (typeof window === "undefined") return "en"

  const saved = localStorage.getItem("qi-language")
  if (saved && (saved === "en" || saved === "zh")) {
    return saved as Language
  }

  // Detect browser language
  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith("zh")) {
    return "zh"
  }

  return "en"
}

export function setLanguage(language: Language) {
  if (typeof window !== "undefined") {
    localStorage.setItem("qi-language", language)
  }
}

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    setLanguageState(getLanguage())
  }, [])

  const handleSetLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    setLanguage(newLanguage)
  }

  const t = (key: string) => {
    const keys = key.split(".")
    let value: any = translations[language]

    for (const k of keys) {
      value = value?.[k]
    }

    return value || key
  }

  return {
    language,
    setLanguage: handleSetLanguage,
    t,
  }
}

// Import React hooks
import { useState, useEffect } from "react"
