# ensures all models are imported for Alembic to detect them
from models.user import User
from models.prompt import PromptLog, PromptScores
from models.coaching import CoachingInsight
from models.feedback import Feedback
from models.weekly_report import WeeklyReport
from models.prompt_comparison import PromptComparison