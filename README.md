# 🧬 PromptDNA — AI Prompt Intelligence Coach

> Turn your prompts into precision. Analyze, score, and improve how you communicate with AI using intelligent feedback powered by LLaMA 3.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-indigo?style=for-the-badge)](https://prompt-dna-pi.vercel.app)
[![Backend](https://img.shields.io/badge/API%20Docs-Render-green?style=for-the-badge)](https://promptdna.onrender.com/docs)
[![GitHub](https://img.shields.io/badge/GitHub-PromptDNA-black?style=for-the-badge&logo=github)](https://github.com/Likith11011/PromptDNA)

---

## 🚀 Why PromptDNA?

Prompt engineering is becoming a critical skill in the AI era.

However, most users:
- Write vague prompts
- Rely on trial-and-error
- Don’t understand why outputs fail
- Have no feedback loop to improve

### 🧠 PromptDNA solves this.

It transforms prompting from guesswork into a **measurable, learnable skill** by:

- Analyzing prompt quality
- Scoring across key dimensions
- Rewriting weak prompts intelligently
- Tracking user behavior over time
- Providing personalized AI coaching

---

## 🧩 What is PromptDNA?

PromptDNA is an **AI-powered prompt intelligence system** that acts like a fitness tracker for your AI communication skills.

It helps users understand:

> “Why did my prompt fail?”  
> “How can I make it better?”  
> “How am I improving over time?”

---

## ✨ Key Features

### 🧠 Core Intelligence Engine
- **Prompt Analyzer** — Evaluates clarity, specificity, context, constraints, examples, and intent
- **Prompt Scoring System (0–100)** — Multi-dimensional scoring engine
- **AI Prompt Improver** — Generates optimized high-performance prompts
- **Prompt Category Classifier** — Detects coding, writing, research, business, etc.

---

### 📊 Personal AI Coaching Layer
- **PromptDNA Profile** — Personalized user prompt behavior profile
- **Weakness Heatmap** — Visual breakdown of recurring mistakes
- **Personality Type Detection** — Architect, Builder, Researcher, Creator, Explorer
- **Coaching Engine** — Adaptive AI feedback based on user behavior

---

### 📈 Analytics & Insights
- Prompt history tracking
- Score improvement trends
- Category usage distribution
- Dimension-wise radar analysis
- Weekly performance insights

---

### ⚡ Advanced Features
- Prompt comparison (A vs B evaluation)
- Success probability prediction
- Weekly AI-generated performance report
- Feedback loop for continuous improvement

---

## 🧠 System Architecture

```text
User
 ↓
Frontend (Next.js)
 ↓
API Layer (FastAPI)
 ↓
Prompt Analysis Engine
 ↓
Feature Extraction (NLP + Rules)
 ↓
Scoring Engine (Hybrid Logic)
 ↓
LLM (LLaMA 3 / Groq API)
 ↓
PostgreSQL (User + Analytics Data)
🧩 Architecture Highlights
Hybrid AI system (Rules + LLM)

Behavioral analytics engine

Personalized feedback loop

Modular AI service architecture

🛠️ Tech Stack
Layer	Technology
Frontend	Next.js 14, TypeScript, Tailwind CSS, Recharts
Backend	FastAPI, SQLAlchemy, Pydantic, Alembic
AI Engine	Groq API (LLaMA 3.3 70B Versatile)
Database	PostgreSQL (Neon)
Auth	JWT (python-jose, bcrypt)
Deployment	Vercel (Frontend), Render (Backend)

🔌 API Endpoints
Method	Endpoint	Description
POST	/auth/signup	Register new user
POST	/auth/login	User authentication
GET	/auth/me	Get current user
POST	/prompts/analyze	Analyze prompt
GET	/prompts/history	Fetch prompt history
GET	/prompts/analytics	Analytics data
POST	/coaching/feedback	Submit feedback
GET	/profile/dna	Get PromptDNA profile
POST	/profile/compare	Compare prompts
GET	/profile/weekly-report	Weekly insights

📁 Project Structure

PromptDNA/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── core/          # Config & security (JWT, settings)
│   ├── models/        # Database models
│   ├── schemas/       # Request/response schemas
│   ├── routers/       # API endpoints
│   ├── services/      # AI logic + business logic
│   └── alembic/       # Database migrations
│
└── frontend/
    ├── app/           # Pages (Next.js App Router)
    ├── components/    # UI components
    ├── lib/           # API + helpers
    └── types/         # TypeScript definitions
⚙️ Local Setup
🔧 Backend Setup
Bash

cd backend
python -m venv venv

# Activate environment
venv\Scripts\activate   # Windows
source venv/bin/activate  # Mac/Linux

pip install -r requirements.txt

cp .env.example .env

alembic upgrade head

uvicorn main:app --reload
💻 Frontend Setup
Bash

cd frontend
npm install

cp .env.example .env.local

npm run dev
🔐 Environment Variables
Backend (.env)

DATABASE_URL=postgresql://...
SECRET_KEY=your_secret_key
GROQ_API_KEY=gsk_...
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
ALLOWED_ORIGINS=http://localhost:3000
Frontend (.env.local)

NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
📊 System Design Highlights
Hybrid Prompt Intelligence Engine (Rules + LLM)

Personalized behavioral profiling system

Multi-dimensional scoring architecture

Real-time prompt optimization pipeline

Feedback-driven learning loop

🧪 Example Workflow
User enters prompt:

"make chatbot"

System analyzes:

Low clarity

Missing constraints

No output format

Output:

Score: 42/100

Issues highlighted

Improved prompt generated

AI coaching:

“You improve significantly when you specify frameworks and output format.”

📸 Suggested Screenshots
Prompt Analysis Dashboard (Score + insights)

Prompt History with trends

DNA Profile (strengths/weaknesses)

Prompt Comparison view

Coaching insights panel

Login / Landing page

🧠 Future Improvements
Browser extension for real-time prompt optimization

Team analytics dashboard (SaaS version)

Prompt marketplace

Model-specific optimization (GPT vs Claude vs Gemini)

Prompt success prediction ML model

👨‍💻 Built By
Likith B
B.Tech Artificial Intelligence & Machine Learning
Alliance University, Bengaluru

GitHub: @Likith11011

LinkedIn: (add your link here)

📄 License
MIT License
