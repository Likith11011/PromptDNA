"use client"

import { useState } from "react"
import api from "@/lib/api"

export default function FeedbackButtons({ promptId }: { promptId: string }) {
  const [submitted, setSubmitted] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleFeedback(wasHelpful: boolean) {
    if (loading || submitted !== null) return
    setLoading(true)
    try {
      await api.post("/coaching/feedback", { prompt_id: promptId, was_helpful: wasHelpful })
      setSubmitted(wasHelpful)
    } catch (err) {
      console.error("Feedback error:", err)
    } finally {
      setLoading(false)
    }
  }

  if (submitted !== null) {
    return (
      <div className="flex items-center gap-2 text-xs text-slate-300 font-medium py-1 animate-fade-in">
        <span className="text-emerald-400">✓</span>
        <span>Thank you! Your feedback continuously tunes your personal PromptDNA model.</span>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
      <span className="text-slate-400 font-medium">Was this AI optimization helpful?</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleFeedback(true)}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-emerald-500/15 border border-white/[0.08] hover:border-emerald-500/30 text-slate-300 hover:text-emerald-300 transition-all active:scale-95 disabled:opacity-50"
        >
          <span>👍</span>
          <span>Helpful</span>
        </button>
        <button
          onClick={() => handleFeedback(false)}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-rose-500/15 border border-white/[0.08] hover:border-rose-500/30 text-slate-300 hover:text-rose-300 transition-all active:scale-95 disabled:opacity-50"
        >
          <span>👎</span>
          <span>Needs Work</span>
        </button>
      </div>
    </div>
  )
}