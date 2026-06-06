"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { removeToken } from "@/lib/auth"

const navLinks = [
  { href: "/analyze", label: "Analyze", icon: "✦" },
  { href: "/history", label: "History", icon: "◈" },
  { href: "/coaching", label: "Coaching", icon: "◎" },
]

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()

  function handleLogout() {
    removeToken()
    router.push("/auth/login")
  }

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/analyze" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white text-sm font-bold">P</span>
          </div>
          <span className="text-slate-900 font-bold text-lg tracking-tight">
            Prompt<span className="text-indigo-600">DNA</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {navLinks.map(({ href, label, icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${active
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }
                `}
              >
                <span className="text-xs">{icon}</span>
                {label}
              </Link>
            )
          })}
        </div>

        {/* User actions */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          Sign out
        </button>
      </div>
    </nav>
  )
}