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
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit() {
    setError("")
    setLoading(true)
    try {
      await api.post("/auth/signup", form)
      const loginRes = await api.post<TokenResponse>("/auth/login", {
        email: form.email,
        password: form.password,
      })
      saveToken(loginRes.data.access_token)
      router.push("/analyze")
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setError(msg || "Signup failed. Try again.")
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
          <p className="text-slate-400 text-sm mt-2">Start writing better AI prompts today</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-red-600 text-sm flex items-center gap-2">
              <span>⚠</span> {error}
            </div>
          )}

          {[
            { label: "Full name", name: "name", type: "text", placeholder: "Your Name" },
            { label: "Email address", name: "email", type: "email", placeholder: "you@example.com" },
            { label: "Password", name: "password", type: "password", placeholder: "Min 8 characters" },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <label className="block text-slate-700 text-sm font-medium mb-1.5">{label}</label>
              <input
                name={name}
                type={type}
                placeholder={placeholder}
                value={form[name as keyof typeof form]}
                onChange={handleChange}
                className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 rounded-xl px-4 py-3 text-sm border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
            </div>
          ))}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold text-sm transition-all shadow-sm shadow-indigo-200 mt-2"
          >
            {loading ? "Creating account..." : "Create Account"}
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