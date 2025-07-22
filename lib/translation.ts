import { translations, type Language } from "./translations"

export function getTranslation(language: Language, key: string): string {
  const keys = key.split(".")
  let value: unknown = translations[language]

  for (const k of keys) {
    value = (value as Record<string, unknown>)?.[k]
  }

  return (value as string) || key
}
