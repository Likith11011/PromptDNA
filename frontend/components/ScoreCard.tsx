import { Scores } from "@/types"

interface Props {
  totalScore: number
  scores: Scores
}

const dimensions = [
  { key: "clarity", label: "Clarity", color: "bg-blue-500" },
  { key: "specificity", label: "Specificity", color: "bg-violet-500" },
  { key: "context", label: "Context", color: "bg-amber-500" },
  { key: "constraints", label: "Constraints", color: "bg-emerald-500" },
  { key: "examples", label: "Examples", color: "bg-pink-500" },
] as const

function getScoreStyle(score: number) {
  if (score >= 75) return { color: "text-emerald-600", bg: "bg-emerald-50", label: "Strong prompt" }
  if (score >= 50) return { color: "text-amber-600", bg: "bg-amber-50", label: "Room to improve" }
  return { color: "text-red-500", bg: "bg-red-50", label: "Needs work" }
}

export default function ScoreCard({ totalScore, scores }: Props) {
  const { color, bg, label } = getScoreStyle(totalScore)
  const circumference = 2 * Math.PI * 34
  const dash = (totalScore / 100) * circumference
  const strokeColor = totalScore >= 75 ? "#22c55e" : totalScore >= 50 ? "#f59e0b" : "#ef4444"

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
      {/* Header row */}
      <div className="flex items-center gap-5 mb-6">
        <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="#f1f5f9" strokeWidth="7" />
            <circle
              cx="40" cy="40" r="34"
              fill="none"
              stroke={strokeColor}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference}`}
              style={{ transition: "stroke-dasharray 0.8s ease" }}
            />
          </svg>
          <div className="absolute text-center">
            <span className={`text-xl font-bold ${color}`}>{Math.round(totalScore)}</span>
          </div>
        </div>
        <div>
          <p className="text-slate-900 font-semibold text-lg">Prompt Score</p>
          <span className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${color}`}>
            {label}
          </span>
        </div>
      </div>

      {/* Dimension bars */}
      <div className="space-y-3">
        {dimensions.map(({ key, label, color }) => {
          const value = scores[key]
          const pct = (value / 20) * 100
          return (
            <div key={key}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-slate-500 text-xs font-medium">{label}</span>
                <span className="text-slate-700 text-xs font-semibold">{value}/20</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${color} rounded-full transition-all duration-700`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}