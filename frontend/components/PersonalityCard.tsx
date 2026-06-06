import { Personality } from "@/types"

const typeColors: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  Architect: {
    bg: "bg-blue-50", border: "border-blue-100",
    text: "text-blue-700", badge: "bg-blue-100 text-blue-600"
  },
  Researcher: {
    bg: "bg-violet-50", border: "border-violet-100",
    text: "text-violet-700", badge: "bg-violet-100 text-violet-600"
  },
  Builder: {
    bg: "bg-emerald-50", border: "border-emerald-100",
    text: "text-emerald-700", badge: "bg-emerald-100 text-emerald-600"
  },
  Creator: {
    bg: "bg-pink-50", border: "border-pink-100",
    text: "text-pink-700", badge: "bg-pink-100 text-pink-600"
  },
  Explorer: {
    bg: "bg-amber-50", border: "border-amber-100",
    text: "text-amber-700", badge: "bg-amber-100 text-amber-600"
  },
}

export default function PersonalityCard({ personality }: { personality: Personality }) {
  const colors = typeColors[personality.type] || typeColors.Explorer

  return (
    <div className={`${colors.bg} border ${colors.border} rounded-2xl p-6`}>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-3xl">
          {personality.icon}
        </div>
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Prompt Personality</p>
          <p className={`text-xl font-bold ${colors.text}`}>{personality.type}</p>
        </div>
      </div>
      <p className="text-slate-600 text-sm leading-relaxed mb-4">{personality.description}</p>
      <div className="flex flex-wrap gap-2">
        {personality.traits.map((trait) => (
          <span key={trait} className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors.badge}`}>
            {trait}
          </span>
        ))}
      </div>
    </div>
  )
}