import React from "react"
import { Scores } from "@/types"

interface Props {
  totalScore: number
  scores: Scores
}

const DIMENSIONS = [
  {
    key: "clarity" as const,
    label: "Clarity",
    desc: "Unambiguous wording & readability",
    color: "from-blue-500 to-cyan-400",
    textCol: "text-cyan-400",
    bgCol: "bg-blue-500/10",
    icon: "🔍",
  },
  {
    key: "specificity" as const,
    label: "Specificity",
    desc: "Concrete targets & details",
    color: "from-violet-500 to-purple-400",
    textCol: "text-purple-400",
    bgCol: "bg-violet-500/10",
    icon: "🎯",
  },
  {
    key: "context" as const,
    label: "Context",
    desc: "Domain background & role",
    color: "from-amber-500 to-yellow-400",
    textCol: "text-amber-400",
    bgCol: "bg-amber-500/10",
    icon: "📚",
  },
  {
    key: "constraints" as const,
    label: "Constraints",
    desc: "Format, tone & length boundaries",
    color: "from-emerald-500 to-teal-400",
    textCol: "text-emerald-400",
    bgCol: "bg-emerald-500/10",
    icon: "🔒",
  },
  {
    key: "examples" as const,
    label: "Few-Shot / Examples",
    desc: "Sample inputs & outputs provided",
    color: "from-pink-500 to-rose-400",
    textCol: "text-pink-400",
    bgCol: "bg-pink-500/10",
    icon: "💡",
  },
]

function getScoreTier(score: number) {
  if (score >= 90) {
    return {
      label: "Exceptional DNA",
      sub: "World-class prompt engineering precision",
      textColor: "text-emerald-400",
      badgeBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
      ringColor: "#10b981",
      glowColor: "shadow-emerald-500/20",
    }
  }
  if (score >= 75) {
    return {
      label: "Strong Performance",
      sub: "Effective prompt with minor polish opportunities",
      textColor: "text-cyan-400",
      badgeBg: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300",
      ringColor: "#06b6d4",
      glowColor: "shadow-cyan-500/20",
    }
  }
  if (score >= 50) {
    return {
      label: "Moderate Quality",
      sub: "Lacks critical constraints or domain context",
      textColor: "text-amber-400",
      badgeBg: "bg-amber-500/10 border-amber-500/30 text-amber-300",
      ringColor: "#f59e0b",
      glowColor: "shadow-amber-500/20",
    }
  }
  return {
    label: "Needs Optimization",
    sub: "High risk of vague or generic LLM hallucination",
    textColor: "text-rose-400",
    badgeBg: "bg-rose-500/10 border-rose-500/30 text-rose-300",
    ringColor: "#f43f5e",
    glowColor: "shadow-rose-500/20",
  }
}

export default function ScoreCard({ totalScore, scores }: Props) {
  const roundedScore = Math.round(totalScore)
  const tier = getScoreTier(roundedScore)
  
  // Circular arc calculation
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (roundedScore / 100) * circumference

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/[0.08] shadow-2xl relative overflow-hidden">
      
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Score Header */}
      <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/[0.06]">
        
        {/* Glowing Radial Gauge */}
        <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
          <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={tier.ringColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)" }}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className={`text-3xl font-extrabold font-mono tracking-tighter ${tier.textColor}`}>
              {roundedScore}
            </span>
            <span className="text-[10px] text-slate-400 font-mono -mt-1">/100</span>
          </div>
        </div>

        {/* Text diagnostics summary */}
        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
            <h4 className="text-white font-bold text-lg">Overall Prompt Score</h4>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${tier.badgeBg}`}>
              {tier.label}
            </span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed max-w-md">
            {tier.sub}
          </p>
          <div className="mt-3 flex items-center justify-center sm:justify-start gap-4 text-xs font-mono text-slate-400">
            <span>Dimensions: <strong className="text-slate-200">5</strong></span>
            <span className="text-slate-600">•</span>
            <span>Max Score: <strong className="text-slate-200">100</strong></span>
            <span className="text-slate-600">•</span>
            <span>Scale: <strong className="text-slate-200">0-20/dim</strong></span>
          </div>
        </div>
      </div>

      {/* 5-Dimension Deep Breakdown */}
      <div className="mt-6 space-y-3.5">
        <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Dimensional Diagnostic Matrix</span>
          <span className="text-slate-500 font-normal lowercase">out of 20 pts</span>
        </h5>

        <div className="grid grid-cols-1 gap-2.5">
          {DIMENSIONS.map(({ key, label, desc, color, textCol, icon }) => {
            const val = scores[key] ?? 0
            const pct = Math.min(100, Math.max(0, (val / 20) * 100))
            
            return (
              <div
                key={key}
                className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] transition-all"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">{icon}</span>
                    <span className="text-xs font-semibold text-slate-200">{label}</span>
                    <span className="hidden sm:inline text-[11px] text-slate-500">— {desc}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className={`font-bold ${textCol}`}>{val}</span>
                    <span className="text-slate-600">/20</span>
                  </div>
                </div>

                {/* Progress track */}
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden p-[1px] border border-white/[0.04]">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-1000 ease-out`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}