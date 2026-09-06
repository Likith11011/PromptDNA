import React from "react"
import { Personality } from "@/types"

const TYPE_CONFIG: Record<
  string,
  {
    bg: string
    border: string
    glow: string
    text: string
    badgeBg: string
    badgeText: string
    tagline: string
  }
> = {
  Architect: {
    bg: "from-blue-600/15 via-indigo-600/10 to-cyan-500/10",
    border: "border-blue-500/30",
    glow: "shadow-blue-500/20",
    text: "text-blue-400",
    badgeBg: "bg-blue-500/15 border-blue-500/30",
    badgeText: "text-blue-300",
    tagline: "Systematic, highly structured, precision constraint engineering",
  },
  Researcher: {
    bg: "from-purple-600/15 via-violet-600/10 to-pink-500/10",
    border: "border-purple-500/30",
    glow: "shadow-purple-500/20",
    text: "text-purple-400",
    badgeBg: "bg-purple-500/15 border-purple-500/30",
    badgeText: "text-purple-300",
    tagline: "Context-rich, deep domain investigation, hypothesis driven",
  },
  Builder: {
    bg: "from-emerald-600/15 via-teal-600/10 to-cyan-500/10",
    border: "border-emerald-500/30",
    glow: "shadow-emerald-500/20",
    text: "text-emerald-400",
    badgeBg: "bg-emerald-500/15 border-emerald-500/30",
    badgeText: "text-emerald-300",
    tagline: "Code-centric, functional execution, pragmatically grounded",
  },
  Creator: {
    bg: "from-pink-600/15 via-rose-600/10 to-amber-500/10",
    border: "border-pink-500/30",
    glow: "shadow-pink-500/20",
    text: "text-pink-400",
    badgeBg: "bg-pink-500/15 border-pink-500/30",
    badgeText: "text-pink-300",
    tagline: "Expressive, narrative-driven, expansive ideation specialist",
  },
  Explorer: {
    bg: "from-amber-600/15 via-orange-600/10 to-yellow-500/10",
    border: "border-amber-500/30",
    glow: "shadow-amber-500/20",
    text: "text-amber-400",
    badgeBg: "bg-amber-500/15 border-amber-500/30",
    badgeText: "text-amber-300",
    tagline: "Iterative probing, open-ended experimentation, dynamic discovery",
  },
}

export default function PersonalityCard({ personality }: { personality: Personality }) {
  const config = TYPE_CONFIG[personality.type] || TYPE_CONFIG.Explorer

  return (
    <div
      className={`
        glass-panel rounded-2xl p-6 sm:p-7 border ${config.border} shadow-2xl relative overflow-hidden bg-gradient-to-br ${config.bg}
      `}
    >
      {/* Decorative ambient hologram badge */}
      <div className="absolute top-4 right-4 text-xs font-mono px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-slate-400">
        AI DNA ARCHE-TYPE
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-5">
        {/* Archetype Icon Avatar */}
        <div className="w-16 h-16 rounded-2xl bg-slate-900/90 border border-white/[0.15] flex items-center justify-center text-3xl shadow-xl shadow-black/40 flex-shrink-0">
          {personality.icon}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-extrabold text-white tracking-tight">
              The {personality.type}
            </h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${config.badgeBg} ${config.badgeText}`}>
              DOMINANT PATTERN
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            {config.tagline}
          </p>
        </div>
      </div>

      {/* Archetype Behavioral Summary */}
      <p className="text-slate-300 text-sm leading-relaxed mb-5 bg-black/25 rounded-xl p-4 border border-white/[0.04]">
        {personality.description}
      </p>

      {/* Trait Chips */}
      <div>
        <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2.5">
          Signature Prompting Traits
        </h4>
        <div className="flex flex-wrap gap-2">
          {personality.traits.map((trait) => (
            <span
              key={trait}
              className={`
                px-3 py-1 rounded-xl text-xs font-medium border shadow-xs transition-all hover:scale-105
                ${config.badgeBg} ${config.badgeText}
              `}
            >
              ✦ {trait}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}