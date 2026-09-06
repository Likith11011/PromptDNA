"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/Navbar"
import PersonalityCard from "@/components/PersonalityCard"
import HeatmapBar from "@/components/HeatmapBar"
import WeeklyReportCard from "@/components/WeeklyReportCard"
import api from "@/lib/api"
import { DNAProfile, WeeklyReport, WeeklyTrendPoint } from "@/types"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

const DIM_LABELS: Record<string, string> = {
  clarity: "Clarity",
  specificity: "Specificity",
  context: "Context",
  constraints: "Constraints",
  examples: "Examples",
}

interface DimChartItem {
  name: string
  value: number
  key: string
}

interface CustomWeeklyTooltipProps {
  active?: boolean
  payload?: Array<{
    payload?: WeeklyTrendPoint
  }>
  label?: string | number
}

const WeeklyTooltip = ({ active, payload, label }: CustomWeeklyTooltipProps) => {
  if (active && payload && payload.length && payload[0].payload) {
    const d = payload[0].payload
    return (
      <div className="bg-[#0b0f19] border border-white/[0.12] rounded-xl px-3.5 py-2.5 shadow-2xl backdrop-blur-xl text-xs">
        <p className="font-bold text-slate-200">{label}</p>
        {d.date_range && (
          <p className="text-slate-400 text-[11px] mb-1 font-mono">{d.date_range}</p>
        )}
        {d.has_data ? (
          <>
            <p className="text-cyan-400 font-mono font-bold">{d.avg_score}/100 avg score</p>
            <p className="text-slate-400">{d.count} prompt{d.count !== 1 ? "s" : ""}</p>
          </>
        ) : (
          <p className="text-slate-500 italic">No activity recorded</p>
        )}
      </div>
    )
  }
  return null
}

interface CustomDimTooltipProps {
  active?: boolean
  payload?: Array<{
    value?: number
    payload?: DimChartItem
  }>
}

const DimTooltip = ({ active, payload }: CustomDimTooltipProps) => {
  if (active && payload && payload.length && payload[0].payload) {
    return (
      <div className="bg-[#0b0f19] border border-white/[0.12] rounded-xl px-3.5 py-2 shadow-2xl backdrop-blur-xl text-xs">
        <p className="font-bold text-slate-200">{payload[0].payload.name}</p>
        <p className="text-indigo-400 font-mono mt-0.5">{payload[0].value}/20 score avg</p>
      </div>
    )
  }
  return null
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
      .then(([p, r]) => {
        setProfile(p.data)
        setReport(r.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="glass-panel rounded-2xl p-6 border border-white/[0.06] animate-pulse"
              style={{ height: i === 1 ? 90 : 180 }}
            />
          ))}
        </main>
      </div>
    )
  }

  if (!profile) return null

  const weeklyChartData = profile.weekly_trend.map((w) => ({
    week: w.week,
    date_range: w.date_range,
    avg_score: w.avg_score,
    count: w.count,
    has_data: w.has_data,
  }))

  const dimData: DimChartItem[] = Object.entries(profile.dimension_avgs).map(([key, value]) => ({
    name: DIM_LABELS[key] || key,
    value,
    key,
  }))

  const hasAnyWeeklyData = weeklyChartData.some((w) => w.avg_score > 0)

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🧬</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                PromptDNA Profile Matrix
              </h1>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Personalized AI communication fingerprint calibrated from{" "}
              <strong className="text-cyan-400 font-mono">{profile.total_prompts}</strong> analyzed inputs.
            </p>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {[
            {
              label: "Prompts Analyzed",
              value: profile.total_prompts,
              color: "text-white",
            },
            {
              label: "Average Score",
              value: `${Math.round(profile.avg_score)}/100`,
              color: "text-cyan-400",
            },
            {
              label: "Improvement Trend",
              value: `${profile.trend_pct >= 0 ? "+" : ""}${profile.trend_pct}%`,
              color: profile.trend_pct >= 0 ? "text-emerald-400" : "text-rose-400",
            },
            {
              label: "Dominant Category",
              value: profile.top_categories[0]
                ? profile.top_categories[0].charAt(0).toUpperCase() + profile.top_categories[0].slice(1)
                : "—",
              color: "text-purple-400",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="glass-panel rounded-2xl p-4 text-center border border-white/[0.06] shadow-md"
            >
              <p className={`text-xl sm:text-2xl font-extrabold font-mono ${color}`}>{value}</p>
              <p className="text-[11px] text-slate-400 mt-1 uppercase font-mono tracking-wider">{label}</p>
            </div>
          ))}
        </div>

        {/* Holographic Archetype Card */}
        <PersonalityCard personality={profile.personality} />

        {/* Strengths and Weaknesses Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          
          {/* Strengths */}
          <div className="glass-panel rounded-2xl p-6 border border-emerald-500/25 shadow-xl space-y-4">
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              <span>Identified Core Strengths</span>
            </h3>
            {profile.strengths.length === 0 ? (
              <p className="text-slate-400 text-xs">
                Analyze more prompts in the studio to establish verified strengths.
              </p>
            ) : (
              <div className="space-y-2">
                {profile.strengths.map((s) => (
                  <div
                    key={s}
                    className="flex items-center gap-2.5 bg-emerald-500/10 rounded-xl px-3.5 py-2.5 border border-emerald-500/20"
                  >
                    <span className="text-emerald-400 text-xs font-mono">✓</span>
                    <span className="text-emerald-200 text-xs font-semibold capitalize font-mono">
                      {DIM_LABELS[s] || s} Mastery
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Weaknesses */}
          <div className="glass-panel rounded-2xl p-6 border border-rose-500/25 shadow-xl space-y-4">
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
              <span className="text-rose-400">✗</span>
              <span>Identified Growth Bottlenecks</span>
            </h3>
            {profile.weaknesses.length === 0 ? (
              <p className="text-slate-400 text-xs">
                No critical weaknesses detected in your latest batch. Excellent engineering!
              </p>
            ) : (
              <div className="space-y-2">
                {profile.weaknesses.map((w) => (
                  <div
                    key={w}
                    className="flex items-center gap-2.5 bg-rose-500/10 rounded-xl px-3.5 py-2.5 border border-rose-500/20"
                  >
                    <span className="text-rose-400 text-xs font-mono">⚠️</span>
                    <span className="text-rose-200 text-xs font-semibold capitalize font-mono">
                      Deficit in {DIM_LABELS[w] || w}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Weakness Heatmap */}
        <div className="glass-panel rounded-2xl p-6 sm:p-7 border border-white/[0.08] shadow-2xl space-y-4">
          <div>
            <h3 className="text-white font-bold text-sm tracking-wide">
              Weakness Diagnostic Heatmap
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">
              Deficit severity rating per dimension (Higher score = greater room for optimization)
            </p>
          </div>
          <div className="space-y-2.5 pt-2">
            {Object.entries(profile.heatmap).map(([dim, weakness]) => (
              <HeatmapBar key={dim} dimension={dim} weakness={weakness} />
            ))}
          </div>
        </div>

        {/* Dimension Performance Bar Chart */}
        <div className="glass-panel rounded-2xl p-6 sm:p-7 border border-white/[0.08] shadow-2xl space-y-4">
          <div>
            <h3 className="text-white font-bold text-sm tracking-wide">
              Dimensional Performance Averages
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">
              Historical average score per dimension (max 20 points each)
            </p>
          </div>

          <div className="h-48 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dimData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.04)" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#64748b", fontSize: 10, fontFamily: "monospace" }}
                  axisLine={{ stroke: "rgba(255, 255, 255, 0.08)" }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 20]}
                  tick={{ fill: "#64748b", fontSize: 10, fontFamily: "monospace" }}
                  axisLine={{ stroke: "rgba(255, 255, 255, 0.08)" }}
                  tickLine={false}
                />
                <Tooltip content={<DimTooltip />} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {dimData.map((entry) => (
                    <Cell
                      key={entry.key}
                      fill={
                        entry.value >= 12
                          ? "#10b981"
                          : entry.value >= 8
                          ? "#f59e0b"
                          : "#f43f5e"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4-Week Progress Trend */}
        <div className="glass-panel rounded-2xl p-6 sm:p-7 border border-white/[0.08] shadow-2xl space-y-4">
          <div>
            <h3 className="text-white font-bold text-sm tracking-wide">
              4-Week Performance Trend
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">
              {hasAnyWeeklyData
                ? "Weekly average score progression — Week 1 is baseline, Week 4 is current"
                : "Analyze prompts over multiple days to populate your weekly trend trajectory"}
            </p>
          </div>

          {hasAnyWeeklyData ? (
            <div className="h-48 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyChartData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.04)" />
                  <XAxis
                    dataKey="week"
                    tick={{ fill: "#64748b", fontSize: 10, fontFamily: "monospace" }}
                    axisLine={{ stroke: "rgba(255, 255, 255, 0.08)" }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: "#64748b", fontSize: 10, fontFamily: "monospace" }}
                    axisLine={{ stroke: "rgba(255, 255, 255, 0.08)" }}
                    tickLine={false}
                  />
                  <Tooltip content={<WeeklyTooltip />} />
                  <Bar dataKey="avg_score" radius={[6, 6, 0, 0]}>
                    {weeklyChartData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.has_data ? "#6366f1" : "rgba(255, 255, 255, 0.05)"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center">
              <p className="text-slate-500 font-mono text-xs">
                Continue analyzing prompts to generate weekly longitudinal metrics.
              </p>
            </div>
          )}
        </div>

        {/* Weekly Report Brief */}
        {report && report.total_prompts > 0 && (
          <WeeklyReportCard report={report} />
        )}

      </main>
    </div>
  )
}