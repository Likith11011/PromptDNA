import React from "react"

interface Props {
  category: string
  size?: "sm" | "md" | "lg"
}

const CATEGORY_MAP: Record<
  string,
  { label: string; icon: string; bg: string; text: string; border: string; glow: string }
> = {
  coding: {
    label: "Coding & Dev",
    icon: "⚡",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/30",
    glow: "shadow-blue-500/20",
  },
  writing: {
    label: "Copy & Writing",
    icon: "✍️",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/30",
    glow: "shadow-purple-500/20",
  },
  research: {
    label: "Deep Research",
    icon: "🔬",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
    glow: "shadow-amber-500/20",
  },
  business: {
    label: "Strategy & Biz",
    icon: "💼",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    glow: "shadow-emerald-500/20",
  },
  study: {
    label: "Academic & Study",
    icon: "📚",
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/30",
    glow: "shadow-cyan-500/20",
  },
  creative: {
    label: "Creative Arts",
    icon: "🎨",
    bg: "bg-pink-500/10",
    text: "text-pink-400",
    border: "border-pink-500/30",
    glow: "shadow-pink-500/20",
  },
  general: {
    label: "General Inquiry",
    icon: "💡",
    bg: "bg-slate-500/10",
    text: "text-slate-300",
    border: "border-slate-500/30",
    glow: "shadow-slate-500/10",
  },
}

export default function CategoryBadge({ category, size = "md" }: Props) {
  const normalized = (category || "general").toLowerCase()
  const config = CATEGORY_MAP[normalized] || {
    label: category ? category.charAt(0).toUpperCase() + category.slice(1) : "General",
    icon: "✦",
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    border: "border-indigo-500/30",
    glow: "shadow-indigo-500/20",
  }

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-sm gap-2",
  }[size]

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-lg border backdrop-blur-md shadow-xs
        ${config.bg} ${config.text} ${config.border} ${sizeClasses}
      `}
    >
      <span className="text-xs">{config.icon}</span>
      <span className="tracking-wide font-semibold">{config.label}</span>
    </span>
  )
}