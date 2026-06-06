# PromptDNA 🧬
> Personalized AI Prompt Intelligence Coach

PromptDNA analyzes your AI prompts, scores them across 5 dimensions, rewrites them for better results, and coaches you on your prompting habits over time.

## Tech Stack
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, Recharts
- **Backend:** FastAPI, SQLAlchemy, Alembic, PostgreSQL
- **AI:** Anthropic Claude API
- **Deployment:** Vercel (frontend), Render (backend), Neon (database)

## Features
- Prompt quality scoring (0–100) across clarity, specificity, context, constraints, examples
- AI-powered prompt improvement
- Success probability prediction
- Personalized coaching insights based on your habits
- Analytics dashboard with score trends, category breakdown, dimension radar
- Feedback loop to track suggestion quality

## Project Structure
promptdna/
├── backend/     # FastAPI backend
└── frontend/    # Next.js frontend

## Local Development

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
cp .env.example .env         # fill in your values
alembic upgrade head
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local   # fill in your values
npm run dev
```

## Environment Variables

### Backend
| Variable | Description |
|---|---|
| DATABASE_URL | PostgreSQL connection string |
| SECRET_KEY | JWT signing secret |
| ANTHROPIC_API_KEY | Claude API key |

### Frontend
| Variable | Description |
|---|---|
| NEXT_PUBLIC_API_URL | Backend API URL |