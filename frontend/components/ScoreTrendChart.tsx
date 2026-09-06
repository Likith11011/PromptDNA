"use client"

import React from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { ScoreTrendPoint } from "@/types"

interface Props {
  data: ScoreTrendPoint[]
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value?: number
    payload?: ScoreTrendPoint
  }>
  label?: string | number
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const score = payload[0].value ?? 0
    const color = score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#f43f5e"
    return (
      <div className="bg-[#0b0f19] border border-white/[0.12] rounded-xl px-4 py-3 shadow-2xl backdrop-blur-xl">
        <p className="text-slate-400 font-mono text-xs mb-1">Prompt #{label}</p>
        <p className="font-extrabold font-mono text-sm" style={{ color }}>
          Score: {score}/100
        </p>
      </div>
    )
  }
  return null
}

export default function ScoreTrendChart({ data }: Props) {
  if (data.length < 2) {
    return (
      <div className="glass-panel rounded-2xl p-6 text-center border border-white/[0.06]">
        <p className="text-slate-400 text-xs font-mono">
          Analyze at least 2 prompts to unlock real-time score trajectory tracking.
        </p>
      </div>
    )
  }

  const avg = Math.round(data.reduce((s, d) => s + d.score, 0) / data.length)

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/[0.08] shadow-2xl relative overflow-hidden">
      
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/[0.04]">
        <div>
          <h4 className="text-white font-bold text-sm tracking-wide flex items-center gap-2">
            <span>📈</span> Prompt Score Trajectory
          </h4>
          <p className="text-slate-400 text-xs mt-0.5">Historical quality evolution over time</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Mean Score</p>
          <p className="text-base font-extrabold font-mono text-cyan-400">{avg}/100</p>
        </div>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.04)" />
            <XAxis
              dataKey="index"
              tick={{ fill: "#64748b", fontSize: 11, fontFamily: "monospace" }}
              axisLine={{ stroke: "rgba(255, 255, 255, 0.08)" }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "#64748b", fontSize: 11, fontFamily: "monospace" }}
              axisLine={{ stroke: "rgba(255, 255, 255, 0.08)" }}
              tickLine={false}
            />
            <ReferenceLine
              y={avg}
              stroke="#6366f1"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#06b6d4"
              strokeWidth={3}
              dot={{ r: 4, fill: "#6366f1", stroke: "#0b0f19", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#06b6d4", stroke: "#fff", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mt-3 pt-2 border-t border-white/[0.03]">
        <span>First prompt ({data[0]?.score || 0} pts)</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-0.5 bg-indigo-500" />
          <span>Average line ({avg} pts)</span>
        </span>
        <span>Latest prompt ({data[data.length - 1]?.score || 0} pts)</span>
      </div>

    </div>
  )
}