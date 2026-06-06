"use client"

import { useState } from "react"

interface Props {
  improved: string
  coachingTip?: string | null
}

export default function ImprovedPrompt({ improved, coachingTip }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(improved)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-3">
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-slate-900 font-semibold text-sm">Improved Prompt</h3>
            <p className="text-slate-400 text-xs mt-0.5">AI-rewritten for better results</p>
          </div>
          <button
            onClick={handleCopy}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
              ${copied
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                : "bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100"
              }
            `}
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{improved}</p>
        </div>
      </div>

      {coachingTip && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 flex gap-3">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-indigo-600 text-sm">💡</span>
          </div>
          <div>
            <p className="text-indigo-700 font-semibold text-sm">Coaching Tip</p>
            <p className="text-indigo-600/80 text-sm mt-1 leading-relaxed">{coachingTip}</p>
          </div>
        </div>
      )}
    </div>
  )
}