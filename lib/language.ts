export type Language = "en" | "zh"

export const SUPPORTED_LANGUAGES: Language[] = ["en", "zh"]

export const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English",
  zh: "中文",
}

export function getDefaultLanguage(): Language {
  if (typeof window === "undefined") return "en"

  const stored = localStorage.getItem("language")
  if (stored && SUPPORTED_LANGUAGES.includes(stored as Language)) {
    return stored as Language
  }

  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith("zh")) return "zh"

  return "en"
}

export function setLanguage(language: Language): void {
  if (typeof window === "undefined") return
  localStorage.setItem("language", language)
}
