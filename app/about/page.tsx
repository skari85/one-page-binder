import type { Metadata } from "next"
import AboutClient from "./AboutClient"

export const metadata: Metadata = {
  title: "About - Qi",
  description: "Learn more about Qi, a minimalist writing app focused on privacy and simplicity.",
}

export default function About() {
  return <AboutClient />
}
