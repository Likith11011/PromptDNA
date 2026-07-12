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
  {
    step: "01",
    title: "Paste Your Prompt",
    description:
      "Enter any prompt you would send to ChatGPT, Claude, or Gemini.",
  },
  {
    step: "02",
    title: "Get Instant Analysis",
    description:
      "PromptDNA scores your prompt across 5 dimensions and predicts success probability.",
  },
  {
    step: "03",
    title: "Receive Improvements",
    description:
      "LLaMA 3.3 70B rewrites your prompt to be significantly more effective.",
  },
  {
    step: "04",
    title: "Track Your Growth",
    description:
      "Your DNA profile updates with every prompt — see your habits and improve over time.",
  },
]

const dimensions = [
  { label: "Clarity", color: "bg-blue-500", score: 85 },
  { label: "Specificity", color: "bg-violet-500", score: 62 },
  { label: "Context", color: "bg-amber-500", score: 45 },
  { label: "Constraints", color: "bg-emerald-500", score: 30 },
  { label: "Examples", color: "bg-pink-500", score: 20 },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">

      {/* Navbar */}
      <nav className="border-b border-white/10 px-6 py-4 sticky top-0 z-50 bg-[#0a0f1e]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white text-sm font-bold">P</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              Prompt<span className="text-blue-400">DNA</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white border border-white/20 hover:border-white/40 transition-all"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg shadow-blue-500/25"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-violet-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-8">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            AI-Powered Prompt Intelligence
          </div>

          {/* Headline */}
          <h1 className="text-6xl sm:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
            Your Prompts,{" "}
            <span className="text-blue-400">
              Supercharged
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Analyze, score, and improve your AI prompts with personalized
            coaching — your intelligent second brain for better AI communication.
          </p>

          {/* CTA buttons */}
          <div className="flex items-center justify-center gap-4 mb-16">
            <Link
              href="/auth/signup"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
            >
              Start for free →
            </Link>
            <Link
              href="/auth/login"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/20 hover:border-white/40 text-gray-300 hover:text-white font-semibold text-sm transition-all"
            >
              Sign in
            </Link>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {features.map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 text-sm hover:border-blue-500/40 hover:text-gray-300 transition-all cursor-default"
              >
                <span className="text-blue-400 text-xs">{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live preview card */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="ml-3 text-gray-500 text-xs">promptdna — analyze</span>
          </div>

          {/* Fake prompt input */}
          <div className="bg-[#0a0f1e] rounded-xl p-4 mb-4 border border-white/5">
            <p className="text-gray-500 text-xs mb-2 font-medium uppercase tracking-wide">Your prompt</p>
            <p className="text-gray-300 text-sm">
              Write a Python function that sorts a list...
            </p>
          </div>

          {/* Score display */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="27" fill="none" stroke="#1f2937" strokeWidth="6" />
                <circle
                  cx="32" cy="32" r="27"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${(42 / 100) * 169.6} 169.6`}
                />
              </svg>
              <span className="absolute text-sm font-bold text-red-400">42</span>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Prompt Score</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                Needs work
              </span>
            </div>
            <div className="ml-auto text-right">
              <p className="text-gray-500 text-xs">Success probability</p>
              <p className="text-red-400 font-bold text-lg">25%</p>
            </div>
          </div>

          {/* Dimension bars */}
          <div className="space-y-2">
            {dimensions.map(({ label, color, score }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">{label}</span>
                  <span className="text-gray-400 font-medium">{score}/20</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${color} rounded-full`}
                    style={{ width: `${(score / 20) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/10 bg-white/[0.02] py-12">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-bold text-blue-400">{value}</p>
              <p className="text-gray-500 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">How it works</h2>
          <p className="text-gray-400 text-lg">Four steps to better AI communication</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorks.map(({ step, title, description }) => (
            <div
              key={step}
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 hover:bg-white/[0.05] transition-all"
            >
              <p className="text-blue-500 font-bold text-xs tracking-widest mb-4">{step}</p>
              <h3 className="text-white font-semibold text-sm mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section className="bg-white/[0.02] border-y border-white/10 py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything you need to prompt better
            </h2>
            <p className="text-gray-400 text-lg">
              Built for students, developers, researchers, and anyone who uses AI daily
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: "📊",
                title: "5-Dimension Scoring",
                desc: "Clarity, Specificity, Context, Constraints, and Examples — scored independently out of 20.",
              },
              {
                icon: "✍️",
                title: "AI Prompt Rewriter",
                desc: "LLaMA 3.3 70B rewrites your weak prompt to be 3x more effective automatically.",
              },
              {
                icon: "🧬",
                title: "PromptDNA Profile",
                desc: "Your personalized AI communication fingerprint — strengths, weaknesses, and personality type.",
              },
              {
                icon: "🎯",
                title: "Success Predictor",
                desc: "Know before you send — predicts how likely your prompt is to get a great AI response.",
              },
              {
                icon: "🔥",
                title: "Weakness Heatmap",
                desc: "Visual breakdown of your recurring prompt mistakes so you know exactly what to fix.",
              },
              {
                icon: "⇄",
                title: "Comparison Mode",
                desc: "Paste two prompts and see which one wins — with a detailed explanation of why.",
              },
              {
                icon: "◎",
                title: "Coaching Engine",
                desc: "Personalized tips based on your actual prompting patterns — not generic advice.",
              },
              {
                icon: "📈",
                title: "Progress Analytics",
                desc: "Score trends, category breakdown, and 4-week improvement tracking in one dashboard.",
              },
              {
                icon: "📋",
                title: "Weekly Reports",
                desc: "Your prompting performance this week vs last week with actionable suggestions.",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-blue-500/20 transition-all group"
              >
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-all">
                  <span className="text-xl">{icon}</span>
                </div>
                <h3 className="text-white font-semibold text-sm mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <div className="bg-gradient-to-br from-blue-600/20 to-violet-600/20 border border-blue-500/20 rounded-3xl p-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Start writing better prompts today
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Free to use. No credit card required.
            Built by an AI/ML student, for everyone who uses AI.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/30"
          >
            Get started for free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <span className="text-gray-400 text-sm font-medium">
              Prompt<span className="text-blue-400">DNA</span>
            </span>
          </div>
          <p className="text-gray-600 text-xs">
            Built by Likith · B.Tech AI/ML · Alliance University, Bengaluru
          </p>
          <div className="flex items-center gap-4">
            
              href="https://github.com/Likith11011/PromptDNA"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white text-sm transition-colors"
            >
              GitHub
            </a>
            <Link href="/auth/login" className="text-gray-500 hover:text-white text-sm transition-colors">
              Login
            </Link>
            <Link href="/auth/signup" className="text-gray-500 hover:text-white text-sm transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </footer>

    </div>
  )
}