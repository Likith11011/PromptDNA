import React from "react"

interface Props {
  probability: number
  reason: string | null
}

function getStyle(p: number) {
  if (p >= 75) {
    return {
      stroke: "#10b981",
      textColor: "text-emerald-400",
      badge: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
      label: "High Success Rate",
      desc: "Model has sufficient guidance to generate a high-accuracy, comprehensive answer.",
    }
  }
  if (p >= 50) {
    return {
      stroke: "#f59e0b",
      textColor: "text-amber-400",
      badge: "bg-amber-500/10 border-amber-500/30 text-amber-300",
      label: "Moderate Success Rate",
      desc: "May require iterative follow-ups due to underspecified constraints or broad scope.",
    }
  }
  return {
    stroke: "#f43f5e",
    textColor: "text-rose-400",
    badge: "bg-rose-500/10 border-rose-500/30 text-rose-300",
    label: "Low Success Rate",
    desc: "High likelihood of shallow responses or hallucination. We strongly recommend using the improved prompt.",
  }
}

export default function SuccessProbability({ probability, reason }: Props) {
  const rounded = Math.round(probability)
  const style = getStyle(rounded)
  const radius = 32
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (rounded / 100) * circumference

  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/[0.08] shadow-xl relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center gap-5">
        
        {/* Probability Radial Indicator */}
        <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r={radius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="6"
            />
            <circle
              cx="40"
              cy="40"
              r={radius}
              fill="none"
              stroke={style.stroke}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: "stroke-dashoffset 1s ease" }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className={`text-base font-extrabold font-mono ${style.textColor}`}>
              {rounded}%
            </span>
          </div>
        </div>

        {/* Diagnostic description */}
        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            <h4 className="text-white font-bold text-sm">Predicted AI Response Success</h4>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${style.badge}`}>
              {style.label}
            </span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            {reason || style.desc}
          </p>
        </div>
      </div>
    </div>
  )
}