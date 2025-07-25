export type Language = "en" | "zh"

export function getStoredLanguage(): Language {
  if (typeof window === "undefined") return "en"

  try {
    const stored = localStorage.getItem("qi-language")
    return stored === "zh" || stored === "en" ? stored : "en"
  } catch {
    return "en"
  }
}

export function setStoredLanguage(language: Language): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("qi-language", language)
  } catch {
    // Ignore storage errors
  }
}
