"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { translations, type Language } from "./translations"

interface LanguageStore {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: keyof typeof translations.en) => string
}

export const useLanguage = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: "en",
      setLanguage: (language: Language) => set({ language }),
      t: (key: keyof typeof translations.en) => {
        const { language } = get()
        return translations[language][key] || translations.en[key] || key
      },
    }),
    {
      name: "qi-language",
    },
  ),
)
