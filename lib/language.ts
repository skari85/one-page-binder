export type Language = "en" | "zh"

export const getStoredLanguage = (): Language => {
  if (typeof window === "undefined") return "en"
  return (localStorage.getItem("language") as Language) || "en"
}

export const setStoredLanguage = (language: Language) => {
  if (typeof window === "undefined") return
  localStorage.setItem("language", language)
}

export const getDefaultLanguage = (): Language => {
  if (typeof window === "undefined") return "en"

  const stored = getStoredLanguage()
  if (stored) return stored

  const browserLang = navigator.language.toLowerCase()
  return browserLang.startsWith("zh") ? "zh" : "en"
}
