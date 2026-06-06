function getStyle(p: number) {
  if (p >= 75) return { stroke: "#22c55e", text: "text-emerald-600", bg: "bg-emerald-50", label: "High chance of great response" }
  if (p >= 50) return { stroke: "#f59e0b", text: "text-amber-600", bg: "bg-amber-50", label: "Moderate chance" }
  return { stroke: "#ef4444", text: "text-red-500", bg: "bg-red-50", label: "Low chance — use improved version" }
}

export default function SuccessProbability({ probability, reason }: { probability: number; reason: string | null }) {
  const { stroke, text, bg, label } = getStyle(probability)
  const circumference = 2 * Math.PI * 34
  const dash = (probability / 100) * circumference

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-5">
      <div className="relative w-18 h-18 flex-shrink-0 flex items-center justify-center">
        <svg className="w-18 h-18 -rotate-90" viewBox="0 0 80 80" width="72" height="72">
          <circle cx="40" cy="40" r="34" fill="none" stroke="#f1f5f9" strokeWidth="7" />
          <circle
            cx="40" cy="40" r="34"
            fill="none"
            stroke={stroke}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
          />
        </svg>
        <span className={`absolute text-base font-bold ${text}`}>{probability}%</span>
      </div>
      <div>
        <p className="text-slate-700 font-semibold text-sm">Success Probability</p>
        <span className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
          {label}
        </span>
        {reason && <p className="text-slate-400 text-xs mt-1.5 leading-relaxed max-w-sm">{reason}</p>}
      </div>
    </div>
  )
}