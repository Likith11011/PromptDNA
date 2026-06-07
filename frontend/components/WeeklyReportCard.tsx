import { WeeklyReport } from "@/types"

const DIM_LABELS: Record<string, string> = {
  clarity: "Clarity",
  specificity: "Specificity",
  context: "Context",
  constraints: "Constraints",
  examples: "Examples",
}

const DIM_COLORS: Record<string, string> = {
  clarity: "bg-blue-500",
  specificity: "bg-violet-500",
  context: "bg-amber-500",
  constraints: "bg-emerald-500",
  examples: "bg-pink-500",
}

function getImprovementStyle(pct: number) {
  if (pct > 0) return { color: "text-emerald-600", bg: "bg-emerald-50", prefix: "+" }
  if (pct < 0) return { color: "text-red-500", bg: "bg-red-50", prefix: "" }
  return { color: "text-slate-500", bg: "bg-slate-50", prefix: "" }
}

export default function WeeklyReportCard({ report }: { report: WeeklyReport }) {
  const { color, bg, prefix } = getImprovementStyle(report.improvement_pct)
  const hasDims = Object.keys(report.dimension_avgs).length > 0

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-slate-900 font-semibold">This Week's Report</h3>
          <p className="text-slate-400 text-xs mt-0.5">
            {report.week_start} – {report.week_end}
          </p>
        </div>
        <div className={`px-3 py-1.5 rounded-xl ${bg} text-center`}>
          <p className={`text-xl font-bold ${color}`}>
            {prefix}{report.improvement_pct}%
          </p>
          <p className="text-slate-400 text-xs">vs last week</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
          <p className="text-2xl font-bold text-slate-900">{report.total_prompts}</p>
          <p className="text-slate-400 text-xs mt-0.5">Prompts</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
          <p className="text-2xl font-bold text-indigo-600">
            {Math.round(report.avg_score)}
          </p>
          <p className="text-slate-400 text-xs mt-0.5">Avg Score</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
          <p className="text-base font-bold text-emerald-600 capitalize">
            {report.best_category || "—"}
          </p>
          <p className="text-slate-400 text-xs mt-0.5">Best Category</p>
        </div>
      </div>

      {/* Dimension averages */}
      {hasDims && (
        <div>
          <p className="text-slate-700 font-semibold text-sm mb-3">
            Dimension Averages This Week
          </p>
          <div className="space-y-2.5">
            {Object.entries(report.dimension_avgs).map(([dim, val]) => (
              <div key={dim}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">{DIM_LABELS[dim] || dim}</span>
                  <span className={`font-semibold ${
                    val >= 12 ? "text-emerald-600" :
                    val >= 8  ? "text-amber-600"  :
                    "text-red-500"
                  }`}>
                    {val}/20
                  </span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      DIM_COLORS[dim] || "bg-indigo-500"
                    }`}
                    style={{ width: `${(val / 20) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top weaknesses */}
      {report.top_mistakes.length > 0 && (
        <div>
          <p className="text-slate-700 font-semibold text-sm mb-2">
            Top Weaknesses This Week
          </p>
          <div className="flex flex-wrap gap-2">
            {report.top_mistakes.map((m) => (
              <span
                key={m}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-500 border border-red-100 capitalize"
              >
                {DIM_LABELS[m] || m}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Coaching suggestions */}
      <div>
        <p className="text-slate-700 font-semibold text-sm mb-3">
          Coaching Suggestions
        </p>
        <ul className="space-y-2">
          {report.coaching_suggestions.map((s, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2.5"
            >
              <span className="text-indigo-400 mt-0.5 flex-shrink-0">→</span>
              <span className="text-indigo-700 text-sm leading-relaxed">{s}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  )
}