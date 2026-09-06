import React from "react"
import { CoachingInsight } from "@/types"

const DIM_CONFIG: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  clarity: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30", icon: "🔍" },
  specificity: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30", icon: "🎯" },
  context: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30", icon: "📚" },
  constraints: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30", icon: "🔒" },
  examples: { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/30", icon: "💡" },
  general: { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/30", icon: "⭐" },
}

export default function CoachingCard({ insight }: { insight: CoachingInsight }) {
  const dim = insight.target_dimension || "general"
  const config = DIM_CONFIG[dim] || DIM_CONFIG.general

  return (
    <div className={`glass-panel rounded-2xl p-5 border ${config.border} shadow-xl hover:border-indigo-500/40 transition-all duration-200`}>
      <div className="flex items-start gap-4">
        {/* Icon Avatar */}
        <div className={`w-10 h-10 rounded-xl ${config.bg} border ${config.border} flex items-center justify-center flex-shrink-0 text-base shadow-sm`}>
          {config.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <h5 className={`font-bold text-xs uppercase tracking-wider font-mono ${config.text}`}>
              {insight.insight_type.replace(/_/g, " ")}
            </h5>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${config.bg} ${config.text} uppercase`}>
              Target: {dim}
            </span>
          </div>

          <p className="text-slate-200 text-sm leading-relaxed">
            {insight.message}
          </p>

          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-500 border-t border-white/[0.04] pt-2">
            <span>Adaptive AI Coaching Engine</span>
            <span>{new Date(insight.generated_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}