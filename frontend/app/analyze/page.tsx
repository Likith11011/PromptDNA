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

export default function AnalyzePage() {
  const [result, setResult] = useState<PromptResult | null>(null)

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        {/* Page header */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Analyze Your Prompt</h2>
          <p className="text-slate-400 text-sm mt-1">
            Paste any prompt and get an instant quality score with AI-powered improvement suggestions.
          </p>
        </div>

        <PromptInput onResult={setResult} />

        {result && (
          <div className="space-y-4 animate-fade-in">
            {/* Category row */}
            <div className="flex items-center gap-3">
              <span className="text-slate-400 text-sm">Category detected:</span>
              <CategoryBadge category={result.category} />
            </div>

            <SuccessProbability
              probability={result.success_probability}
              reason={result.success_reason}
            />

            <ScoreCard totalScore={result.total_score} scores={result.scores} />

            {result.improved_prompt && (
              <ImprovedPrompt
                improved={result.improved_prompt}
                coachingTip={result.coaching_tip}
              />
            )}

            <div className="bg-white border border-slate-100 rounded-2xl px-5 py-4 shadow-sm">
              <FeedbackButtons promptId={result.id} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}