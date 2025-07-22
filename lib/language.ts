import type { Language } from "./translations"

const LANGUAGE_KEY = "qi-language"

export function getLanguage(): Language {
  if (typeof window === "undefined") {
    return "en"
  }

  const saved = localStorage.getItem(LANGUAGE_KEY)
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

export function setLanguage(language: Language): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(LANGUAGE_KEY, language)
  }
}
