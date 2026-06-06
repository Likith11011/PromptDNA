interface Props {
  dimension: string
  weakness: number  // 0-20, higher = weaker
}

const dimLabels: Record<string, string> = {
  clarity: "Clarity",
  specificity: "Specificity",
  context: "Context",
  constraints: "Constraints",
  examples: "Examples",
}

function getHeatColor(weakness: number): string {
  if (weakness <= 5) return "bg-emerald-400"
  if (weakness <= 10) return "bg-amber-400"
  if (weakness <= 15) return "bg-orange-500"
  return "bg-red-500"
}

function getHeatLabel(weakness: number): string {
  if (weakness <= 5) return "Strong"
  if (weakness <= 10) return "Moderate"
  if (weakness <= 15) return "Weak"
  return "Critical"
}

export default function HeatmapBar({ dimension, weakness }: Props) {
  const pct = (weakness / 20) * 100
  const color = getHeatColor(weakness)
  const label = getHeatLabel(weakness)

  return (
    <div className="flex items-center gap-4">
      <span className="text-slate-600 text-sm w-24 flex-shrink-0 font-medium">
        {dimLabels[dimension] || dimension}
      </span>
      <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs font-semibold w-14 text-right ${
        weakness <= 5 ? "text-emerald-600" :
        weakness <= 10 ? "text-amber-600" :
        weakness <= 15 ? "text-orange-600" :
        "text-red-500"
      }`}>
        {label}
      </span>
    </div>
  )
}