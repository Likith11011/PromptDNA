"use client"

import { useState } from "react"

interface Props {
  improved: string
  original?: string
  coachingTip?: string | null
}

export default function ImprovedPrompt({ improved, original, coachingTip }: Props) {
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState<"optimized" | "diff">("optimized")

  async function handleCopy() {
    await navigator.clipboard.writeText(improved)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* Main Container */}
      <div className="glass-panel rounded-2xl p-6 border border-indigo-500/25 shadow-2xl relative overflow-hidden bg-gradient-to-b from-[#0d1222] to-[#090d18]">
        
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header with actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-bold text-sm tracking-wide">
                  AI-Optimized High Performance Prompt
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  openai/gpt-oss-120b
                </span>
              </div>
              <p className="text-slate-400 text-xs">
                Restructured with explicit roles, concrete constraints, and output format schemas.
              </p>
            </div>
          </div>

          {/* Controls: View mode and Copy */}
          <div className="flex items-center gap-2">
            {original && (
              <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-white/[0.06] text-xs">
                <button
                  onClick={() => setViewMode("optimized")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    viewMode === "optimized" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Optimized
                </button>
                <button
                  onClick={() => setViewMode("diff")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    viewMode === "diff" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Side-by-Side
                </button>
              </div>
            )}

            <button
              onClick={handleCopy}
              className={`
                flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-md
                ${copied
                  ? "bg-emerald-500 text-slate-950 shadow-emerald-500/30 scale-105"
                  : "bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-indigo-600/30 hover:scale-[1.02]"
                }
              `}
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copy Prompt</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content Box */}
        <div className="mt-4">
          {viewMode === "optimized" ? (
            <div className="relative rounded-xl bg-[#060911] border border-white/[0.07] p-4 font-sans text-sm text-slate-200 leading-relaxed whitespace-pre-wrap selection:bg-indigo-500 selection:text-white shadow-inner">
              {improved}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Original Input</span>
                <div className="rounded-xl bg-[#060911] border border-white/[0.07] p-3 text-xs text-slate-400 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {original}
                </div>
              </div>
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">Optimized Version</span>
                <div className="rounded-xl bg-indigo-950/20 border border-indigo-500/30 p-3 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {improved}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* AI Coaching Tip Callout */}
      {coachingTip && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border border-amber-500/25 flex items-start gap-3.5 shadow-lg">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0 text-base shadow-sm">
            💡
          </div>
          <div className="flex-1">
            <h5 className="text-amber-300 font-bold text-xs uppercase tracking-wider font-mono">
              Actionable AI Coaching Directive
            </h5>
            <p className="text-slate-200 text-sm mt-1 leading-relaxed">
              {coachingTip}
            </p>
          </div>
        </div>
      )}

    </div>
  )
}