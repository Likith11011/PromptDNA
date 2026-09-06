"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import PromptInput from "@/components/PromptInput"
import ScoreCard from "@/components/ScoreCard"
import ImprovedPrompt from "@/components/ImprovedPrompt"
import CategoryBadge from "@/components/CategoryBadge"
import FeedbackButtons from "@/components/FeedbackButtons"
import SuccessProbability from "@/components/SuccessProbability"
import { PromptResult } from "@/types"
import Link from "next/link"

export default function AnalyzePage() {
  const [result, setResult] = useState<PromptResult | null>(null)

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Prompt Diagnostic Studio
              </h1>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Scientifically analyze, score, and rewrite your AI prompts with hybrid rules and openai/gpt-oss-120b.
            </p>
          </div>

          <Link
            href="/compare"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-slate-300 hover:text-white transition-all"
          >
            <span>⚔️ A/B Compare Arena</span>
            <span className="text-slate-500">→</span>
          </Link>
        </div>

        {/* Input Studio Component */}
        <PromptInput onResult={setResult} />

        {/* Diagnostic Results Display */}
        {result && (
          <div className="space-y-6 animate-fade-in pt-4 border-t border-white/[0.06]">
            
            {/* Category & Status Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono text-slate-400">Detected Operational Domain:</span>
                <CategoryBadge category={result.category} size="md" />
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                <span>Prompt ID: <span className="text-slate-200">{result.id.slice(0, 8)}...</span></span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400">Analysis Complete</span>
              </div>
            </div>

            {/* Success Probability Meter */}
            <SuccessProbability
              probability={result.success_probability}
              reason={result.success_reason}
            />

            {/* Detailed 5-Dimension Score Card */}
            <ScoreCard
              totalScore={result.total_score}
              scores={result.scores}
            />

            {/* AI-Optimized Prompt Output */}
            {result.improved_prompt && (
              <ImprovedPrompt
                improved={result.improved_prompt}
                original={result.original_prompt}
                coachingTip={result.coaching_tip}
              />
            )}

            {/* Feedback Footer Card */}
            <div className="glass-panel rounded-2xl px-5 py-4 border border-white/[0.08] shadow-lg">
              <FeedbackButtons promptId={result.id} />
            </div>

          </div>
        )}

      </main>
    </div>
  )
}