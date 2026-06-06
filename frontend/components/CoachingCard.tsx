import { CoachingInsight } from "@/types"

const dimensionConfig: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  clarity: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100", icon: "🔍" },
  specificity: { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-100", icon: "🎯" },
  context: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100", icon: "📚" },
  constraints: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", icon: "🔒" },
  examples: { bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-100", icon: "💡" },
  general: { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100", icon: "⭐" },
}

export default function CoachingCard({ insight }: { insight: CoachingInsight }) {
  const dim = insight.target_dimension || "general"
  const config = dimensionConfig[dim] || dimensionConfig.general

  return (
    <div className={`bg-white border ${config.border} rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 ${config.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <span className="text-lg">{config.icon}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <p className={`font-semibold text-sm ${config.text} capitalize`}>
              {insight.insight_type.replace(/_/g, " ")}
            </p>
            <span className={`text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.text} capitalize`}>
              {dim}
            </span>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">{insight.message}</p>
        </div>
      </div>
    </div>
  )
}