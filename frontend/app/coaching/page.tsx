"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/Navbar"
import CoachingCard from "@/components/CoachingCard"
import api from "@/lib/api"
import { CoachingInsight, UserStats } from "@/types"
import Link from "next/link"

const DIM_LABELS: Record<string, string> = {
  clarity: "Clarity",
  specificity: "Specificity",
  context: "Context",
  constraints: "Constraints",
  examples: "Examples",
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
        console.error("Failed loading coaching insights:", err)
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
        setMessage("Analyze at least 3 prompts in the studio to unlock personalized coaching insights.")
      } else {
        setInsights(res.data)
        if (showMsg) setMessage("AI coaching insights refreshed based on your latest prompt patterns.")
        const sRes = await api.get<UserStats>("/coaching/stats")
        setStats(sRes.data)
      }
    } catch {
      setMessage("Failed generating insights. Please try again.")
    } finally {
      setGenerating(false)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🎯</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                AI Coaching Directives
              </h1>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Personalized algorithmic feedback on your recurring prompt habits and power-user mastery steps.
            </p>
          </div>

          <button
            onClick={() => doGenerate(true)}
            disabled={generating || loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
          >
            {generating ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Synthesizing Habits...
              </span>
            ) : (
              <>
                <span>✨ Generate New Insights</span>
              </>
            )}
          </button>
        </div>

        {/* Status Message Notification */}
        {message && (
          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-medium flex items-center gap-2 animate-fade-in">
            <span>💡</span>
            <span>{message}</span>
          </div>
        )}

        {/* Performance Metric Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {[
              {
                value: stats.total_prompts,
                label: "Prompts Analyzed",
                color: "text-white",
              },
              {
                value: `${Math.round(stats.avg_score)}/100`,
                label: "Average Score",
                color: "text-cyan-400",
              },
              {
                value: stats.weakest_dimension ? DIM_LABELS[stats.weakest_dimension] || stats.weakest_dimension : "—",
                label: "Growth Opportunity",
                color: "text-rose-400",
              },
              {
                value: stats.strongest_dimension ? DIM_LABELS[stats.strongest_dimension] || stats.strongest_dimension : "—",
                label: "Superpower Area",
                color: "text-emerald-400",
              },
            ].map(({ value, label, color }) => (
              <div key={label} className="glass-panel rounded-2xl p-4 text-center border border-white/[0.06] shadow-md">
                <p className={`text-xl sm:text-2xl font-extrabold font-mono ${color}`}>{value}</p>
                <p className="text-[11px] text-slate-400 mt-1 uppercase font-mono tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Skeleton Loader */}
        {(loading || generating) && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-panel rounded-2xl p-6 border border-white/[0.06] animate-pulse h-28" />
            ))}
          </div>
        )}

        {/* Not Enough Data Empty State */}
        {!loading && !generating && insights.length === 0 && stats && stats.total_prompts < 3 && (
          <div className="glass-panel rounded-3xl p-10 text-center border border-white/[0.08] shadow-xl space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-3xl mx-auto">
              🧬
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Gathering Behavioral DNA</h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
                You have analyzed <strong className="text-cyan-400">{stats.total_prompts}</strong> prompt{stats.total_prompts !== 1 ? "s" : ""}.
                Analyze <strong className="text-indigo-400">{3 - stats.total_prompts}</strong> more to unlock full adaptive coaching models.
              </p>
            </div>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-xs font-bold shadow-lg shadow-indigo-600/30"
            >
              <span>Go to Studio</span>
              <span>→</span>
            </Link>
          </div>
        )}

        {/* Coaching Insights List */}
        {!loading && !generating && insights.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Active Coaching Recommendations ({insights.length})
            </h3>
            {insights.map((insight) => (
              <CoachingCard key={insight.id} insight={insight} />
            ))}
          </div>
        )}

      </main>
    </div>
  )
}