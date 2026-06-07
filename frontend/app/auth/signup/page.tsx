"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import api from "@/lib/api"
import { saveToken } from "@/lib/auth"
import { TokenResponse } from "@/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [serverStatus, setServerStatus] = useState<"checking" | "online" | "waking">("checking")

  // Check if backend is alive on mount
  useEffect(() => {
    checkServer()
  }, [])

  async function checkServer() {
    setServerStatus("checking")
    try {
      await fetch(`${API_URL}/health`, { signal: AbortSignal.timeout(8000) })
      setServerStatus("online")
    } catch {
      setServerStatus("waking")
      // Retry every 5 seconds until online
      setTimeout(checkServer, 5000)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit() {
    if (serverStatus === "waking") {
      setError("Server is still waking up. Please wait a moment and try again.")
      return
    }
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
        name: form.name,
        email: form.email,
        password: form.password,
      })

      const loginRes = await api.post<TokenResponse>("/auth/login", {
        email: form.email,
        password: form.password,
      })

      saveToken(loginRes.data.access_token)
      router.push("/analyze")

    } catch (err: unknown) {
      console.error("Signup error:", err)

      const axiosErr = err as {
        response?: { data?: { detail?: string }; status?: number }
        code?: string
      }

      if (axiosErr.code === "ERR_NETWORK" || axiosErr.code === "ECONNABORTED") {
        setError("Cannot reach the server. The backend may be starting up — wait 30 seconds and try again.")
        setServerStatus("waking")
        setTimeout(checkServer, 3000)
      } else if (axiosErr.response?.status === 409) {
        setError("An account with this email already exists. Try logging in instead.")
      } else if (axiosErr.response?.status === 422) {
        setError("Invalid email format. Please check your email address.")
      } else if (axiosErr.response?.data?.detail) {
        setError(axiosErr.response.data.detail)
      } else {
        setError(`Signup failed (${axiosErr.response?.status || "network error"}). Try again.`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 mb-4">
            <span className="text-white text-xl font-bold">P</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Join <span className="text-indigo-600">PromptDNA</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Start writing better AI prompts today
          </p>
        </div>

        {/* Server status banner */}
        {serverStatus === "checking" && (
          <div className="mb-4 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-2 text-slate-500 text-sm">
            <svg className="animate-spin h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Connecting to server...
          </div>
        )}

        {serverStatus === "waking" && (
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2 text-amber-700 text-sm">
            <span className="flex-shrink-0 mt-0.5">⏳</span>
            <div>
              <p className="font-medium">Server is waking up</p>
              <p className="text-amber-600 text-xs mt-0.5">
                Free tier servers sleep after inactivity. This takes 30–60 seconds.
                The page will update automatically when ready.
              </p>
            </div>
          </div>
        )}

        {serverStatus === "online" && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center gap-2 text-emerald-600 text-sm">
            <span>✓</span> Server is online
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-red-600 text-sm flex items-start gap-2">
              <span className="flex-shrink-0 mt-0.5">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {[
            { label: "Full name", name: "name", type: "text", placeholder: "Your name" },
            { label: "Email address", name: "email", type: "email", placeholder: "you@example.com" },
            { label: "Password", name: "password", type: "password", placeholder: "Min 6 characters" },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <label className="block text-slate-700 text-sm font-medium mb-1.5">
                {label}
              </label>
              <input
                name={name}
                type={type}
                placeholder={placeholder}
                value={form[name as keyof typeof form]}
                onChange={handleChange}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                disabled={serverStatus === "waking"}
                className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 rounded-xl px-4 py-3 text-sm border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          ))}

          <button
            onClick={handleSubmit}
            disabled={loading || serverStatus === "waking" || serverStatus === "checking"}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all shadow-sm shadow-indigo-200 mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Creating account...
              </span>
            ) : serverStatus === "waking" ? (
              "Waiting for server..."
            ) : serverStatus === "checking" ? (
              "Connecting..."
            ) : (
              "Create Account"
            )}
          </button>

          <p className="text-center text-slate-400 text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}