import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "PromptDNA — AI Prompt Intelligence Coach",
  description: "Analyze, score, and improve your AI prompts with personalized coaching",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  )
}