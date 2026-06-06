"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/Navbar"
import PersonalityCard from "@/components/PersonalityCard"
import HeatmapBar from "@/components/HeatmapBar"
import WeeklyReportCard from "@/components/WeeklyReportCard"
import api from "@/lib/api"
import { DNAProfile, WeeklyReport } from "@/types"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from "recharts"

const DIM_LABELS: Record<string, string> = {
  clarity: "Clarity", specificity: "Specificity",
  context: "Context", constraints: "Constraints", examples: "Examples",
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<DNAProfile | null>(null)
  const [report, setReport] = useState<WeeklyReport | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<DNAProfile>("/profile/dna"),
      api.get<WeeklyReport>("/profile/weekly-report"),
    ])
      .then(([p, r]) => { setProfile(p.data); setReport(r.data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-10">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 animate-pulse h-32" />
            ))}
          </div>
        </main>
      </div>
    )
  }

  if (!profile) return null

  const weeklyChartData = profile.weekly_trend.map((w) => ({
    week: w.week,
    score: w.avg_score,
    count: w.count,
  }))

  const dimData = Object.entries(profile.dimension_avgs).map(([key, value]) => ({
    name: DIM_LABELS[key] || key,
    value,
    key,
  }))

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">

        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Your PromptDNA Profile</h2>
          <p className="text-slate-400 text-sm mt-1">
            Your personalized AI communication profile based on {profile.total_prompts} analyzed prompts.
          </p>
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Prompts Analyzed", value: profile.total_prompts, color: "text-slate-900" },
            { label: "Average Score", value: `${Math.round(profile.avg_score)}/100`, color: "text-indigo-600" },
            {
              label: "Improvement Trend",
              value: `${profile.trend_pct >= 0 ? "+" : ""}${profile.trend_pct}%`,
              color: profile.trend_pct >= 0 ? "text-emerald-600" : "text-red-500"
            },
            {
              label: "Top Category",
              value: profile.top_categories[0] || "—",
              color: "text-violet-600"
            },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white border border-slate-100 rounded-2xl p-4 text-center shadow-sm">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-slate-400 text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Personality card */}
        <PersonalityCard personality={profile.personality} />

        {/* Strengths and weaknesses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <h3 className="text-slate-700 font-semibold text-sm mb-4 flex items-center gap-2">
              <span className="text-emerald-500">✓</span> Strengths
            </h3>
            {profile.strengths.length === 0 ? (
              <p className="text-slate-400 text-sm">Analyze more prompts to discover your strengths.</p>
            ) : (
              <div className="space-y-2">
                {profile.strengths.map((s) => (
                  <div key={s} className="flex items-center gap-2 bg-emerald-50 rounded-lg px-3 py-2 border border-emerald-100">
                    <span className="text-emerald-500 text-xs">✓</span>
                    <span className="text-emerald-700 text-sm font-medium capitalize">{DIM_LABELS[s] || s}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <h3 className="text-slate-700 font-semibold text-sm mb-4 flex items-center gap-2">
              <span className="text-red-500">✗</span> Weaknesses
            </h3>
            {profile.weaknesses.length === 0 ? (
              <p className="text-slate-400 text-sm">No significant weaknesses detected. Keep it up!</p>
            ) : (
              <div className="space-y-2">
                {profile.weaknesses.map((w) => (
                  <div key={w} className="flex items-center gap-2 bg-red-50 rounded-lg px-3 py-2 border border-red-100">
                    <span className="text-red-400 text-xs">✗</span>
                    <span className="text-red-600 text-sm font-medium capitalize">{DIM_LABELS[w] || w}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Weakness Heatmap */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-slate-900 font-semibold text-sm mb-1">Weakness Heatmap</h3>
          <p className="text-slate-400 text-xs mb-5">
            Higher fill = more room to improve. Green = strong, Red = needs attention.
          </p>
          <div className="space-y-3">
            {Object.entries(profile.heatmap).map(([dim, weakness]) => (
              <HeatmapBar key={dim} dimension={dim} weakness={weakness} />
            ))}
          </div>
        </div>

        {/* Dimension averages bar chart */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-slate-900 font-semibold text-sm mb-1">Dimension Performance</h3>
          <p className="text-slate-400 text-xs mb-5">Average score per dimension (out of 20)</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={dimData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 20]} tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: 12 }}
                formatter={(v) => [`${v}/20`, "Avg Score"]}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {dimData.map((entry) => (
                  <Cell
                    key={entry.key}
                    fill={entry.value >= 12 ? "#22c55e" : entry.value >= 8 ? "#f59e0b" : "#ef4444"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly trend */}
        {weeklyChartData.some((w) => w.score > 0) && (
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-slate-900 font-semibold text-sm mb-1">4-Week Trend</h3>
            <p className="text-slate-400 text-xs mb-5">Your weekly average score over the past 4 weeks</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={weeklyChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: 12 }}
                  formatter={(v, _, props: any) => [
                    `${v}/100 (${props.payload.count} prompts)`,
                    "Avg Score",
                    ]}
                />
                <Bar dataKey="score" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Weekly report */}
        {report && report.total_prompts > 0 && (
          <WeeklyReportCard report={report} />
        )}

      </main>
    </div>
  )
}