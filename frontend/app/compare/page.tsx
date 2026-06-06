"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import CategoryBadge from "@/components/CategoryBadge"
import api from "@/lib/api"
import { ComparisonResult } from "@/types"

const DIM_LABELS: Record<string, string> = {
  clarity: "Clarity", specificity: "Specificity",
  context: "Context", constraints: "Constraints", examples: "Examples",
}

const DIM_COLORS = {
  clarity: "bg-blue-500",
  specificity: "bg-violet-500",
  context: "bg-amber-500",
  constraints: "bg-emerald-500",
  examples: "bg-pink-500",
}

function ScoreBar({ value, max = 20, color }: { value: number; max?: number; color: string }) {
  return (
    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} rounded-full transition-all duration-700`}
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  )
}

export default function ComparePage() {
  const [promptA, setPromptA] = useState("")
  const [promptB, setPromptB] = useState("")
  const [result, setResult] = useState<ComparisonResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleCompare() {
    if (!promptA.trim() || !promptB.trim()) {
      setError("Please enter both prompts before comparing.")
      return
    }
    setError("")
    setLoading(true)
    try {
      const res = await api.post<ComparisonResult>("/profile/compare", {
        prompt_a: promptA.trim(),
        prompt_b: promptB.trim(),
      })
      setResult(res.data)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  function getScoreColor(score: number) {
    if (score >= 75) return "text-emerald-600"
    if (score >= 50) return "text-amber-600"
    return "text-red-500"
  }

  function getWinnerStyle(side: "A" | "B") {
    if (!result) return ""
    if (result.winner === side) return "border-indigo-300 bg-indigo-50/30"
    if (result.winner === "tie") return "border-slate-200"
    return "border-slate-100 opacity-80"
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Prompt Comparison</h2>
          <p className="text-slate-400 text-sm mt-1">
            Compare two prompts side-by-side to see which performs better and why.
          </p>
        </div>

        {/* Input area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Prompt A", value: promptA, setter: setPromptA },
            { label: "Prompt B", value: promptB, setter: setPromptB },
          ].map(({ label, value, setter }) => (
            <div key={label} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <label className="block text-slate-700 font-semibold text-sm mb-3">{label}</label>
              <textarea
                value={value}
                onChange={(e) => setter(e.target.value)}
                placeholder={`Enter ${label.toLowerCase()}...`}
                rows={6}
                className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 rounded-xl px-4 py-3 text-sm resize-none border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
              <p className="text-slate-300 text-xs mt-1.5 text-right">{value.length} chars</p>
            </div>
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        <button
          onClick={handleCompare}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold text-sm transition-all shadow-sm shadow-indigo-200"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Comparing...
            </span>
          ) : (
            "Compare Prompts ⇄"
          )}
        </button>

        {/* Results */}
        {result && (
          <div className="space-y-5 animate-fade-in">
            {/* Winner banner */}
            <div className={`rounded-2xl p-5 border text-center ${
              result.winner === "tie"
                ? "bg-slate-50 border-slate-200"
                : "bg-indigo-50 border-indigo-100"
            }`}>
              {result.winner === "tie" ? (
                <p className="text-slate-600 font-semibold">🤝 It's a Tie</p>
              ) : (
                <p className="text-indigo-700 font-bold text-lg">
                  🏆 Prompt {result.winner} Wins
                  <span className="text-indigo-500 font-normal text-sm ml-2">
                    ({result.winner === "A" ? result.score_a : result.score_b}/100
                    vs {result.winner === "A" ? result.score_b : result.score_a}/100)
                  </span>
                </p>
              )}
              <p className="text-slate-500 text-sm mt-2 leading-relaxed max-w-2xl mx-auto">
                {result.recommendation}
              </p>
            </div>

            {/* Side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(["A", "B"] as const).map((side) => {
                const score = side === "A" ? result.score_a : result.score_b
                const scores = side === "A" ? result.scores_a : result.scores_b
                const category = side === "A" ? result.category_a : result.category_b
                const isWinner = result.winner === side

                return (
                  <div
                    key={side}
                    className={`bg-white border rounded-2xl p-5 shadow-sm transition-all ${getWinnerStyle(side)}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 font-semibold text-sm">Prompt {side}</span>
                        {isWinner && result.winner !== "tie" && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 font-medium">
                            Winner
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <CategoryBadge category={category} />
                        <span className={`text-xl font-bold ${getScoreColor(score)}`}>
                          {Math.round(score)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {Object.entries(scores).map(([dim, val]) => (
                        <div key={dim}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-500">{DIM_LABELS[dim] || dim}</span>
                            <span className="text-slate-700 font-semibold">{val}/20</span>
                          </div>
                          <ScoreBar
                            value={val}
                            color={DIM_COLORS[dim as keyof typeof DIM_COLORS] || "bg-indigo-500"}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}