# 🧬 PromptDNA — AI Prompt Intelligence Coach

> Turn your prompts into precision. Analyze, score, and improve how you communicate with AI using intelligent feedback powered by openai/gpt-oss-120b.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-indigo?style=for-the-badge)](https://prompt-dna-pi.vercel.app)
[![Backend](https://img.shields.io/badge/API%20Docs-Render-green?style=for-the-badge)](https://promptdna.onrender.com/docs)
[![GitHub](https://img.shields.io/badge/GitHub-PromptDNA-black?style=for-the-badge&logo=github)](https://github.com/Likith11011/PromptDNA)

---

🧬 PromptDNA — AI Prompt Intelligence Coach

Turn your prompts into precision. Analyze, score, and improve how you communicate with AI using intelligent feedback powered by LLaMA 3.3 70B.

🔗 Live Demo: https://prompt-dna-pi.vercel.app
📄 API Docs: https://promptdna.onrender.com/docs
💻 GitHub: https://github.com/Likith11011/PromptDNA

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 WHY PROMPTDNA?

Prompt engineering is becoming a critical skill in the AI era.

Most users:
→ Write vague, low-quality prompts
→ Rely on trial-and-error
→ Don't understand why AI outputs fail
→ Have no feedback loop to improve

PromptDNA transforms prompting from guesswork into a measurable, learnable skill.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ KEY FEATURES

🧠 Core Intelligence Engine
→ Prompt Analyzer — Evaluates clarity, specificity, context, constraints, examples
→ Scoring System (0–100) — Multi-dimensional scoring with visual breakdown
→ AI Prompt Improver — Rewrites weak prompts using LLaMA 3.3 70B
→ Category Classifier — Detects coding, writing, research, business, creative

📊 Personal Coaching Layer
→ PromptDNA Profile — Your personalized AI communication fingerprint
→ Weakness Heatmap — Visual breakdown of recurring prompt mistakes
→ Personality Type — Architect, Builder, Researcher, Creator, Explorer
→ Coaching Engine — Adaptive feedback based on your actual patterns

📈 Analytics and Insights
→ Prompt history with expandable detail view
→ Score improvement trends over time
→ Category usage distribution
→ Dimension-wise radar chart
→ 4-week habit tracking

⚡ Advanced Features
→ Prompt Comparison Mode (A vs B evaluation)
→ Success probability prediction
→ Weekly AI-generated performance report
→ Feedback loop for continuous coaching improvement

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🛠️ TECH STACK

Frontend   → Next.js 14, TypeScript, Tailwind CSS, Recharts
Backend    → FastAPI, SQLAlchemy, Pydantic, Alembic
AI Engine  → Groq API — LLaMA 3.3 70B Versatile
Database   → PostgreSQL (Neon)
Auth       → JWT (python-jose + bcrypt)
Deployment → Vercel (Frontend) + Render (Backend)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧠 SYSTEM ARCHITECTURE

User
 ↓
Frontend (Next.js — Vercel)
 ↓
REST API (FastAPI — Render)
 ↓
Prompt Analysis + Scoring Engine
 ↓
LLM Layer (Groq — LLaMA 3.3 70B)
 ↓
PostgreSQL (Neon)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔌 API ENDPOINTS

POST   /auth/signup              Register new user
POST   /auth/login               User authentication
GET    /auth/me                  Get current user
POST   /prompts/analyze          Analyze and score prompt
GET    /prompts/history          Fetch prompt history
GET    /prompts/analytics        Analytics chart data
GET    /coaching/insights        Get coaching insights
POST   /coaching/generate        Generate new insights
POST   /coaching/feedback        Submit feedback
GET    /coaching/stats           User dimension stats
GET    /profile/dna              Get full PromptDNA profile
POST   /profile/compare          Compare two prompts
GET    /profile/weekly-report    Weekly performance report

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 PROJECT STRUCTURE

PromptDNA/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── core/          → Config, security, JWT
│   ├── models/        → SQLAlchemy database models
│   ├── schemas/       → Pydantic request/response schemas
│   ├── routers/       → API route handlers
│   ├── services/      → AI logic and business logic
│   └── alembic/       → Database migrations
│
└── frontend/
    ├── app/           → Next.js App Router pages
    ├── components/    → Reusable UI components
    ├── lib/           → API client and auth helpers
    └── types/         → TypeScript interfaces

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚙️ LOCAL SETUP

Backend:
  cd backend
  python -m venv venv
  venv\Scripts\activate
  pip install -r requirements.txt
  cp .env.example .env
  alembic upgrade head
  uvicorn main:app --reload

Frontend:
  cd frontend
  npm install
  cp .env.example .env.local
  npm run dev

Backend .env:
  DATABASE_URL=postgresql://...
  SECRET_KEY=your-secret-key
  GROQ_API_KEY=gsk_...
  ALGORITHM=HS256
  ACCESS_TOKEN_EXPIRE_MINUTES=60
  ALLOWED_ORIGINS=http://localhost:3000

Frontend .env.local:
  NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧠 FUTURE IMPROVEMENTS

→ Browser extension for real-time prompt optimization
→ Team analytics dashboard (SaaS version)
→ Prompt template marketplace
→ Model-specific optimization (GPT vs Claude vs Gemini)
→ ML-based success prediction model
→ PDF prompt report export

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👨‍💻 TEAM

Likith B — Backend Lead + AI Integration + Deployment
→ Designed and built FastAPI backend architecture
→ Built JWT authentication system with bcrypt security
→ Integrated Groq LLaMA 3.3 70B for prompt analysis and improvement
→ Built 5-dimension prompt scoring engine
→ Designed PostgreSQL schema and Alembic migrations
→ Built coaching engine, weekly report, and DNA profile services
→ Deployed backend on Render with Neon PostgreSQL
B.Tech AI/ML — Alliance University, Bengaluru
GitHub: github.com/Likith11011

Kushitha B — Frontend Lead + UI/UX Design + Analytics
→ Designed and built Next.js 14 frontend with TypeScript
→ Implemented light SaaS theme using Tailwind CSS
→ Built all UI components — ScoreCard, HeatmapBar, CoachingCard, PersonalityCard
→ Integrated Recharts for analytics — score trend, category bar, dimension radar
→ Built prompt history with expandable detail modal
→ Implemented JWT auth flow with protected routes and middleware
→ Built comparison mode, DNA profile page, and coaching page
→ Designed landing page with hero, features, and CTA sections
B.Tech AI/ML — Alliance University, Bengaluru
GitHub: github.com/KushithaBhaskar
