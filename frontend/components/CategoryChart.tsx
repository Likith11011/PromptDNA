"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { CategoryBreakdownItem } from "@/types"

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#22c55e", "#06b6d4", "#ef4444"]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-lg text-sm">
        <p className="font-medium text-slate-700">{payload[0].payload.name}</p>
        <p className="text-indigo-600">{payload[0].value} prompts</p>
      </div>
    )
  }
  return null
}

export default function CategoryChart({ data }: { data: CategoryBreakdownItem[] }) {
  if (data.length === 0) {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-6 text-center shadow-sm">
        <p className="text-slate-400 text-sm">No category data yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
      <h3 className="text-slate-900 font-semibold text-sm mb-1">Prompts by Category</h3>
      <p className="text-slate-400 text-xs mb-5">Distribution across all your prompts</p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}