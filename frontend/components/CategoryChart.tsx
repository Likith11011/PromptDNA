"use client"

import React from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { CategoryBreakdownItem } from "@/types"

const COLORS = ["#6366f1", "#06b6d4", "#a855f7", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"]

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value?: number
    payload?: CategoryBreakdownItem
  }>
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length && payload[0].payload) {
    const item = payload[0].payload
    return (
      <div className="bg-[#0b0f19] border border-white/[0.12] rounded-xl px-4 py-2.5 shadow-2xl backdrop-blur-xl text-xs">
        <p className="font-bold text-slate-200 capitalize">{item.name}</p>
        <p className="text-cyan-400 font-mono mt-0.5">{item.count} prompts analyzed</p>
      </div>
    )
  }
  return null
}

export default function CategoryChart({ data }: { data: CategoryBreakdownItem[] }) {
  if (data.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-6 text-center border border-white/[0.06]">
        <p className="text-slate-400 text-xs font-mono">No category distribution data recorded yet.</p>
      </div>
    )
  }

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/[0.08] shadow-2xl relative overflow-hidden">
      <div className="mb-4 pb-2 border-b border-white/[0.04]">
        <h4 className="text-white font-bold text-sm flex items-center gap-2">
          <span>📂</span> Category Distribution
        </h4>
        <p className="text-slate-400 text-xs mt-0.5">Prompt breakdown by operational domain</p>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.04)" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#64748b", fontSize: 10, fontFamily: "monospace" }}
              axisLine={{ stroke: "rgba(255, 255, 255, 0.08)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 10, fontFamily: "monospace" }}
              axisLine={{ stroke: "rgba(255, 255, 255, 0.08)" }}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}