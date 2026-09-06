import React from "react"
import { WeeklyReport } from "@/types"

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

function getImprovementInfo(pct: number) {
  if (pct > 0) {
    return {
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/30",
      prefix: "+",
      trend: "Trending Up",
    }
  }
  if (pct < 0) {
    return {
      color: "text-rose-400",
      bg: "bg-rose-500/10 border-rose-500/30",
      prefix: "",
      trend: "Trending Down",
    }
  }
  return {
    color: "text-slate-400",
    bg: "bg-slate-500/10 border-slate-500/30",
    prefix: "",
    trend: "Neutral",
  }
}

export default function WeeklyReportCard({ report }: { report: WeeklyReport }) {
  const imp = getImprovementInfo(report.improvement_pct)
  const hasDims = Object.keys(report.dimension_avgs).length > 0

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-7 border border-white/[0.08] shadow-2xl relative overflow-hidden space-y-6">
      
      {/* Decorative top strip */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <h3 className="text-white font-bold text-lg tracking-tight">
              Weekly AI Intelligence Briefing
            </h3>
          </div>
          <p className="text-slate-400 text-xs font-mono mt-1">
            Period: {report.week_start} — {report.week_end}
          </p>
        </div>

        <div className={`px-4 py-2 rounded-xl border ${imp.bg} text-center`}>
          <div className="flex items-center gap-1.5 justify-center">
            <span className={`text-xl font-extrabold font-mono ${imp.color}`}>
              {imp.prefix}{report.improvement_pct}%
            </span>
          </div>
          <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
            vs previous week
          </p>
        </div>
      </div>

      {/* 3-Metric Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
          <p className="text-2xl font-extrabold font-mono text-white">{report.total_prompts}</p>
          <p className="text-xs text-slate-400 mt-0.5">Total Prompts Analyzed</p>
        </div>
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
          <p className="text-2xl font-extrabold font-mono text-indigo-400">
            {Math.round(report.avg_score)}<span className="text-sm text-slate-500">/100</span>
          </p>
          <p className="text-xs text-slate-400 mt-0.5">Weekly Average Score</p>
        </div>
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
          <p className="text-lg font-bold text-emerald-400 capitalize truncate">
            {report.best_category || "—"}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">Highest Scoring Category</p>
        </div>
      </div>

      {/* Dimension Averages */}
      {hasDims && (
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Weekly Dimension Breakdown
          </h4>
          <div className="space-y-2.5">
            {Object.entries(report.dimension_avgs).map(([dim, val]) => (
              <div key={dim} className="p-2.5 rounded-lg bg-white/[0.01] border border-white/[0.03]">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">{DIM_LABELS[dim] || dim}</span>
                  <span className={`font-mono font-bold ${
                    val >= 12 ? "text-emerald-400" :
                    val >= 8 ? "text-amber-400" :
                    "text-rose-400"
                  }`}>
                    {val}/20
                  </span>
                </div>
                <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${DIM_COLORS[dim] || "from-indigo-500 to-cyan-400"}`}
                    style={{ width: `${(val / 20) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Mistakes / Weaknesses */}
      {report.top_mistakes.length > 0 && (
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-rose-400 mb-2">
            Priority Attention Areas
          </h4>
          <div className="flex flex-wrap gap-2">
            {report.top_mistakes.map((m) => (
              <span
                key={m}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-rose-500/10 border border-rose-500/20 text-rose-300 capitalize"
              >
                ⚠️ Deficit in {DIM_LABELS[m] || m}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Coaching Suggestions */}
      {report.coaching_suggestions.length > 0 && (
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-indigo-400 mb-3">
            AI Directives for Next Week
          </h4>
          <div className="space-y-2">
            {report.coaching_suggestions.map((s, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/20 flex items-start gap-3"
              >
                <span className="text-indigo-400 font-bold text-xs mt-0.5">0{i + 1}</span>
                <p className="text-slate-200 text-xs leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}