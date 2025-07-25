"use client"

import React from "react"

export type Language = "en" | "zh"

export function getLanguage(): Language {
  if (typeof window === "undefined") return "en"

  const saved = localStorage.getItem("qi-language")
  if (saved === "en" || saved === "zh") {
    return saved
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
  const [language, setLanguageState] = React.useState<Language>("en")

  React.useEffect(() => {
    setLanguageState(getLanguage())
  }, [])

  const updateLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    setLanguageState(newLanguage)
  }

  return {
    language,
    setLanguage: updateLanguage,
  }
}
