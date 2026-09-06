"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import api from "@/lib/api"
import { saveToken } from "@/lib/auth"
import { TokenResponse } from "@/types"

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit() {
    if (!form.email || !form.password) {
      setError("Email and password are required.")
      return
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    setError("")
    setLoading(true)

    try {
      await api.post("/auth/signup", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      })

      const loginRes = await api.post<TokenResponse>("/auth/login", {
        email: form.email.trim(),
        password: form.password,
      })

      saveToken(loginRes.data.access_token)
      router.push("/analyze")
    } catch (err: unknown) {
      let message = "Signup failed. Please try again."

      const e = err as {
        response?: {
          status?: number
          data?: { detail?: unknown }
        }
        code?: string
      }

      if (e?.response?.status === 409) {
        message = "An account with this email already exists. Try signing in."
      } else if (e?.response?.status === 422) {
        message = "Invalid email format. Please check your address."
      } else if (typeof e?.response?.data?.detail === "string") {
        message = e.response.data.detail
      } else if (e?.code === "ECONNABORTED" || e?.code === "ERR_NETWORK") {
        message = "Connection error. Please ensure backend server is running."
      }

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex items-center justify-center px-4 py-12 relative overflow-hidden bg-cyber-grid">
      
      {/* Ambient glow backdrop */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-2 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-400 p-[1px] shadow-xl shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0d121f] rounded-[15px] flex items-center justify-center">
                <svg className="w-5 h-5 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Prompt<span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">DNA</span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Create Free Account
          </h1>
          <p className="text-slate-400 text-xs">
            Unlock multi-dimensional scoring, openai/gpt-oss-120b optimizer, and behavioral coaching.
          </p>
        </div>

        {/* Signup Card */}
        <div className="glass-panel rounded-3xl border border-white/[0.08] shadow-2xl p-7 sm:p-8 space-y-5 bg-gradient-to-b from-[#0e1424] to-[#080b13]">
          
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium flex items-center gap-2 animate-fade-in">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-slate-300 text-xs font-semibold mb-1.5 font-mono">
                FULL NAME
              </label>
              <input
                name="name"
                type="text"
                placeholder="Likith B"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-[#070a12] text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 text-sm border border-white/[0.08] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-sans"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-slate-300 text-xs font-semibold mb-1.5 font-mono">
                EMAIL ADDRESS
              </label>
              <input
                name="email"
                type="email"
                placeholder="name@company.com"
                value={form.email}
                onChange={handleChange}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full bg-[#070a12] text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 text-sm border border-white/[0.08] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-sans"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-slate-300 text-xs font-semibold font-mono">
                  PASSWORD
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-slate-400 hover:text-slate-200 font-mono"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min 6 characters"
                value={form.password}
                onChange={handleChange}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full bg-[#070a12] text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 text-sm border border-white/[0.08] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-sans"
              />
            </div>

          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Creating Account...
              </span>
            ) : (
              "Initialize PromptDNA →"
            )}
          </button>

          {/* Signin Link */}
          <p className="text-center text-xs text-slate-400 pt-2 border-t border-white/[0.04]">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-cyan-400 hover:text-cyan-300 font-semibold">
              Sign in
            </Link>
          </p>

        </div>

      </div>
    </div>
  )
}