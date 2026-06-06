"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/Navbar"
import CoachingCard from "@/components/CoachingCard"
import api from "@/lib/api"
import { CoachingInsight, UserStats } from "@/types"

const dimensionLabels: Record<string, string> = {
  clarity: "Clarity", specificity: "Specificity", context: "Context",
  constraints: "Constraints", examples: "Examples",
}

export default function CoachingPage() {
  const [insights, setInsights] = useState<CoachingInsight[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const [iRes, sRes] = await Promise.all([
          api.get<CoachingInsight[]>("/coaching/insights"),
          api.get<UserStats>("/coaching/stats"),
        ])
        setStats(sRes.data)
        if (iRes.data.length === 0 && sRes.data.total_prompts >= 3) {
          await doGenerate(false)
        } else {
          setInsights(iRes.data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function doGenerate(showMsg = true) {
    setGenerating(true)
    if (showMsg) setMessage("")
    try {
      const res = await api.post<CoachingInsight[]>("/coaching/generate")
      if (res.data.length === 0) {
        setMessage("Analyze at least 3 prompts to unlock coaching insights.")
      } else {
        setInsights(res.data)
        if (showMsg) setMessage("Insights refreshed based on your latest prompts.")
        const sRes = await api.get<UserStats>("/coaching/stats")
        setStats(sRes.data)
      }
    } catch {
      setMessage("Something went wrong. Try again.")
    } finally {
      setGenerating(false)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">

        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Your Coaching Insights</h2>
            <p className="text-slate-400 text-sm mt-1">Personalized analysis of your prompting habits.</p>
          </div>
          <button
            onClick={() => doGenerate(true)}
            disabled={generating || loading}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-semibold transition-all shadow-sm shadow-indigo-200"
          >
            {generating ? "Analyzing..." : "Refresh Insights"}
          </button>
        </div>

        {message && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 text-indigo-600 text-sm">
            {message}
          </div>
        )}

        {stats && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { value: stats.total_prompts, label: "Prompts analyzed", color: "text-slate-900" },
              { value: Math.round(stats.avg_score), label: "Average score", color: "text-indigo-600" },
              {
                value: stats.weakest_dimension ? dimensionLabels[stats.weakest_dimension] : "—",
                label: "Weakest area", color: "text-red-500"
              },
              {
                value: stats.strongest_dimension ? dimensionLabels[stats.strongest_dimension] : "—",
                label: "Strongest area", color: "text-emerald-600"
              },
            ].map(({ value, label, color }) => (
              <div key={label} className="bg-white border border-slate-100 rounded-2xl p-4 text-center shadow-sm">
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-slate-400 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        )}

        {(loading || generating) && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 animate-pulse shadow-sm">
                <div className="h-4 bg-slate-100 rounded w-1/3 mb-3" />
                <div className="h-3 bg-slate-100 rounded w-full mb-2" />
                <div className="h-3 bg-slate-100 rounded w-3/4" />
              </div>
            ))}
          </div>
        )}

        {!loading && !generating && insights.length === 0 && stats && stats.total_prompts < 3 && (
          <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center shadow-sm space-y-3">
            <p className="text-3xl">🧬</p>
            <p className="text-slate-700 font-semibold">Not enough data yet</p>
            <p className="text-slate-400 text-sm">
              You have {stats.total_prompts} prompt{stats.total_prompts !== 1 ? "s" : ""} analyzed.
              Analyze {3 - stats.total_prompts} more to unlock personalized coaching.
            </p>
            <a href="/analyze" className="text-indigo-600 text-sm hover:underline inline-block">
              Analyze a prompt →
            </a>
          </div>
        )}

        {!loading && !generating && (
          <div className="space-y-4">
            {insights.map((insight) => (
              <CoachingCard key={insight.id} insight={insight} />
            ))}
          </div>
        )}

      </main>
    </div>
  )
}