"use client"

import { useEffect, useState, useMemo } from "react"
import Navbar from "@/components/Navbar"
import CategoryBadge from "@/components/CategoryBadge"
import ScoreTrendChart from "@/components/ScoreTrendChart"
import CategoryChart from "@/components/CategoryChart"
import DimensionRadar from "@/components/DimensionRadar"
import api from "@/lib/api"
import { HistoryItem, AnalyticsData } from "@/types"
import Link from "next/link"

const DIMENSIONS = [
  { key: "clarity" as const, label: "Clarity", color: "from-blue-500 to-cyan-400" },
  { key: "specificity" as const, label: "Specificity", color: "from-purple-500 to-violet-400" },
  { key: "context" as const, label: "Context", color: "from-amber-500 to-yellow-400" },
  { key: "constraints" as const, label: "Constraints", color: "from-emerald-500 to-teal-400" },
  { key: "examples" as const, label: "Examples", color: "from-pink-500 to-rose-400" },
]

function getScoreStyle(score: number) {
  if (score >= 75) return "text-emerald-400"
  if (score >= 50) return "text-amber-400"
  return "text-rose-400"
}

function PromptDetailModal({ item, onClose }: { item: HistoryItem; onClose: () => void }) {
  const [copiedOriginal, setCopiedOriginal] = useState(false)
  const [copiedImproved, setCopiedImproved] = useState(false)

  async function copyText(text: string, isImproved = false) {
    await navigator.clipboard.writeText(text)
    if (isImproved) {
      setCopiedImproved(true)
      setTimeout(() => setCopiedImproved(false), 2000)
    } else {
      setCopiedOriginal(true)
      setTimeout(() => setCopiedOriginal(false), 2000)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="glass-panel rounded-3xl border border-white/[0.12] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0d121f]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/[0.06] sticky top-0 bg-[#0d121f]/90 backdrop-blur-xl z-10">
          <div className="flex items-center gap-3">
            <CategoryBadge category={item.category} size="md" />
            <span className="text-slate-400 font-mono text-xs">
              {new Date(item.created_at).toLocaleString()}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white text-sm transition-all"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center">
              <p className={`text-3xl font-extrabold font-mono ${getScoreStyle(item.total_score)}`}>
                {Math.round(item.total_score)}<span className="text-sm text-slate-500">/100</span>
              </p>
              <p className="text-slate-400 text-xs mt-1">Prompt Intelligence Score</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center">
              <p className={`text-3xl font-extrabold font-mono ${getScoreStyle(item.success_probability)}`}>
                {Math.round(item.success_probability)}%
              </p>
              <p className="text-slate-400 text-xs mt-1">Predicted Success Probability</p>
            </div>
          </div>

          {item.success_reason && (
            <p className="text-slate-400 text-xs italic bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">
              {item.success_reason}
            </p>
          )}

          {/* Dimension Breakdown */}
          {item.scores && (
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Diagnostic Score Breakdown
              </h4>
              <div className="space-y-2">
                {DIMENSIONS.map(({ key, label, color }) => {
                  const val = item.scores ? item.scores[key] : 0
                  return (
                    <div key={key} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300 font-medium">{label}</span>
                        <span className="text-slate-200 font-mono font-semibold">{val}/20</span>
                      </div>
                      <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${color} rounded-full`}
                          style={{ width: `${(val / 20) * 100}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Original Prompt */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Original Prompt</h4>
              <button
                onClick={() => copyText(item.original_prompt, false)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-mono"
              >
                {copiedOriginal ? "✓ Copied" : "Copy"}
              </button>
            </div>
            <div className="p-4 rounded-xl bg-[#060911] border border-white/[0.07] text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-mono">
              {item.original_prompt}
            </div>
          </div>

          {/* Improved Prompt */}
          {item.improved_prompt && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400">
                  openai/gpt-oss-120b Optimized Version
                </h4>
                <button
                  onClick={() => copyText(item.improved_prompt!, true)}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-mono"
                >
                  {copiedImproved ? "✓ Copied" : "Copy"}
                </button>
              </div>
              <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                {item.improved_prompt}
              </div>
            </div>
          )}

          {/* Coaching Tip */}
          {item.coaching_tip && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
              <span className="text-base">💡</span>
              <div>
                <h5 className="text-xs font-mono font-bold text-amber-300 uppercase">Coaching Directive</h5>
                <p className="text-xs text-slate-200 mt-1 leading-relaxed">{item.coaching_tip}</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<HistoryItem | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState<"recent" | "highest" | "lowest">("recent")

  useEffect(() => {
    Promise.all([
      api.get<HistoryItem[]>("/prompts/history"),
      api.get<AnalyticsData>("/prompts/analytics"),
    ])
      .then(([h, a]) => {
        setHistory(h.data)
        setAnalytics(a.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filteredHistory = useMemo(() => {
    return history
      .filter((item) => {
        const matchesQuery = item.original_prompt.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === "all" || item.category.toLowerCase() === selectedCategory.toLowerCase()
        return matchesQuery && matchesCategory
      })
      .sort((a, b) => {
        if (sortBy === "highest") return b.total_score - a.total_score
        if (sortBy === "lowest") return a.total_score - b.total_score
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
  }, [history, searchQuery, selectedCategory, sortBy])

  const categories = ["all", "coding", "writing", "research", "business", "study", "creative"]

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
      <Navbar />
      {selected && <PromptDetailModal item={selected} onClose={() => setSelected(null)} />}

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📊</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Prompt Analytics & History
              </h1>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Historical performance trajectories, dimensional balance, and prompt repository.
            </p>
          </div>

          {analytics && analytics.streak > 0 && (
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
              <span className="text-2xl animate-bounce">🔥</span>
              <div>
                <p className="text-lg font-extrabold font-mono text-white leading-none">
                  {analytics.streak} Day{analytics.streak > 1 ? "s" : ""}
                </p>
                <p className="text-[10px] uppercase font-mono tracking-wider text-orange-400/80">Active Streak</p>
              </div>
            </div>
          )}
        </div>

        {/* Analytics Charts Grid */}
        {analytics && !loading && (
          <div className="space-y-5 animate-fade-in">
            <ScoreTrendChart data={analytics.score_trend} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <CategoryChart data={analytics.category_breakdown} />
              <DimensionRadar averages={analytics.dimension_averages} />
            </div>
          </div>
        )}

        {/* Search, Filter & History List Section */}
        <div className="space-y-4">
          
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div>
              <h3 className="text-white font-bold text-base flex items-center gap-2">
                <span>📁</span> Prompt Archive ({filteredHistory.length})
              </h3>
              <p className="text-slate-400 text-xs">Click any card to inspect full score matrix and AI improvements.</p>
            </div>

            {/* Search and Sort controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              <input
                type="text"
                placeholder="Search prompt text..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#080b13] text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-1.5 text-xs border border-white/[0.08] focus:border-indigo-500 outline-none w-44 sm:w-56"
              />

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "recent" | "highest" | "lowest")}
                className="bg-[#080b13] text-slate-300 rounded-xl px-3 py-1.5 text-xs border border-white/[0.08] outline-none"
              >
                <option value="recent">Sort: Recent</option>
                <option value="highest">Sort: Highest Score</option>
                <option value="lowest">Sort: Lowest Score</option>
              </select>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-all ${
                  selectedCategory === c
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "bg-white/[0.03] text-slate-400 hover:text-slate-200 border border-white/[0.05]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Loading Skeletons */}
          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-panel rounded-2xl p-5 border border-white/[0.06] animate-pulse h-24" />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredHistory.length === 0 && (
            <div className="glass-panel rounded-2xl p-10 text-center border border-white/[0.06] space-y-3">
              <span className="text-3xl">🔍</span>
              <p className="text-slate-300 font-semibold text-sm">No matching prompts found.</p>
              <p className="text-slate-500 text-xs">Try clearing filters or analyze a new prompt.</p>
              <Link
                href="/analyze"
                className="inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-md shadow-indigo-600/30"
              >
                Analyze a Prompt →
              </Link>
            </div>
          )}

          {/* Prompt Cards List */}
          <div className="space-y-3">
            {filteredHistory.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelected(item)}
                className="w-full text-left glass-panel glass-panel-hover rounded-2xl p-5 border border-white/[0.07] transition-all group shadow-md"
              >
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <CategoryBadge category={item.category} size="sm" />
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-xs text-slate-400 hidden sm:inline">
                      {Math.round(item.success_probability)}% success
                    </span>
                    <span className={`text-lg font-extrabold ${getScoreStyle(item.total_score)}`}>
                      {Math.round(item.total_score)}<span className="text-xs text-slate-500 font-normal">/100</span>
                    </span>
                  </div>
                </div>

                <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 leading-relaxed font-mono">
                  {item.original_prompt}
                </p>

                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/[0.04] text-[11px] font-mono text-slate-500">
                  <span>{new Date(item.created_at).toLocaleString()}</span>
                  <span className="text-indigo-400 group-hover:text-cyan-300 transition-colors flex items-center gap-1">
                    <span>Inspect Diagnostic</span>
                    <span>→</span>
                  </span>
                </div>
              </button>
            ))}
          </div>

        </div>

      </main>
    </div>
  )
}