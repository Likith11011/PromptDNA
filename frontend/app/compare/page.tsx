"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import CategoryBadge from "@/components/CategoryBadge"
import api from "@/lib/api"
import { ComparisonResult } from "@/types"

const DIM_LABELS: Record<string, string> = {
  clarity: "Clarity",
  specificity: "Specificity",
  context: "Context",
  constraints: "Constraints",
  examples: "Examples",
}

const DIM_COLORS: Record<string, string> = {
  clarity: "from-blue-500 to-cyan-400",
  specificity: "from-purple-500 to-violet-400",
  context: "from-amber-500 to-yellow-400",
  constraints: "from-emerald-500 to-teal-400",
  examples: "from-pink-500 to-rose-400",
}

const COMPARISON_PRESETS = [
  {
    name: "Vague vs Structured",
    a: "Build a chat app with websocket in Node.js",
    b: "Develop a high-concurrency WebSocket chat server in Node.js 20 using Socket.io and Redis Pub/Sub for horizontal scaling. Include room management, typing indicators, reconnection backoff, and JWT token authentication.",
  },
  {
    name: "Unconstrained vs Format-Bounded",
    a: "Analyze our competitor's pricing strategy and tell me what to do.",
    b: "Act as a B2B SaaS Monetization Consultant. Benchmark our competitor's 3-tier pricing against our current $49/mo plan. Output a Markdown comparison table with Columns: Plan, Features, Pricing, Moat, followed by 3 actionable positioning recommendations.",
  },
]

function ScoreBar({ value, max = 20, color }: { value: number; max?: number; color: string }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className="h-2 bg-slate-900 rounded-full overflow-hidden p-[1px] border border-white/[0.04]">
      <div
        className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000 ease-out`}
        style={{ width: `${pct}%` }}
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
      setError("Please input both Prompt A and Prompt B before launching arena battle.")
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
      setError("Comparison request failed. Please check your session and try again.")
    } finally {
      setLoading(false)
    }
  }

  function loadPreset(preset: (typeof COMPARISON_PRESETS)[0]) {
    setPromptA(preset.a)
    setPromptB(preset.b)
    setError("")
  }

  function getScoreColor(score: number) {
    if (score >= 75) return "text-emerald-400"
    if (score >= 50) return "text-amber-400"
    return "text-rose-400"
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">⚔️</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Prompt Battle Arena
              </h1>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Compare two prompt variations side-by-side to determine which elicits superior LLM reasoning and precision.
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono hidden sm:inline">Presets:</span>
            {COMPARISON_PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => loadPreset(p)}
                className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white text-xs font-semibold transition-all"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Dual Input Arena Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Prompt A */}
          <div className="glass-panel rounded-2xl p-5 border border-indigo-500/20 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                PROMPT CANDIDATE A
              </span>
              <span className="text-[11px] font-mono text-slate-400">{promptA.length} chars</span>
            </div>
            <textarea
              value={promptA}
              onChange={(e) => setPromptA(e.target.value)}
              placeholder="Enter first candidate prompt here..."
              rows={6}
              className="w-full bg-[#080b13] text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 text-sm resize-none border border-white/[0.08] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all leading-relaxed"
            />
          </div>

          {/* Prompt B */}
          <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                PROMPT CANDIDATE B
              </span>
              <span className="text-[11px] font-mono text-slate-400">{promptB.length} chars</span>
            </div>
            <textarea
              value={promptB}
              onChange={(e) => setPromptB(e.target.value)}
              placeholder="Enter second candidate prompt here..."
              rows={6}
              className="w-full bg-[#080b13] text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 text-sm resize-none border border-white/[0.08] focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all leading-relaxed"
            />
          </div>

        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Action Trigger Button */}
        <button
          onClick={handleCompare}
          disabled={loading}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-sm tracking-wide shadow-xl shadow-indigo-600/30 transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <div className="flex items-center gap-3">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <span>Benchmarking Dimensions in Arena...</span>
            </div>
          ) : (
            <>
              <span>⚔️ Run Head-to-Head Comparison</span>
              <span className="text-cyan-200">→</span>
            </>
          )}
        </button>

        {/* Comparison Result Display */}
        {result && (
          <div className="space-y-6 animate-fade-in pt-4 border-t border-white/[0.06]">
            
            {/* Winner Celebratory Banner */}
            <div className={`glass-panel rounded-2xl p-6 sm:p-7 border relative overflow-hidden text-center space-y-2 ${
              result.winner === "tie"
                ? "border-white/[0.1] bg-slate-900/60"
                : "border-indigo-500/30 bg-gradient-to-b from-indigo-950/30 to-[#0d121f]"
            }`}>
              {result.winner === "tie" ? (
                <div>
                  <span className="text-3xl">🤝</span>
                  <h3 className="text-xl font-bold text-white mt-1">Dead Heat: It&apos;s a Tie</h3>
                  <p className="text-slate-400 text-xs font-mono">Both prompts scored identically ({result.score_a}/100)</p>
                </div>
              ) : (
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono mb-2">
                    <span>🏆 WINNING CANDIDATE DETECTED</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-white tracking-tight">
                    Prompt Candidate {result.winner} Wins the Arena Battle
                  </h3>
                  <p className="text-sm font-mono text-cyan-300 mt-1">
                    Score: {result.winner === "A" ? result.score_a : result.score_b}/100 vs{" "}
                    {result.winner === "A" ? result.score_b : result.score_a}/100 (
                    +{Math.abs(result.score_a - result.score_b)} pt advantage)
                  </p>
                </div>
              )}

              <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed pt-3 border-t border-white/[0.04]">
                {result.recommendation}
              </p>
            </div>

            {/* Side-by-Side Breakdown Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {(["A", "B"] as const).map((side) => {
                const score = side === "A" ? result.score_a : result.score_b
                const scores = side === "A" ? result.scores_a : result.scores_b
                const category = side === "A" ? result.category_a : result.category_b
                const isWinner = result.winner === side

                return (
                  <div
                    key={side}
                    className={`glass-panel rounded-2xl p-6 border transition-all ${
                      isWinner
                        ? "border-emerald-500/40 bg-emerald-950/10 shadow-emerald-500/10"
                        : "border-white/[0.07]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/[0.05]">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-sm text-white">Prompt {side}</span>
                        {isWinner && result.winner !== "tie" && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold">
                            WINNER
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2.5">
                        <CategoryBadge category={category} size="sm" />
                        <span className={`text-2xl font-extrabold font-mono ${getScoreColor(score)}`}>
                          {Math.round(score)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {Object.entries(scores).map(([dim, val]) => (
                        <div key={dim}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-400">{DIM_LABELS[dim] || dim}</span>
                            <span className="text-slate-200 font-mono font-semibold">{val}/20</span>
                          </div>
                          <ScoreBar
                            value={val}
                            color={DIM_COLORS[dim] || "from-indigo-500 to-cyan-400"}
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