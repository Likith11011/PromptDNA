"use client"

import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts"

const LABELS: Record<string, string> = {
  clarity: "Clarity",
  specificity: "Specificity",
  context: "Context",
  constraints: "Constraints",
  examples: "Examples",
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-lg text-sm">
        <p className="font-medium text-slate-700">{payload[0].payload.dimension}</p>
        <p className="text-indigo-600">{payload[0].value}/20</p>
      </div>
    )
  }
  return null
}

export default function DimensionRadar({ averages }: { averages: Record<string, number> }) {
  const data = Object.entries(averages).map(([key, value]) => ({
    dimension: LABELS[key] || key,
    value,
    fullMark: 20,
  }))

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
      <h3 className="text-slate-900 font-semibold text-sm mb-1">Dimension Averages</h3>
      <p className="text-slate-400 text-xs mb-2">Average score per dimension (max 20)</p>
      <ResponsiveContainer width="100%" height={200}>
        <RadarChart data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="dimension" tick={{ fill: "#64748b", fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Radar dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}