"use client"

import { useState } from "react"
import Link from "next/link"
import CategoryBadge from "@/components/CategoryBadge"

const DEMO_PRESETS = [
  {
    title: "Vague Coding Prompt",
    category: "coding",
    raw: "make a todo app with react",
    score: 36,
    scores: { clarity: 10, specificity: 6, context: 8, constraints: 6, examples: 6 },
    improved:
      "Build a production-ready Todo List application using React 19, TypeScript, and Tailwind CSS. Implement optimistic UI updates, local storage persistence, priority tagging, and full keyboard accessibility. Include code snippets with type definitions.",
    coachingTip: "Specify framework versions, state persistence requirements, and edge-case behaviors to eliminate guesswork.",
  },
  {
    title: "Vague Business Pitch",
    category: "business",
    raw: "write an email to investors for funding",
    score: 42,
    scores: { clarity: 12, specificity: 8, context: 10, constraints: 6, examples: 6 },
    improved:
      "Draft a high-conversion 150-word cold outreach email to Tier-1 SaaS Angel Investors for our Pre-Seed round ($500k at $4M cap). Highlight our 35% MoM ARR growth, 12,000 active developers, and our moat in automated LLM benchmarking. Conclude with a clear 15-min call ask.",
    coachingTip: "Always ground investor communications with concrete traction metrics, round parameters, and a direct time-bounded call-to-action.",
  },
  {
    title: "Vague Research Query",
    category: "research",
    raw: "explain quantum computing simply",
    score: 48,
    scores: { clarity: 14, specificity: 10, context: 10, constraints: 8, examples: 6 },
    improved:
      "Explain the fundamental principles of quantum computing (superposition and entanglement) to a 1st-year computer science student. Use a spinning coin analogy, contrast with classical binary bits, and explain why RSA encryption is vulnerable in under 300 words.",
    coachingTip: "Establish target audience depth, use concrete analogies, and set explicit word-count limits.",
  },
]

const FEATURES = [
  {
    icon: "⚡",
    title: "5-Dimensional Scientific Scoring",
    description: "Evaluates Clarity, Specificity, Context, Constraints, and Few-Shot Examples independently on a 0–100 scale.",
    badge: "0-100 Metric",
  },
  {
    icon: "🧠",
    title: "openai/gpt-oss-120b Prompt Optimizer",
    description: "Instantly transforms underspecified prompts into high-precision, zero-hallucination execution blueprints.",
    badge: "Open Weights",
  },
  {
    icon: "🧬",
    title: "PromptDNA Archetype Fingerprint",
    description: "Discovers your unique communication style (Architect, Researcher, Builder, Creator, Explorer) based on your prompting habits.",
    badge: "Behavioral AI",
  },
  {
    icon: "🔥",
    title: "Weakness Heatmap & Deficit Radar",
    description: "Visualizes recurring patterns where your prompts lose clarity or omit critical boundaries.",
    badge: "Visual Diagnostics",
  },
  {
    icon: "⚔️",
    title: "A/B Prompt Arena & Battle",
    description: "Test two prompt variations side-by-side to determine which gets superior LLM reasoning and precision.",
    badge: "Head-to-Head",
  },
  {
    icon: "🎯",
    title: "Adaptive Coaching Directives",
    description: "Personalized AI feedback engine that learns from your daily inputs and teaches you power-user techniques.",
    badge: "Personal Coach",
  },
]

const ARCHETYPES = [
  { type: "Architect", icon: "📐", trait: "Systematic & Constraints-Heavy", color: "border-blue-500/30 text-blue-400 bg-blue-500/10" },
  { type: "Researcher", icon: "🔬", trait: "Context-Rich & Hypothesis-Driven", color: "border-purple-500/30 text-purple-400 bg-purple-500/10" },
  { type: "Builder", icon: "🛠️", trait: "Code-Centric & Functionally Pragmatic", color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" },
  { type: "Creator", icon: "🎨", trait: "Expressive & Expansive Ideator", color: "border-pink-500/30 text-pink-400 bg-pink-500/10" },
  { type: "Explorer", icon: "🧭", trait: "Iterative & Experimental Prober", color: "border-amber-500/30 text-amber-400 bg-amber-500/10" },
]

export default function LandingPage() {
  const [selectedDemoIndex, setSelectedDemoIndex] = useState(0)
  const currentDemo = DEMO_PRESETS[selectedDemoIndex]

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-indigo-500 selection:text-white relative">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#07090e]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-[#0d121f] rounded-[11px] flex items-center justify-center">
                <svg className="w-4 h-4 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              Prompt<span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">DNA</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              Get Started Free →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 overflow-hidden">
        {/* Glow backdrop circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          {/* Badge indicator */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono mb-8 backdrop-blur-md shadow-lg shadow-indigo-500/10">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>AI Prompt Intelligence & Behavioral Analytics Engine</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white">
            Stop Guessing. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
              Master the Science of Prompting.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            90% of AI prompts fail because of missing constraints and ambiguous context.
            PromptDNA evaluates your prompt across 5 dimensions, predicts success rates,
            and rewrites it using openai/gpt-oss-120b for maximum impact.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link
              href="/auth/signup"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>⚡ Analyze Your Prompt Now</span>
              <span className="text-cyan-200">→</span>
            </Link>
            <Link
              href="/auth/login"
              className="px-7 py-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-slate-200 hover:text-white font-semibold text-sm transition-all backdrop-blur-md"
            >
              Explore Live Workspace
            </Link>
          </div>

          {/* Live Metric Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {[
              { val: "5 Dimensions", label: "Diagnostic Scoring Engine" },
              { val: "0–100 Scale", label: "Multi-factor Precision" },
              { val: "GPT-OSS 120B", label: "Automated Rewriter" },
              { val: "100% Free", label: "Open AI Coaching" },
            ].map(({ val, label }) => (
              <div key={label} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md text-center">
                <p className="text-xl sm:text-2xl font-extrabold font-mono text-cyan-300">{val}</p>
                <p className="text-xs text-slate-400 mt-1">{label}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Interactive Live Playground Simulator */}
      <section className="py-16 px-6 max-w-6xl mx-auto relative z-10">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/[0.1] shadow-2xl relative overflow-hidden bg-gradient-to-b from-[#0e1322] to-[#070a12]">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06] mb-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Interactive Intelligence Simulator
                </h2>
              </div>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Select a sample weak prompt below to see how PromptDNA diagnoses and rewrites it in real-time.
              </p>
            </div>

            {/* Preset Selector Chips */}
            <div className="flex flex-wrap gap-2">
              {DEMO_PRESETS.map((demo, idx) => (
                <button
                  key={demo.title}
                  onClick={() => setSelectedDemoIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedDemoIndex === idx
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/40"
                      : "bg-white/[0.04] text-slate-400 hover:text-slate-200 border border-white/[0.06]"
                  }`}
                >
                  {demo.title}
                </button>
              ))}
            </div>
          </div>

          {/* Simulator Live Output Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Input & Score Meter */}
            <div className="lg:col-span-5 space-y-5">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase text-slate-400">Original Prompt Input</span>
                  <CategoryBadge category={currentDemo.category} size="sm" />
                </div>
                <p className="text-sm font-mono text-slate-200 bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">
                  &quot;{currentDemo.raw}&quot;
                </p>
              </div>

              {/* Live Score Display */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/[0.06] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-mono uppercase text-slate-400">Calculated Score</p>
                    <p className="text-3xl font-extrabold font-mono text-amber-400 mt-0.5">
                      {currentDemo.score}<span className="text-sm text-slate-500">/100</span>
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    Deficits Detected
                  </span>
                </div>

                {/* Score breakdown bars */}
                <div className="space-y-2 pt-2 border-t border-white/[0.04]">
                  {Object.entries(currentDemo.scores).map(([k, v]) => (
                    <div key={k} className="text-xs">
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span className="capitalize">{k}</span>
                        <span className="font-mono text-slate-300">{v}/20</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-700"
                          style={{ width: `${(v / 20) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Optimized Result & Directive */}
            <div className="lg:col-span-7 space-y-5">
              <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 relative overflow-hidden space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">✨</span>
                    <h3 className="text-sm font-bold text-white">openai/gpt-oss-120b Optimized Prompt</h3>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    Target Score: ~95/100
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-[#070a12] p-4 rounded-xl border border-white/[0.08] font-sans whitespace-pre-wrap">
                  {currentDemo.improved}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
                <span className="text-lg">💡</span>
                <div>
                  <h4 className="text-xs font-bold font-mono text-amber-300 uppercase">AI Coaching Insight</h4>
                  <p className="text-xs text-slate-200 mt-1 leading-relaxed">{currentDemo.coachingTip}</p>
                </div>
              </div>

              <div className="text-center pt-2">
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 underline underline-offset-4 tracking-wide"
                >
                  Analyze your own real prompts for free →
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Built for Power Users, Developers & Researchers
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Everything you need to turn conversational AI into a precise, repeatable engineering discipline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="glass-panel glass-panel-hover rounded-2xl p-6 border border-white/[0.07] relative overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                    {f.icon}
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {f.badge}
                  </span>
                </div>
                <h3 className="text-white font-bold text-base mb-2 group-hover:text-cyan-300 transition-colors">
                  {f.title}
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The 5 AI Personality Archetypes */}
      <section className="py-16 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono mb-4">
            <span>🧬 Behavioral Fingerprinting</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">What is Your PromptDNA Archetype?</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mt-2">
            Our AI analyzes your vocabulary, length, formatting, and specificity to detect your dominant prompting archetype.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {ARCHETYPES.map((a) => (
            <div
              key={a.type}
              className={`p-5 rounded-2xl border ${a.color} text-center space-y-3 glass-panel backdrop-blur-md transition-all hover:scale-105`}
            >
              <div className="text-3xl">{a.icon}</div>
              <h3 className="font-extrabold text-white text-base">The {a.type}</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{a.trait}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Conversion Banner */}
      <section className="py-20 px-6 max-w-5xl mx-auto relative z-10">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-indigo-900/60 via-purple-900/50 to-cyan-900/60 border border-indigo-500/40 shadow-2xl text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-cyber-grid opacity-30 pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
            Elevate Your AI Communication Today
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Join developers, creators, and researchers using PromptDNA to write clearer, faster, and more potent prompts.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-slate-950 font-bold text-sm hover:bg-slate-100 hover:scale-105 transition-all shadow-xl shadow-black/40"
          >
            <span>Create Free Account</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#05070c] py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
              P
            </div>
            <span className="text-slate-400 text-xs font-mono">
              PromptDNA © 2025 · Built for Intelligent AI Interaction
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-400">
            <Link href="/auth/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link href="/auth/signup" className="hover:text-cyan-400 transition-colors">Get Started</Link>
            <a href="https://github.com/Likith11011/PromptDNA" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              GitHub Repository
            </a>
          </div>
        </div>
      </footer>

    </div>
  )
}