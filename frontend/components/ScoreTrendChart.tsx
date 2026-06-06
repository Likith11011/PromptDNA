"use client"

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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const score = payload[0].value
    const color = score >= 75 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444"
    return (
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-lg">
        <p className="text-gray-500 text-xs mb-1">Prompt #{label}</p>
        <p className="font-bold text-sm" style={{ color }}>
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
      <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm">
        <p className="text-gray-400 text-sm">
          Analyze at least 2 prompts to see your score trend.
        </p>
      </div>
    )
  }

  const avg = Math.round(data.reduce((s, d) => s + d.score, 0) / data.length)

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-gray-900 font-semibold text-sm">Score Trend</h3>
          <p className="text-gray-400 text-xs mt-0.5">Your prompt quality over time</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Average</p>
          <p className="text-lg font-bold text-indigo-600">{avg}/100</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="index"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            label={{
              value: "Prompt #",
              position: "insideBottomRight",
              offset: -5,
              fill: "#94a3b8",
              fontSize: 10,
            }}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <ReferenceLine
            y={avg}
            stroke="#818cf8"
            strokeDasharray="4 4"
            strokeWidth={1}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#6366f1"
            strokeWidth={2.5}
            dot={(props) => {
              const { cx, cy, payload } = props
              const color =
                payload.score >= 75
                  ? "#22c55e"
                  : payload.score >= 50
                  ? "#f59e0b"
                  : "#ef4444"
              return (
                <circle
                  key={payload.index}
                  cx={cx}
                  cy={cy}
                  r={4}
                  fill={color}
                  stroke="white"
                  strokeWidth={2}
                />
              )
            }}
            activeDot={{ r: 6, fill: "#6366f1", stroke: "white", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}