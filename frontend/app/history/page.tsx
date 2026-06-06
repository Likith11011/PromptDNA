"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/Navbar"
import CategoryBadge from "@/components/CategoryBadge"
import ScoreTrendChart from "@/components/ScoreTrendChart"
import CategoryChart from "@/components/CategoryChart"
import DimensionRadar from "@/components/DimensionRadar"
import api from "@/lib/api"
import { HistoryItem, AnalyticsData } from "@/types"

const dimensions = [
  { key: "clarity", label: "Clarity", color: "bg-blue-500" },
  { key: "specificity", label: "Specificity", color: "bg-violet-500" },
  { key: "context", label: "Context", color: "bg-amber-500" },
  { key: "constraints", label: "Constraints", color: "bg-emerald-500" },
  { key: "examples", label: "Examples", color: "bg-pink-500" },
] as const

function getScoreStyle(score: number) {
  if (score >= 75) return "text-emerald-600"
  if (score >= 50) return "text-amber-600"
  return "text-red-500"
}

function PromptDetailModal({ item, onClose }: { item: HistoryItem; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-slate-100 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <CategoryBadge category={item.category} />
            <span className="text-slate-400 text-xs">{new Date(item.created_at).toLocaleString()}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl transition-colors">✕</button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
              <p className={`text-3xl font-bold ${getScoreStyle(item.total_score)}`}>{Math.round(item.total_score)}</p>
              <p className="text-slate-400 text-xs mt-1">Prompt Score / 100</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
              <p className={`text-3xl font-bold ${getScoreStyle(item.success_probability)}`}>{item.success_probability}%</p>
              <p className="text-slate-400 text-xs mt-1">Success Probability</p>
            </div>
          </div>

          {item.success_reason && (
            <p className="text-slate-400 text-sm italic">{item.success_reason}</p>
          )}

          {item.scores && (
            <div className="space-y-3">
              <h4 className="text-slate-700 font-semibold text-sm">Score Breakdown</h4>
              {dimensions.map(({ key, label, color }) => {
                const value = item.scores![key]
                return (
                  <div key={key}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-500">{label}</span>
                      <span className="text-slate-700 font-semibold">{value}/20</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full`} style={{ width: `${(value / 20) * 100}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div>
            <h4 className="text-slate-700 font-semibold text-sm mb-2">Original Prompt</h4>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{item.original_prompt}</p>
            </div>
          </div>

          {item.improved_prompt && (
            <div>
              <h4 className="text-slate-700 font-semibold text-sm mb-2">Improved Prompt</h4>
              <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{item.improved_prompt}</p>
              </div>
            </div>
          )}

          {item.coaching_tip && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
              <span>💡</span>
              <p className="text-amber-700 text-sm leading-relaxed">{item.coaching_tip}</p>
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

  useEffect(() => {
    Promise.all([
      api.get<HistoryItem[]>("/prompts/history"),
      api.get<AnalyticsData>("/prompts/analytics"),
    ])
      .then(([h, a]) => { setHistory(h.data); setAnalytics(a.data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      {selected && <PromptDetailModal item={selected} onClose={() => setSelected(null)} />}

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Prompt History</h2>
            <p className="text-slate-400 text-sm mt-1">Your analytics and past prompts. Click any to expand.</p>
          </div>
          {analytics && analytics.streak > 0 && (
            <div className="bg-orange-50 border border-orange-100 rounded-2xl px-4 py-3 text-center">
              <p className="text-xl">🔥</p>
              <p className="text-orange-600 font-bold text-lg">{analytics.streak}</p>
              <p className="text-orange-400 text-xs">day streak</p>
            </div>
          )}
        </div>

        {loading && <p className="text-slate-400 text-sm">Loading...</p>}

        {analytics && !loading && (
          <div className="space-y-4">
            <ScoreTrendChart data={analytics.score_trend} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CategoryChart data={analytics.category_breakdown} />
              <DimensionRadar averages={analytics.dimension_averages} />
            </div>
          </div>
        )}

        <div>
          <h3 className="text-slate-700 font-semibold mb-4">
            Recent Prompts
            <span className="text-slate-400 font-normal text-sm ml-2">— click to view details</span>
          </h3>

          {!loading && history.length === 0 && (
            <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center shadow-sm">
              <p className="text-slate-400">No prompts yet.</p>
              <a href="/analyze" className="text-indigo-600 text-sm mt-2 inline-block hover:underline">
                Analyze your first prompt →
              </a>
            </div>
          )}

          <div className="space-y-3">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelected(item)}
                className="w-full text-left bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-md rounded-2xl p-5 transition-all group shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <CategoryBadge category={item.category} />
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium ${getScoreStyle(item.success_probability)}`}>
                      {item.success_probability}% success
                    </span>
                    <span className={`text-lg font-bold ${getScoreStyle(item.total_score)}`}>
                      {Math.round(item.total_score)}/100
                    </span>
                  </div>
                </div>
                <p className="text-slate-600 text-sm line-clamp-2">{item.original_prompt}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-slate-300 text-xs">{new Date(item.created_at).toLocaleString()}</p>
                  <span className="text-indigo-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    View details →
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