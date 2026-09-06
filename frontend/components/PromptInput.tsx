"use client"

import { useState, useRef } from "react"
import { PromptResult } from "@/types"
import api from "@/lib/api"

interface Props {
  onResult: (result: PromptResult) => void
  initialValue?: string
}

const TEMPLATES = [
  {
    label: "⚡ Code Refactor",
    category: "coding",
    prompt: "Refactor this TypeScript function for high throughput and O(n) time complexity. Ensure strict type safety, zero memory leaks, and add clear JSDoc comments.",
  },
  {
    label: "🔬 Research Synthesis",
    category: "research",
    prompt: "Synthesize the core mechanisms of transformer attention mechanisms into 3 key takeaways. Contrast multi-head attention with grouped-query attention in bullet format.",
  },
  {
    label: "🎯 System Prompt",
    category: "writing",
    prompt: "Act as a Principal Staff Software Architect. Review this proposed distributed microservices architecture for race conditions, idempotency failures, and high-availability bottlenecks.",
  },
  {
    label: "💼 Executive Brief",
    category: "business",
    prompt: "Draft a concise 2-paragraph executive summary for our Q3 AI roadmap. Emphasize cost reduction via open-weight LLMs, latency improvements, and target ROI milestones.",
  },
  {
    label: "🐛 Debugging Assistant",
    category: "coding",
    prompt: "Identify the root cause of this PostgreSQL deadlock under concurrent write transactions. Provide both immediate query workarounds and long-term indexing strategies.",
  },
]

export default function PromptInput({ onResult, initialValue = "" }: Props) {
  const [prompt, setPrompt] = useState(initialValue)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeModel, setActiveModel] = useState("openai/gpt-oss-120b")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const charCount = prompt.length
  const wordCount = prompt.trim() ? prompt.trim().split(/\s+/).length : 0
  const estimatedTokens = Math.ceil(charCount / 4)

  async function handleAnalyze() {
    if (!prompt.trim()) {
      setError("Please input a prompt to analyze.")
      return
    }
    setError("")
    setLoading(true)
    try {
      const res = await api.post<PromptResult>("/prompts/analyze", { prompt: prompt.trim() })
      onResult(res.data)
    } catch {
      setError("Analysis failed. Please verify your session and try again.")
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault()
      handleAnalyze()
    }
  }

  function applyTemplate(templatePrompt: string) {
    setPrompt(templatePrompt)
    setError("")
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/[0.08] relative overflow-hidden shadow-2xl shadow-indigo-950/30">
      
      {/* Decorative top accent glow */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-cyan-400 opacity-80" />

      {/* Header controls & template picker */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <h3 className="text-white font-bold text-sm tracking-wide flex items-center gap-2">
              Prompt Input Studio
            </h3>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            Type or load a prompt template to diagnose weaknesses across 5 dimensions.
          </p>
        </div>

        {/* Model Target Tag */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-white/[0.06] text-xs">
          <span className="text-slate-500 text-[10px] uppercase font-mono px-1">Engine:</span>
          {["openai/gpt-oss-120b", "openai/gpt-oss-20b", "Claude 3.5"].map((m) => (
            <button
              key={m}
              onClick={() => setActiveModel(m)}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-all ${
                activeModel === m
                  ? "bg-indigo-600 text-white shadow-xs font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Templates Drawer */}
      <div className="mb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          <span className="text-[11px] text-slate-500 font-mono flex-shrink-0 flex items-center gap-1">
            <span>✨ Presets:</span>
          </span>
          {TEMPLATES.map((t) => (
            <button
              key={t.label}
              onClick={() => applyTemplate(t.prompt)}
              className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-indigo-500/10 border border-white/[0.06] hover:border-indigo-500/30 text-slate-300 hover:text-indigo-300 text-xs font-medium transition-all"
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Textarea container */}
      <div className="relative rounded-xl overflow-hidden group">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste or write your prompt here... (e.g., 'Act as an expert Python engineer and build a FastAPI JWT authentication system with rate limiting...')"
          rows={5}
          className="w-full bg-[#080b13] text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3.5 text-sm resize-y min-h-[130px] border border-white/[0.09] focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all leading-relaxed font-sans"
        />

        {prompt && (
          <button
            onClick={() => setPrompt("")}
            title="Clear text"
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white text-xs transition-all opacity-0 group-hover:opacity-100"
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* Bottom Metadata & Metrics Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-white/[0.05]">
        
        {/* Token and Char metrics */}
        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <strong className="text-slate-200 font-semibold">{charCount}</strong> chars
          </span>
          <span className="text-slate-600">/</span>
          <span>
            <strong className="text-slate-200 font-semibold">{wordCount}</strong> words
          </span>
          <span className="text-slate-600">/</span>
          <span className="px-1.5 py-0.5 rounded bg-white/[0.04] text-cyan-300">
            ~{estimatedTokens} tokens
          </span>
        </div>

        {/* Error or shortcut helper */}
        <div className="text-xs">
          {error ? (
            <span className="text-rose-400 flex items-center gap-1 font-medium">
              <span>⚠️</span> {error}
            </span>
          ) : (
            <span className="hidden sm:inline text-slate-500 text-[11px]">
              Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-slate-300 font-mono text-[10px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-slate-300 font-mono text-[10px]">Enter</kbd> to analyze
            </span>
          )}
        </div>
      </div>

      {/* Action Submit Button */}
      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="mt-4 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm tracking-wide transition-all duration-200 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/50 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
      >
        {loading ? (
          <div className="flex items-center gap-3">
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span>Analyzing Prompt with openai/gpt-oss-120b...</span>
          </div>
        ) : (
          <>
            <svg className="w-5 h-5 text-cyan-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Diagnose & Optimize Prompt</span>
            <span className="text-indigo-200 text-xs">→</span>
          </>
        )}
      </button>

    </div>
  )
}