"use client"

import { useState, useEffect } from "react"
import type { Language } from "./translations"
import { getTranslation } from "./translations"

const LANGUAGE_KEY = "qi-language"

export function getLanguage(): Language {
  if (typeof window === "undefined") return "en"

  const saved = localStorage.getItem(LANGUAGE_KEY)
  if (saved && (saved === "en" || saved === "zh")) {
    return saved as Language
  }

  // Auto-detect from browser language
  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith("zh")) {
    return "zh"
  }

  return "en"
}

export function setLanguage(language: Language) {
  if (typeof window === "undefined") return
  localStorage.setItem(LANGUAGE_KEY, language)
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

  const t = (key: string) => getTranslation(language, key)

  return {
    language,
    setLanguage: handleSetLanguage,
    t,
  }
}
