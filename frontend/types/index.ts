export interface User {
  id: string
  email: string
  name: string | null
  total_prompts: number
  avg_score: number
}

export interface Scores {
  clarity: number
  specificity: number
  context: number
  constraints: number
  examples: number
}

export interface PromptResult {
  id: string
  original_prompt: string
  improved_prompt: string | null
  category: string
  total_score: number
  scores: Scores
  coaching_tip: string | null
  success_probability: number
  success_reason: string | null
  created_at: string
}

export interface HistoryItem {
  id: string
  original_prompt: string
  improved_prompt: string | null
  category: string
  total_score: number
  success_probability: number
  coaching_tip: string | null
  success_reason: string | null
  scores: Scores | null
  created_at: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface CoachingInsight {
  id: string
  insight_type: string
  target_dimension: string | null
  message: string
  generated_at: string
}

export interface UserStats {
  total_prompts: number
  avg_score: number
  weakest_dimension: string | null
  strongest_dimension: string | null
  top_categories: string[]
}

export interface ScoreTrendPoint {
  index: number
  score: number
  date: string
}

export interface CategoryBreakdownItem {
  name: string
  count: number
}

export interface AnalyticsData {
  score_trend: ScoreTrendPoint[]
  category_breakdown: CategoryBreakdownItem[]
  dimension_averages: Record<string, number>
  streak: number
}