import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  User,
  AuthTokens,
  LoginCredentials,
  RegisterData,
  UserProfile,
  CreateProfileData,
  Exercise,
  ExerciseFilters,
  MovementPattern,
  WorkoutPlan,
  WorkoutSession,
  WorkoutLog,
  CreateWorkoutLogData,
  WorkoutStats,
  ProgressMetric,
  CreateMetricData,
  ProgressStats,
  MetricHistory,
  MetricType,
  PaginatedResponse,
  WorkoutSessionExercise,
  ExerciseLog,
  SetLog,
  PainReport,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// =====================================================
// RESPONSE MAPPERS
// =====================================================

const mapMovementPattern = (pattern: any): MovementPattern => ({
  id: pattern.id,
  name: pattern.name,
  displayName: pattern.display_name ?? pattern.displayName ?? pattern.display_name ?? '',
  category: pattern.category,
  description: pattern.description ?? null,
  sortOrder: pattern.sort_order ?? pattern.sortOrder ?? null,
  createdAt: pattern.created_at ?? pattern.createdAt ?? '',
});

const mapUser = (user: any): User => ({
  id: user.id,
  email: user.email,
  firstName: user.first_name ?? user.firstName ?? null,
  lastName: user.last_name ?? user.lastName ?? null,
  dateOfBirth: user.date_of_birth ?? user.dateOfBirth ?? null,
  gender: user.gender ?? null,
  heightCm: user.height_cm ?? user.heightCm ?? null,
  currentWeightKg: user.current_weight_kg ?? user.currentWeightKg ?? null,
  targetWeightKg: user.target_weight_kg ?? user.targetWeightKg ?? null,
  emailVerified: user.email_verified ?? user.emailVerified ?? false,
  isActive: user.is_active ?? user.isActive ?? true,
  subscriptionTier: user.subscription_tier ?? user.subscriptionTier ?? 'free',
  createdAt: user.created_at ?? user.createdAt ?? '',
  updatedAt: user.updated_at ?? user.updatedAt ?? '',
});

const mapExercise = (exercise: any): Exercise => ({
  id: exercise.id,
  name: exercise.name,
  slug: exercise.slug,
  movementPatternId:
    exercise.movementPatternId ??
    exercise.movement_pattern_id ??
    exercise.movementPattern?.id ??
    exercise.movement_pattern?.id ??
    '',
  movementPattern: exercise.movementPattern
    ? exercise.movementPattern
    : exercise.movement_pattern
      ? mapMovementPattern(exercise.movement_pattern)
      : undefined,
  difficulty: exercise.difficulty,
  description: exercise.description ?? null,
  videoUrl: exercise.videoUrl ?? exercise.video_url ?? null,
  thumbnailUrl: exercise.thumbnailUrl ?? exercise.thumbnail_url ?? null,
  videoUrls: exercise.videoUrls ?? exercise.video_urls ?? [],
  setupInstructions: exercise.setupInstructions ?? exercise.setup_instructions ?? null,
  executionInstructions: exercise.executionInstructions ?? exercise.execution_instructions ?? null,
  commonMistakes: exercise.commonMistakes ?? exercise.common_mistakes ?? [],
  coachingCues: exercise.coachingCues ?? exercise.coaching_cues ?? [],
  targetMuscles: exercise.targetMuscles ?? exercise.target_muscles ?? [],
  equipmentRequired: exercise.equipmentRequired ?? exercise.equipment_required ?? [],
  contraindications: exercise.contraindications ?? [],
  regressionId: exercise.regressionId ?? exercise.regression_id ?? null,
  progressionId: exercise.progressionId ?? exercise.progression_id ?? null,
  alternativeIds: exercise.alternativeIds ?? exercise.alternative_ids ?? [],
  createdAt: exercise.createdAt ?? exercise.created_at ?? '',
  updatedAt: exercise.updatedAt ?? exercise.updated_at ?? '',
});

const mapWorkoutPlan = (plan: any): WorkoutPlan => ({
  id: plan.id,
  userId: plan.userId ?? plan.user_id ?? '',
  name: plan.name,
  description: plan.ai_explanation ?? plan.description ?? null,
  startDate: plan.startDate ?? plan.start_date ?? '',
  endDate: plan.endDate ?? plan.end_date ?? '',
  weeksCount: plan.weeksCount ?? plan.duration_weeks ?? 0,
  sessionsPerWeek: plan.sessionsPerWeek ?? plan.frequency ?? 0,
  isActive: plan.isActive ?? plan.status === 'active',
  createdAt: plan.createdAt ?? plan.created_at ?? '',
  updatedAt: plan.updatedAt ?? plan.updated_at ?? '',
});

const mapWorkoutSessionExercise = (item: any): WorkoutSessionExercise => ({
  id: item.id,
  workoutSessionId: item.workoutSessionId ?? item.workout_session_id ?? '',
  exerciseId: item.exerciseId ?? item.exercise_id ?? '',
  exercise: item.exercise ? mapExercise(item.exercise) : undefined,
  orderIndex: item.orderIndex ?? item.exercise_order ?? 0,
  targetSets: item.targetSets ?? item.sets ?? 0,
  targetReps: item.targetReps ?? item.reps ?? '',
  targetRpe: item.targetRpe ?? item.target_rpe ?? undefined,
  restSeconds: item.restSeconds ?? item.rest_seconds ?? 0,
  notes: item.notes ?? item.coaching_notes ?? null,
});

const mapWorkoutSession = (session: any): WorkoutSession => ({
  id: session.id,
  workoutPlanId: session.workoutPlanId ?? session.workout_plan_id ?? '',
  userId: session.userId ?? session.user_id ?? '',
  weekNumber: session.weekNumber ?? session.week_number ?? 0,
  sessionNumber: session.sessionNumber ?? session.session_number ?? 0,
  sessionType: session.sessionType ?? session.name ?? '',
  scheduledDate: session.scheduledDate ?? session.scheduled_date ?? '',
  status: session.status,
  notes: session.notes ?? null,
  exercises: (session.exercises ?? session.workout_session_exercises ?? []).map(mapWorkoutSessionExercise),
  createdAt: session.createdAt ?? session.created_at ?? '',
});

const mapSetLog = (set: any): SetLog => ({
  setNumber: set.setNumber ?? set.set_number ?? 0,
  reps: set.reps ?? 0,
  rpe: set.rpe ?? undefined,
  weightKg: set.weightKg ?? set.weight_kg ?? undefined,
  restSeconds: set.restSeconds ?? set.rest_seconds ?? undefined,
  notes: set.notes ?? undefined,
});

const mapExerciseLog = (log: any): ExerciseLog => ({
  id: log.id,
  workoutLogId: log.workoutLogId ?? log.workout_log_id ?? '',
  exerciseId: log.exerciseId ?? log.exercise_id ?? '',
  exercise: log.exercise ? mapExercise(log.exercise) : undefined,
  sets: (log.sets ?? []).map(mapSetLog),
  totalReps: log.totalReps ?? log.total_reps ?? 0,
  maxReps: log.maxReps ?? log.max_reps ?? 0,
  avgRpe: log.avgRpe ?? log.avg_rpe ?? 0,
  createdAt: log.createdAt ?? log.created_at ?? '',
});

const mapPainReport = (report: any): PainReport => ({
  bodyPart: report.bodyPart ?? report.body_part ?? '',
  severity: report.severity ?? 0,
  description: report.description ?? undefined,
});

const mapWorkoutLog = (log: any): WorkoutLog => ({
  id: log.id,
  userId: log.userId ?? log.user_id ?? '',
  workoutSessionId: log.workoutSessionId ?? log.workout_session_id ?? null,
  startedAt: log.startedAt ?? log.started_at ?? '',
  completedAt: log.completedAt ?? log.completed_at ?? '',
  overallDifficulty: log.overallDifficulty ?? log.overall_difficulty ?? null,
  energyLevel: log.energyLevel ?? log.energy_level ?? null,
  enjoyment: log.enjoyment ?? null,
  notes: log.notes ?? null,
  painReports: (log.painReports ?? log.pain_reports ?? []).map(mapPainReport),
  exercises: (log.exercises ?? log.exercise_logs ?? []).map(mapExerciseLog),
  createdAt: log.createdAt ?? log.created_at ?? '',
});

const mapWorkoutStats = (stats: any): WorkoutStats => ({
  totalWorkouts: stats.totalWorkouts ?? stats.total_workouts ?? 0,
  totalExercises: stats.totalExercises ?? stats.total_exercises ?? 0,
  totalMinutes: stats.totalMinutes ?? stats.total_training_minutes ?? 0,
  avgDifficulty: stats.avgDifficulty ?? stats.average_difficulty ?? 0,
  avgEnergyLevel: stats.avgEnergyLevel ?? stats.average_energy_level ?? 0,
  avgEnjoyment: stats.avgEnjoyment ?? stats.average_enjoyment ?? 0,
  periodDays: stats.periodDays ?? stats.period_days ?? 0,
});

const mapProgressMetric = (metric: any): ProgressMetric => ({
  id: metric.id,
  userId: metric.userId ?? metric.user_id ?? '',
  metricType: metric.metricType ?? metric.metric_type,
  data: metric.data,
  recordedAt: metric.recordedAt ?? metric.recorded_at ?? '',
  notes: metric.notes ?? null,
  createdAt: metric.createdAt ?? metric.created_at ?? '',
});

const mapProgressStats = (stats: any): ProgressStats => ({
  metricType: stats.metricType ?? stats.metric_type,
  totalEntries: stats.totalEntries ?? stats.total_entries ?? 0,
  firstRecorded: stats.firstRecorded ?? stats.first_recorded ?? null,
  lastRecorded: stats.lastRecorded ?? stats.last_recorded ?? null,
  latestValue: stats.latestValue ?? stats.latest_value ?? {},
  earliestValue: stats.earliestValue ?? stats.earliest_value ?? {},
  change: stats.change ?? null,
  changePercentage: stats.changePercentage ?? stats.change_percentage,
});

const mapMetricHistory = (history: any): MetricHistory => ({
  metricType: history.metricType ?? history.metric_type,
  dataPoints: (history.dataPoints ?? history.data_points ?? []).map((point: any) => ({
    date: point.date,
    value: point.value,
    notes: point.notes ?? undefined,
  })),
  trend: history.trend,
  average: history.average ?? null,
});

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data.data;

          // Update tokens
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// =====================================================
// AUTHENTICATION API
// =====================================================

export const authApi = {
  register: async (data: RegisterData): Promise<AuthTokens> => {
    const response = await apiClient.post<{ success: boolean; data: AuthTokens }>('/auth/register', data);
    return response.data.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthTokens> => {
    const response = await apiClient.post<{ success: boolean; data: AuthTokens }>('/auth/login', credentials);
    return response.data.data;
  },

  refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
    const response = await apiClient.post<{ success: boolean; data: AuthTokens }>('/auth/refresh', { refreshToken });
    return response.data.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<{ success: boolean; data: { user: User } }>('/auth/me');
    return mapUser(response.data.data.user);
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
    await apiClient.put('/auth/password', data);
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};

// =====================================================
// USER PROFILE API
// =====================================================

export const profileApi = {
  getProfile: async (): Promise<UserProfile | null> => {
    const response = await apiClient.get<{ success: boolean; data: UserProfile }>('/users/profile');
    return response.data.data;
  },

  createProfile: async (data: CreateProfileData): Promise<UserProfile> => {
    const response = await apiClient.post<{ success: boolean; data: UserProfile }>('/users/profile', data);
    return response.data.data;
  },

  updateProfile: async (data: Partial<CreateProfileData>): Promise<UserProfile> => {
    const response = await apiClient.put<{ success: boolean; data: UserProfile }>('/users/profile', data);
    return response.data.data;
  },

  isProfileComplete: async (): Promise<boolean> => {
    const response = await apiClient.get<{ success: boolean; data: { isComplete: boolean } }>('/users/profile/complete');
    return response.data.data.isComplete;
  },

  deleteProfile: async (): Promise<void> => {
    await apiClient.delete('/users/profile');
  },
};

// =====================================================
// EXERCISE API
// =====================================================

export const exerciseApi = {
  getExercises: async (filters?: ExerciseFilters): Promise<PaginatedResponse<Exercise>> => {
    const response = await apiClient.get<{ success: boolean; data: Exercise[]; pagination: { total: number; page: number; limit: number } }>('/exercises', {
      params: filters,
    });
    return {
      data: response.data.data.map(mapExercise),
      total: response.data.pagination.total,
      page: response.data.pagination.page,
      limit: response.data.pagination.limit,
    };
  },

  getExercise: async (idOrSlug: string): Promise<Exercise> => {
    const response = await apiClient.get<{ success: boolean; data: Exercise }>(`/exercises/${idOrSlug}`);
    return mapExercise(response.data.data);
  },

  searchExercises: async (query: string, filters?: ExerciseFilters): Promise<PaginatedResponse<Exercise>> => {
    const response = await apiClient.get<{ success: boolean; data: Exercise[]; pagination: { total: number; page: number; limit: number } }>('/exercises/search', {
      params: { q: query, ...filters },
    });
    return {
      data: response.data.data.map(mapExercise),
      total: response.data.pagination.total,
      page: response.data.pagination.page,
      limit: response.data.pagination.limit,
    };
  },

  getProgressionChain: async (exerciseId: string): Promise<Exercise[]> => {
    const response = await apiClient.get<{ success: boolean; data: Exercise[] }>(`/exercises/${exerciseId}/progression-chain`);
    return response.data.data.map(mapExercise);
  },

  getMovementPatterns: async (): Promise<MovementPattern[]> => {
    const response = await apiClient.get<{ success: boolean; data: MovementPattern[] }>('/movement-patterns');
    return response.data.data.map(mapMovementPattern);
  },

  getExercisesByPattern: async (patternIdOrName: string, page?: number, limit?: number): Promise<PaginatedResponse<Exercise>> => {
    const response = await apiClient.get<{ success: boolean; data: Exercise[]; pagination: { total: number; page: number; limit: number } }>(`/movement-patterns/${patternIdOrName}/exercises`, {
      params: { page, limit },
    });
    return {
      data: response.data.data.map(mapExercise),
      total: response.data.pagination.total,
      page: response.data.pagination.page,
      limit: response.data.pagination.limit,
    };
  },
};

// =====================================================
// WORKOUT API
// =====================================================

export const workoutApi = {
  generatePlan: async (): Promise<WorkoutPlan> => {
    const response = await apiClient.post<{ message: string; plan: WorkoutPlan }>('/workout-plans/generate');
    return mapWorkoutPlan(response.data.plan);
  },

  getActivePlan: async (): Promise<WorkoutPlan | null> => {
    try {
      const response = await apiClient.get<WorkoutPlan>('/workout-plans/active');
      return mapWorkoutPlan(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  getPlan: async (planId: string): Promise<WorkoutPlan> => {
    const response = await apiClient.get<WorkoutPlan>(`/workout-plans/${planId}`);
    return mapWorkoutPlan(response.data);
  },

  getAllPlans: async (): Promise<WorkoutPlan[]> => {
    const response = await apiClient.get<WorkoutPlan[]>('/workout-plans');
    return response.data.map(mapWorkoutPlan);
  },

  deactivatePlan: async (planId: string): Promise<void> => {
    await apiClient.put(`/workout-plans/${planId}/deactivate`);
  },

  getTodayWorkout: async (): Promise<WorkoutSession | null> => {
    try {
      const response = await apiClient.get<WorkoutSession>('/workout-sessions/today');
      return mapWorkoutSession(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  getWeekSessions: async (weekNumber: number): Promise<WorkoutSession[]> => {
    const response = await apiClient.get<WorkoutSession[]>(`/workout-sessions/week/${weekNumber}`);
    return response.data.map(mapWorkoutSession);
  },

  getSession: async (sessionId: string): Promise<WorkoutSession> => {
    const response = await apiClient.get<WorkoutSession>(`/workout-sessions/${sessionId}`);
    return mapWorkoutSession(response.data);
  },
};

// =====================================================
// WORKOUT LOGGING API
// =====================================================

export const workoutLogApi = {
  createLog: async (data: CreateWorkoutLogData): Promise<WorkoutLog> => {
    const payload = {
      workout_session_id: data.workoutSessionId,
      started_at: data.startedAt,
      completed_at: data.completedAt,
      overall_difficulty: data.overallDifficulty,
      energy_level: data.energyLevel,
      enjoyment: data.enjoyment,
      notes: data.notes,
      pain_reports: data.painReports?.map((report) => ({
        body_part: report.bodyPart,
        severity: report.severity,
        description: report.description,
      })),
      exercises: data.exercises.map((exercise) => ({
        exercise_id: exercise.exerciseId,
        sets: exercise.sets.map((set) => ({
          set_number: set.setNumber,
          reps: set.reps,
          rpe: set.rpe,
          weight_kg: set.weightKg,
          rest_seconds: set.restSeconds,
          notes: set.notes,
        })),
      })),
    };

    const response = await apiClient.post<{ success: boolean; data: WorkoutLog }>('/workout-logs', payload);
    return mapWorkoutLog(response.data.data);
  },

  getLogs: async (filters?: {
    fromDate?: string;
    toDate?: string;
    workoutSessionId?: string;
    limit?: number;
    offset?: number;
  }): Promise<PaginatedResponse<WorkoutLog>> => {
    const response = await apiClient.get<{ success: boolean; data: WorkoutLog[]; pagination: { total: number; limit: number; offset: number } }>('/workout-logs', {
      params: {
        from_date: filters?.fromDate,
        to_date: filters?.toDate,
        workout_session_id: filters?.workoutSessionId,
        limit: filters?.limit,
        offset: filters?.offset,
      },
    });
    return {
      data: response.data.data.map(mapWorkoutLog),
      total: response.data.pagination.total,
      limit: response.data.pagination.limit,
      offset: response.data.pagination.offset,
    };
  },

  getLog: async (logId: string): Promise<WorkoutLog> => {
    const response = await apiClient.get<{ success: boolean; data: WorkoutLog }>(`/workout-logs/${logId}`);
    return mapWorkoutLog(response.data.data);
  },

  deleteLog: async (logId: string): Promise<void> => {
    await apiClient.delete(`/workout-logs/${logId}`);
  },

  getStats: async (periodDays?: number): Promise<WorkoutStats> => {
    const response = await apiClient.get<{ success: boolean; data: WorkoutStats }>('/workout-logs/stats', {
      params: { days: periodDays },
    });
    return mapWorkoutStats(response.data.data);
  },

  getExerciseHistory: async (exerciseId: string, limit?: number): Promise<any[]> => {
    const response = await apiClient.get<{ success: boolean; data: any[] }>(`/workout-logs/exercises/${exerciseId}/history`, {
      params: { limit },
    });
    return response.data.data;
  },
};

// =====================================================
// PROGRESS TRACKING API
// =====================================================

export const progressApi = {
  createMetric: async (data: CreateMetricData): Promise<ProgressMetric> => {
    const response = await apiClient.post<{ metric: ProgressMetric }>('/progress/metrics', {
      metric_type: data.metricType,
      data: data.data,
      recorded_at: data.recordedAt,
      notes: data.notes,
    });
    return mapProgressMetric(response.data.metric);
  },

  getMetrics: async (filters?: {
    metricType?: MetricType;
    fromDate?: string;
    toDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<PaginatedResponse<ProgressMetric>> => {
    const response = await apiClient.get<{ metrics: ProgressMetric[]; total: number; limit: number; offset: number }>('/progress/metrics', {
      params: {
        metric_type: filters?.metricType,
        from_date: filters?.fromDate,
        to_date: filters?.toDate,
        limit: filters?.limit,
        offset: filters?.offset,
      },
    });
    return {
      data: response.data.metrics.map(mapProgressMetric),
      total: response.data.total,
      limit: response.data.limit,
      offset: response.data.offset,
    };
  },

  getMetric: async (metricId: string): Promise<ProgressMetric> => {
    const response = await apiClient.get<{ metric: ProgressMetric }>(`/progress/metrics/${metricId}`);
    return mapProgressMetric(response.data.metric);
  },

  deleteMetric: async (metricId: string): Promise<void> => {
    await apiClient.delete(`/progress/metrics/${metricId}`);
  },

  getAllStats: async (days?: number): Promise<ProgressStats[]> => {
    const response = await apiClient.get<{ stats: ProgressStats[] }>('/progress/stats', {
      params: { days },
    });
    return response.data.stats.map(mapProgressStats);
  },

  getMetricStats: async (metricType: MetricType, days?: number): Promise<ProgressStats> => {
    const response = await apiClient.get<{ stats: ProgressStats }>(`/progress/stats/${metricType}`, {
      params: { days },
    });
    return mapProgressStats(response.data.stats);
  },

  getMetricHistory: async (metricType: MetricType, days?: number): Promise<MetricHistory> => {
    const response = await apiClient.get<MetricHistory>(`/progress/history/${metricType}`, {
      params: { days },
    });
    return mapMetricHistory(response.data);
  },
};

export default apiClient;
