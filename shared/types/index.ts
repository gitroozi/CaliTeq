// Shared types between frontend and backend

export interface User {
  id: string
  email: string
  password_hash?: string // Only on backend
  created_at: Date
  updated_at: Date
}

export interface UserProfile {
  id: string
  user_id: string
  age: number
  gender: 'male' | 'female' | 'other'
  height_cm: number
  weight_kg: number
  goals: UserGoal[]
  experience_level: ExperienceLevel
  activity_level: ActivityLevel
  equipment_available: Equipment[]
  injuries_limitations: string[]
  availability_days_per_week: number
  session_duration_minutes: number
  created_at: Date
  updated_at: Date
}

export type UserGoal =
  | 'fat_loss'
  | 'muscle_gain'
  | 'strength'
  | 'skills'
  | 'general_fitness'
  | 'endurance'

export type ExperienceLevel =
  | 'never_trained'
  | 'beginner' // 0-6 months
  | 'intermediate' // 6-18 months
  | 'advanced' // 18+ months

export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'

export type Equipment =
  | 'pull_up_bar'
  | 'dip_bars'
  | 'resistance_bands'
  | 'elevated_surface'
  | 'parallettes'
  | 'rings'
  | 'none'

export interface MovementPattern {
  id: string
  name: string
  category: 'primary' | 'secondary' | 'skill'
  description: string
}

export interface Exercise {
  id: string
  name: string
  movement_pattern_id: string
  difficulty: number // 1-10
  equipment_required: Equipment[]
  contraindications: string[]
  video_url?: string
  description: string
  coaching_notes?: string
}

export interface WorkoutPlan {
  id: string
  user_id: string
  name: string
  start_date: Date
  end_date: Date
  duration_weeks: number
  status: 'active' | 'completed' | 'paused'
  created_at: Date
}

export interface WorkoutSession {
  id: string
  workout_plan_id: string
  session_number: number
  week_number: number
  day_of_week: number
  session_type: 'strength' | 'hypertrophy' | 'endurance' | 'skill'
  focus_areas: string[]
}

export interface WorkoutSessionExercise {
  id: string
  workout_session_id: string
  exercise_id: string
  order_index: number
  sets: number
  reps_min: number
  reps_max: number
  rest_seconds: number
  notes?: string
}

export interface WorkoutLog {
  id: string
  user_id: string
  workout_session_id?: string
  completed_at: Date
  duration_minutes: number
  difficulty_rating?: number // 1-10
  notes?: string
}

export interface ExerciseLog {
  id: string
  workout_log_id: string
  exercise_id: string
  sets_completed: number
  reps_per_set: number[]
  difficulty_rating?: number // 1-10
}

export interface ProgressMetric {
  id: string
  user_id: string
  metric_type: 'weight' | 'body_fat' | 'measurements' | 'wellness'
  metric_value: number
  metric_unit: string
  recorded_at: Date
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  timestamp: string
}

// Auth types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  refreshToken: string
  user: Omit<User, 'password_hash'>
}
