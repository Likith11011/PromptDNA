import Link from "next/link"

const features = [
  { icon: "✦", label: "Prompt Scoring" },
  { icon: "◈", label: "AI Improvement" },
  { icon: "🧬", label: "DNA Profile" },
  { icon: "◎", label: "Coaching Engine" },
  { icon: "⇄", label: "Comparison Mode" },
  { icon: "📊", label: "Analytics" },
]

const stats = [
  { value: "5", label: "Dimensions Scored" },
  { value: "100", label: "Point Scale" },
  { value: "AI", label: "Powered Coaching" },
  { value: "Free", label: "To Get Started" },
]

const howItWorks = [
  { step: "01", title: "Paste Your Prompt", description: "Enter any prompt you would send to ChatGPT, Claude, or Gemini." },
  { step: "02", title: "Get Instant Analysis", description: "PromptDNA scores your prompt across 5 dimensions and predicts success probability." },
  { step: "03", title: "Receive Improvements", description: "LLaMA 3.3 70B rewrites your prompt to be significantly more effective." },
  { step: "04", title: "Track Your Growth", description: "Your DNA profile updates with every prompt — see your habits and improve over time." },
]

const featureCards = [
  { icon: "📊", title: "5-Dimension Scoring", desc: "Clarity, Specificity, Context, Constraints, and Examples — scored independently out of 20." },
  { icon: "✍️", title: "AI Prompt Rewriter", desc: "LLaMA 3.3 70B rewrites your weak prompt to be 3x more effective automatically." },
  { icon: "🧬", title: "PromptDNA Profile", desc: "Your personalized AI communication fingerprint — strengths, weaknesses, and personality type." },
  { icon: "🎯", title: "Success Predictor", desc: "Know before you send — predicts how likely your prompt is to get a great AI response." },
  { icon: "🔥", title: "Weakness Heatmap", desc: "Visual breakdown of your recurring prompt mistakes so you know exactly what to fix." },
  { icon: "⇄", title: "Comparison Mode", desc: "Paste two prompts and see which one wins — with a detailed explanation of why." },
  { icon: "◎", title: "Coaching Engine", desc: "Personalized tips based on your actual prompting patterns — not generic advice." },
  { icon: "📈", title: "Progress Analytics", desc: "Score trends, category breakdown, and 4-week improvement tracking in one dashboard." },
  { icon: "📋", title: "Weekly Reports", desc: "This week vs last week performance with actionable coaching suggestions." },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* Navbar */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white text-sm font-bold">P</span>
            </div>
            <span className="text-slate-900 font-bold text-lg tracking-tight">
              Prompt<span className="text-indigo-600">DNA</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all border border-slate-200"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-sm shadow-indigo-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-sm text-indigo-600 font-medium mb-8">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            AI-Powered Prompt Intelligence
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6 tracking-tight text-slate-900">
            Stop Guessing.{" "}
            <span className="text-indigo-600">Start Prompting.</span>
          </h1>

          <p className="text-slate-500 text-xl max-w-2xl mx-auto mb-4 leading-relaxed">
            Most people write weak AI prompts and never know why.
            PromptDNA diagnoses every prompt, scores it scientifically,
            and rewrites it for maximum impact — in seconds.
          </p>

          <p className="text-slate-400 text-base max-w-xl mx-auto mb-10">
            The smarter you prompt, the better your AI results.
            PromptDNA makes you a power user — automatically.
          </p>

          <div className="flex items-center justify-center gap-4 mb-12">
            <Link
              href="/auth/signup"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-sm shadow-indigo-200"
            >
              Analyze your first prompt →
            </Link>
            <Link
              href="/auth/login"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 font-semibold text-sm transition-all bg-white"
            >
              Sign in
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {features.map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-500 text-xs font-medium"
              >
                <span className="text-indigo-500">{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-slate-100 py-12">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-bold text-indigo-600">{value}</p>
              <p className="text-slate-400 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">How it works</h2>
          <p className="text-slate-400 text-lg">Four steps to better AI communication</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {howItWorks.map(({ step, title, description }) => (
            <div
              key={step}
              className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
            >
              <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">
                <span className="text-indigo-600 font-bold text-xs">{step}</span>
              </div>
              <h3 className="text-slate-900 font-semibold text-sm mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-y border-slate-100 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Everything you need to prompt better
            </h2>
            <p className="text-slate-400 text-lg">
              Built for students, developers, and anyone who uses AI daily
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featureCards.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="border border-slate-100 rounded-2xl p-5 hover:border-indigo-200 hover:shadow-sm transition-all group bg-slate-50"
              >
                <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm border border-slate-100 group-hover:border-indigo-100 transition-all">
                  <span className="text-lg">{icon}</span>
                </div>
                <h3 className="text-slate-800 font-semibold text-sm mb-1.5">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="bg-indigo-600 rounded-3xl p-12 shadow-lg shadow-indigo-200">
          <h2 className="text-3xl font-bold text-white mb-3">
            Your prompts deserve to be better
          </h2>
          <p className="text-indigo-200 text-lg mb-8">
            Join PromptDNA and start communicating with AI like a pro.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white hover:bg-slate-50 text-indigo-600 font-semibold text-sm transition-all shadow-sm"
          >
            Get started →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <span className="text-slate-600 text-sm font-medium">
              Prompt<span className="text-indigo-600">DNA</span>
            </span>
          </div>
          <p className="text-slate-400 text-xs">
            © 2025 PromptDNA · All rights reserved
          </p>
          <div className="flex items-center gap-5">
            <Link href="/auth/login" className="text-slate-400 hover:text-slate-700 text-sm transition-colors">Login</Link>
            <Link href="/auth/signup" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}