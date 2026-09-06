import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "PromptDNA — AI Prompt Intelligence Coach",
  description: "Scientifically analyze, score, and optimize your AI prompts with personalized behavioral intelligence and openai/gpt-oss-120b.",
  keywords: ["prompt engineering", "ai coach", "prompt optimizer", "gpt-oss-120b", "prompt intelligence"],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#07090e] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white min-h-screen flex flex-col relative bg-cyber-grid">
        <div className="fixed inset-0 pointer-events-none bg-radial-glow z-0" />
        <div className="relative z-10 flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}