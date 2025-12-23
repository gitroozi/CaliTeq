// =====================================================
// USER & AUTHENTICATION TYPES
// =====================================================

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  heightCm: number | null;
  currentWeightKg: number | null;
  targetWeightKg: number | null;
  emailVerified: boolean;
  isActive: boolean;
  subscriptionTier: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// =====================================================
// USER PROFILE TYPES
// =====================================================

export type TrainingExperience = 'never' | 'beginner' | 'intermediate' | 'advanced';
export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export interface UserProfile {
  id: string;
  userId: string;
  trainingExperience: TrainingExperience | null;
  activityLevel: ActivityLevel | null;
  goals: string[];
  daysPerWeek: number | null;
  minutesPerSession: number | null;
  injuries: string[];
  medicalConditions: string[];
  exerciseClearance: boolean;
  equipment: Equipment;
  assessmentScores: AssessmentScores;
  createdAt: string;
  updatedAt: string;
}

export interface Equipment {
  pullUpBar: boolean;
  dipBars: boolean;
  resistanceBands: boolean;
  elevatedSurface: boolean;
  other: string[];
}

export interface AssessmentScores {
  pushLevel: number;
  pullLevel: number;
  squatLevel: number;
  hingeLevel: number;
  coreLevel: number;
}

export interface CreateProfileData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg?: number;
  trainingExperience: TrainingExperience;
  activityLevel: ActivityLevel;
  goals: string[];
  daysPerWeek: number;
  minutesPerSession: number;
  injuries: string[];
  medicalConditions: string[];
  exerciseClearance: boolean;
  equipment: Equipment;
  assessmentScores: AssessmentScores;
}

// =====================================================
// EXERCISE TYPES
// =====================================================

export interface MovementPattern {
  id: string;
  name: string;
  displayName: string;
  category: string;
  description: string | null;
  sortOrder: number | null;
  createdAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  slug: string;
  movementPatternId: string;
  movementPattern?: MovementPattern;
  difficulty: number;
  description: string | null;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  videoUrls: string[];
  setupInstructions: string | null;
  executionInstructions: string | null;
  commonMistakes: string[];
  coachingCues: string[];
  targetMuscles: string[];
  equipmentRequired: string[];
  contraindications: string[];
  regressionId: string | null;
  progressionId: string | null;
  alternativeIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ExerciseFilters {
  pattern?: string;
  difficulty?: number;
  minDifficulty?: number;
  maxDifficulty?: number;
  equipment?: string[];
  noEquipment?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

// =====================================================
// WORKOUT TYPES
// =====================================================

export interface WorkoutPlan {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  weeksCount: number;
  sessionsPerWeek: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutSession {
  id: string;
  workoutPlanId: string;
  userId: string;
  weekNumber: number;
  sessionNumber: number;
  sessionType: string;
  scheduledDate: string;
  status: 'scheduled' | 'completed' | 'skipped';
  notes?: string;
  exercises: WorkoutSessionExercise[];
  createdAt: string;
}

export interface WorkoutSessionExercise {
  id: string;
  workoutSessionId: string;
  exerciseId: string;
  exercise?: Exercise;
  orderIndex: number;
  targetSets: number;
  targetReps: string;
  targetRpe?: number;
  restSeconds: number;
  notes: string | null;
}

// =====================================================
// WORKOUT LOGGING TYPES
// =====================================================

export interface WorkoutLog {
  id: string;
  userId: string;
  workoutSessionId: string | null;
  startedAt: string;
  completedAt: string;
  overallDifficulty: number | null;
  energyLevel: number | null;
  enjoyment: number | null;
  notes: string | null;
  painReports: PainReport[];
  exercises: ExerciseLog[];
  createdAt: string;
}

export interface PainReport {
  bodyPart: string;
  severity: number;
  description?: string;
}

export interface ExerciseLog {
  id: string;
  workoutLogId: string;
  exerciseId: string;
  exercise?: Exercise;
  sets: SetLog[];
  totalReps: number;
  maxReps: number;
  avgRpe: number;
  createdAt: string;
}

export interface SetLog {
  setNumber: number;
  reps: number;
  rpe?: number;
  weightKg?: number;
  restSeconds?: number;
  notes?: string;
}

export interface CreateWorkoutLogData {
  workoutSessionId?: string;
  startedAt: string;
  completedAt: string;
  overallDifficulty?: number;
  energyLevel?: number;
  enjoyment?: number;
  notes?: string;
  painReports?: PainReport[];
  exercises: {
    exerciseId: string;
    sets: SetLog[];
  }[];
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalExercises: number;
  totalMinutes: number;
  avgDifficulty: number;
  avgEnergyLevel: number;
  avgEnjoyment: number;
  periodDays: number;
}

// =====================================================
// PROGRESS TRACKING TYPES
// =====================================================

export type MetricType = 'weight' | 'waist' | 'chest' | 'arms' | 'thighs' | 'body_fat' | 'rep_max' | 'wellness';

export interface ProgressMetric {
  id: string;
  userId: string;
  metricType: MetricType;
  data: MetricData;
  recordedAt: string;
  notes: string | null;
  createdAt: string;
}

export type MetricData =
  | WeightMetricData
  | BodyMeasurementData
  | BodyFatData
  | RepMaxData
  | WellnessData;

export interface WeightMetricData {
  weight_kg: number;
}

export interface BodyMeasurementData {
  measurement_cm: number;
  location?: string;
}

export interface BodyFatData {
  body_fat_percentage: number;
  measurement_method?: string;
}

export interface RepMaxData {
  exercise_id: string;
  exercise_name: string;
  reps: number;
  weight_kg?: number;
  estimated_1rm?: number;
}

export interface WellnessData {
  sleep_hours?: number;
  stress_level?: number;
  soreness_level?: number;
  energy_level?: number;
  mood?: number;
}

export interface CreateMetricData {
  metricType: MetricType;
  data: MetricData;
  recordedAt?: string;
  notes?: string;
}

export interface ProgressStats {
  metricType: MetricType;
  totalEntries: number;
  firstRecorded: string | null;
  lastRecorded: string | null;
  latestValue: MetricData;
  earliestValue: MetricData;
  change: number | null;
  changePercentage?: number;
}

export interface MetricHistory {
  metricType: MetricType;
  dataPoints: {
    date: string;
    value: number;
    notes?: string;
  }[];
  trend: 'increasing' | 'decreasing' | 'stable' | 'insufficient_data';
  average: number | null;
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page?: number;
  limit: number;
  offset?: number;
}

// =====================================================
// FORM TYPES
// =====================================================

export interface ValidationError {
  field: string;
  message: string;
}
