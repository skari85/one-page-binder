import type { Metadata } from "next"
import PrivacyClientPage from "./PrivacyClientPage"

export const metadata: Metadata = {
  title: "Privacy Policy - Qi",
  description: "Learn how Qi protects your privacy with local-only storage and no tracking.",
}

export default function Privacy() {
  return <PrivacyClientPage />
}
