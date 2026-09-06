"use client"

import React from "react"
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts"

const LABELS: Record<string, string> = {
  clarity: "Clarity",
  specificity: "Specificity",
  context: "Context",
  constraints: "Constraints",
  examples: "Examples",
}

interface RadarItem {
  dimension: string
  value: number
  fullMark: number
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value?: number
    payload?: RadarItem
  }>
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length && payload[0].payload) {
    const item = payload[0].payload
    return (
      <div className="bg-[#0b0f19] border border-white/[0.12] rounded-xl px-3.5 py-2 shadow-2xl backdrop-blur-xl text-xs">
        <p className="font-bold text-slate-200">{item.dimension}</p>
        <p className="text-indigo-400 font-mono mt-0.5">{item.value}/20 score avg</p>
      </div>
    )
  }
  return null
}

export default function DimensionRadar({ averages }: { averages: Record<string, number> }) {
  const data: RadarItem[] = Object.entries(averages).map(([key, value]) => ({
    dimension: LABELS[key] || key,
    value,
    fullMark: 20,
  }))

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/[0.08] shadow-2xl relative overflow-hidden">
      <div className="mb-4 pb-2 border-b border-white/[0.04]">
        <h4 className="text-white font-bold text-sm flex items-center gap-2">
          <span>🕸️</span> 5D Balance Radar
        </h4>
        <p className="text-slate-400 text-xs mt-0.5">Equilibrium across core prompting dimensions</p>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="rgba(255, 255, 255, 0.08)" />
            <PolarAngleAxis dataKey="dimension" tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "monospace" }} />
            <Tooltip content={<CustomTooltip />} />
            <Radar
              dataKey="value"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.25}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}