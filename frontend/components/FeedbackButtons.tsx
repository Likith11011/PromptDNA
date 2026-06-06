"use client"

import { useState } from "react"
import api from "@/lib/api"

export default function FeedbackButtons({ promptId }: { promptId: string }) {
  const [submitted, setSubmitted] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleFeedback(wasHelpful: boolean) {
    setLoading(true)
    try {
      await api.post("/coaching/feedback", { prompt_id: promptId, was_helpful: wasHelpful })
      setSubmitted(wasHelpful)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (submitted !== null) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span className="text-base">{submitted ? "👍" : "👎"}</span>
        <span>Thanks for the feedback!</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-slate-400 text-sm">Was this suggestion helpful?</span>
      <button
        onClick={() => handleFeedback(true)}
        disabled={loading}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-sm hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
      >
        👍 Yes
      </button>
      <button
        onClick={() => handleFeedback(false)}
        disabled={loading}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-sm hover:border-red-300 hover:bg-red-50 hover:text-red-500 transition-all"
      >
        👎 No
      </button>
    </div>
  )
}