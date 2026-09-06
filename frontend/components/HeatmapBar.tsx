import React from "react"

interface Props {
  dimension: string
  weakness: number // 0-20, higher = weaker
}

const DIM_LABELS: Record<string, { label: string; icon: string }> = {
  clarity: { label: "Clarity & Phrasing", icon: "🔍" },
  specificity: { label: "Specificity & Focus", icon: "🎯" },
  context: { label: "Context & Background", icon: "📚" },
  constraints: { label: "Constraints & Bounds", icon: "🔒" },
  examples: { label: "Examples & Few-Shot", icon: "💡" },
}

function getHeatInfo(weakness: number) {
  if (weakness <= 5) {
    return {
      label: "Strong",
      color: "from-emerald-500 to-teal-400",
      text: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    }
  }
  if (weakness <= 10) {
    return {
      label: "Moderate",
      color: "from-amber-500 to-yellow-400",
      text: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    }
  }
  if (weakness <= 15) {
    return {
      label: "Weak",
      color: "from-orange-500 to-rose-400",
      text: "text-orange-400",
      bg: "bg-orange-500/10 border-orange-500/20",
    }
  }
  return {
    label: "Critical",
    color: "from-rose-600 to-red-500",
    text: "text-rose-400",
    bg: "bg-rose-500/10 border-rose-500/20",
  }
}

export default function HeatmapBar({ dimension, weakness }: Props) {
  const pct = Math.min(100, Math.max(0, (weakness / 20) * 100))
  const info = getHeatInfo(weakness)
  const meta = DIM_LABELS[dimension] || { label: dimension, icon: "✦" }

  return (
    <div className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] transition-all">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs">{meta.icon}</span>
          <span className="text-xs font-semibold text-slate-200">{meta.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold border ${info.bg} ${info.text}`}>
            {info.label} ({weakness}/20 deficit)
          </span>
        </div>
      </div>

      <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden p-[1px] border border-white/[0.04]">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${info.color} transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}