import { WeeklyReport } from "@/types"

function getImprovementColor(pct: number) {
  if (pct > 0) return "text-emerald-600"
  if (pct < 0) return "text-red-500"
  return "text-slate-500"
}

export default function WeeklyReportCard({ report }: { report: WeeklyReport }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-slate-900 font-semibold">This Week's Report</h3>
          <p className="text-slate-400 text-xs mt-0.5">
            {new Date(report.week_start).toLocaleDateString()} –{" "}
            {new Date(report.week_end).toLocaleDateString()}
          </p>
        </div>
        <span className={`text-2xl font-bold ${getImprovementColor(report.improvement_pct)}`}>
          {report.improvement_pct > 0 ? "+" : ""}{report.improvement_pct}%
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
          <p className="text-2xl font-bold text-slate-900">{report.total_prompts}</p>
          <p className="text-slate-400 text-xs mt-0.5">Prompts</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
          <p className="text-2xl font-bold text-indigo-600">{Math.round(report.avg_score)}</p>
          <p className="text-slate-400 text-xs mt-0.5">Avg Score</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
          <p className="text-lg font-bold text-emerald-600 capitalize">
            {report.best_category || "—"}
          </p>
          <p className="text-slate-400 text-xs mt-0.5">Best Category</p>
        </div>
      </div>

      {/* Top mistakes */}
      {report.top_mistakes.length > 0 && (
        <div>
          <p className="text-slate-700 font-semibold text-sm mb-2">Top Weaknesses</p>
          <div className="flex flex-wrap gap-2">
            {report.top_mistakes.map((m) => (
              <span key={m} className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-500 border border-red-100 capitalize">
                {m}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Coaching suggestions */}
      <div>
        <p className="text-slate-700 font-semibold text-sm mb-2">Coaching Suggestions</p>
        <ul className="space-y-1.5">
          {report.coaching_suggestions.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
              <span className="text-indigo-400 mt-0.5">→</span> {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}