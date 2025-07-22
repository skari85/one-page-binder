import type { Language } from "./translations"

export function getLanguage(): Language {
  if (typeof window === "undefined") return "en"

  const stored = localStorage.getItem("qi-language")
  if (stored && (stored === "en" || stored === "zh")) {
    return stored as Language
  }

  // Detect browser language
  const browserLang = navigator.language.split("-")[0]
  if (browserLang === "zh") {
    return "zh"
  }

  return "en"
}

export function setLanguage(language: Language): void {
  if (typeof window === "undefined") return
  localStorage.setItem("qi-language", language)
}
