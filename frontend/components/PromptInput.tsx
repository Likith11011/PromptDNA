"use client"

import { useState } from "react"
import { PromptResult } from "@/types"
import api from "@/lib/api"

interface Props {
  onResult: (result: PromptResult) => void
}

export default function PromptInput({ onResult }: Props) {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleAnalyze() {
    if (!prompt.trim()) {
      setError("Please enter a prompt before analyzing.")
      return
    }
    setError("")
    setLoading(true)
    try {
      const res = await api.post<PromptResult>("/prompts/analyze", { prompt: prompt.trim() })
      onResult(res.data)
    } catch {
      setError("Something went wrong. Make sure you are logged in.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
      <label className="block text-slate-700 font-semibold text-sm mb-3">
        Enter your prompt
      </label>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g. Write a Python function that sorts a list of dictionaries by a specific key..."
        rows={5}
        className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 rounded-xl px-4 py-3 text-sm resize-none border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
      />
      <div className="flex items-center justify-between mt-2">
        <p className={`text-xs ${error ? "text-red-500" : "text-slate-400"}`}>
          {error || `${prompt.length} characters`}
        </p>
      </div>
      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="mt-4 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all shadow-sm shadow-indigo-200"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Analyzing...
          </span>
        ) : (
          "Analyze Prompt →"
        )}
      </button>
    </div>
  )
}