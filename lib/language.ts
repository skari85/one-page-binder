import type { Language } from "./translations"

export function getLanguage(): Language {
  if (typeof window === "undefined") {
    return "en"
  }

  const stored = localStorage.getItem("qi-language")
  if (stored === "en" || stored === "zh") {
    return stored
  }

  // Auto-detect from browser language
  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith("zh")) {
    return "zh"
  }

  return "en"
}

export function setLanguage(language: Language): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("qi-language", language)
  }
}
