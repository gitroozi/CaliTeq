import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface SetData {
  set_number: number;
  reps: number;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  weight_kg?: number;
  rest_seconds?: number;
  notes?: string;
  completed?: boolean;
}

export interface ExerciseLogData {
  exercise_id: string;
  sets: SetData[];
  total_reps?: number;
  max_reps?: number;
  avg_rpe?: number;
}

export interface CreateWorkoutLogData {
  workout_session_id?: string;
  started_at: Date | string;
  completed_at: Date | string;
  overall_difficulty?: number; // 1-10
  energy_level?: number; // 1-10
  enjoyment?: number; // 1-10
  notes?: string;
  pain_reports?: Array<{
    body_part: string;
    severity: number; // 1-10
    description?: string;
  }>;
  exercises: ExerciseLogData[];
}

export interface WorkoutLogFilters {
  from_date?: Date | string;
  to_date?: Date | string;
  workout_session_id?: string;
  limit?: number;
  offset?: number;
}

export const workoutLogService = {
  /**
   * Create a new workout log with exercise logs
   */
  async createWorkoutLog(userId: string, data: CreateWorkoutLogData) {
    const {
      workout_session_id,
      started_at,
      completed_at,
      overall_difficulty,
      energy_level,
      enjoyment,
      notes,
      pain_reports = [],
      exercises,
    } = data;

    // Validate subjective ratings
    if (overall_difficulty && (overall_difficulty < 1 || overall_difficulty > 10)) {
      throw new Error('Overall difficulty must be between 1 and 10');
    }
    if (energy_level && (energy_level < 1 || energy_level > 10)) {
      throw new Error('Energy level must be between 1 and 10');
    }
    if (enjoyment && (enjoyment < 1 || enjoyment > 10)) {
      throw new Error('Enjoyment must be between 1 and 10');
    }

    // Validate dates
    const startedDate = new Date(started_at);
    const completedDate = new Date(completed_at);

    if (completedDate < startedDate) {
      throw new Error('Completed time must be after started time');
    }

    // Verify workout session exists and belongs to user if provided
    if (workout_session_id) {
      const session = await prisma.workoutSession.findFirst({
        where: {
          id: workout_session_id,
          user_id: userId,
        },
      });

      if (!session) {
        throw new Error('Workout session not found or does not belong to user');
      }
    }

    // Verify all exercises exist
    const exerciseIds = exercises.map((e) => e.exercise_id);
    const existingExercises = await prisma.exercise.findMany({
      where: { id: { in: exerciseIds } },
      select: { id: true },
    });

    if (existingExercises.length !== exerciseIds.length) {
      throw new Error('One or more exercises not found');
    }

    // Create workout log with exercise logs in a transaction
    const workoutLog = await prisma.workoutLog.create({
      data: {
        user_id: userId,
        workout_session_id: workout_session_id || null,
        started_at: startedDate,
        completed_at: completedDate,
        overall_difficulty,
        energy_level,
        enjoyment,
        notes,
        pain_reports: pain_reports as any,
        exercise_logs: {
          create: exercises.map((exercise) => {
            // Calculate aggregate stats
            const totalReps = exercise.sets.reduce(
              (sum, set) => sum + (set.reps || 0),
              0
            );
            const maxReps = Math.max(...exercise.sets.map((set) => set.reps || 0));
            const rpeValues = exercise.sets
              .map((set) => set.rpe)
              .filter((rpe): rpe is number => rpe !== undefined && rpe !== null);
            const avgRpe =
              rpeValues.length > 0
                ? rpeValues.reduce((sum, rpe) => sum + rpe, 0) / rpeValues.length
                : null;

            return {
              exercise_id: exercise.exercise_id,
              sets: exercise.sets as any,
              total_reps: exercise.total_reps ?? totalReps,
              max_reps: exercise.max_reps ?? maxReps,
              avg_rpe: exercise.avg_rpe ?? avgRpe,
            };
          }),
        },
      },
      include: {
        exercise_logs: {
          include: {
            exercise: {
              select: {
                id: true,
                name: true,
                slug: true,
                difficulty: true,
              },
            },
          },
        },
        workout_session: {
          select: {
            id: true,
            name: true,
            week_number: true,
            session_number: true,
            scheduled_date: true,
          },
        },
      },
    });

    // Update workout session status if provided
    if (workout_session_id) {
      await prisma.workoutSession.update({
        where: { id: workout_session_id },
        data: {
          status: 'completed',
          completed_at: completedDate,
        },
      });
    }

    return workoutLog;
  },

  /**
   * Get all workout logs for a user with optional filters
   */
  async getWorkoutLogs(userId: string, filters: WorkoutLogFilters = {}) {
    const {
      from_date,
      to_date,
      workout_session_id,
      limit = 50,
      offset = 0,
    } = filters;

    const where: any = { user_id: userId };

    if (from_date) {
      where.started_at = { ...where.started_at, gte: new Date(from_date) };
    }

    if (to_date) {
      where.started_at = { ...where.started_at, lte: new Date(to_date) };
    }

    if (workout_session_id) {
      where.workout_session_id = workout_session_id;
    }

    const [logs, total] = await Promise.all([
      prisma.workoutLog.findMany({
        where,
        include: {
          exercise_logs: {
            include: {
              exercise: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  difficulty: true,
                  movement_pattern: {
                    select: {
                      name: true,
                      display_name: true,
                    },
                  },
                },
              },
            },
          },
          workout_session: {
            select: {
              id: true,
              name: true,
              week_number: true,
              session_number: true,
              scheduled_date: true,
            },
          },
        },
        orderBy: {
          started_at: 'desc',
        },
        take: limit,
        skip: offset,
      }),
      prisma.workoutLog.count({ where }),
    ]);

    return {
      logs,
      total,
      limit,
      offset,
      has_more: offset + logs.length < total,
    };
  },

  /**
   * Get a specific workout log by ID
   */
  async getWorkoutLogById(userId: string, logId: string) {
    const log = await prisma.workoutLog.findFirst({
      where: {
        id: logId,
        user_id: userId,
      },
      include: {
        exercise_logs: {
          include: {
            exercise: {
              select: {
                id: true,
                name: true,
                slug: true,
                difficulty: true,
                description: true,
                movement_pattern: {
                  select: {
                    name: true,
                    display_name: true,
                  },
                },
              },
            },
          },
        },
        workout_session: {
          select: {
            id: true,
            name: true,
            week_number: true,
            session_number: true,
            scheduled_date: true,
            workout_plan: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!log) {
      throw new Error('Workout log not found');
    }

    return log;
  },

  /**
   * Delete a workout log
   */
  async deleteWorkoutLog(userId: string, logId: string) {
    const log = await prisma.workoutLog.findFirst({
      where: {
        id: logId,
        user_id: userId,
      },
    });

    if (!log) {
      throw new Error('Workout log not found');
    }

    await prisma.workoutLog.delete({
      where: { id: logId },
    });

    return { success: true };
  },

  /**
   * Get workout statistics for a user
   */
  async getWorkoutStats(userId: string, days = 30) {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const logs = await prisma.workoutLog.findMany({
      where: {
        user_id: userId,
        started_at: { gte: fromDate },
      },
      include: {
        exercise_logs: true,
      },
    });

    const totalWorkouts = logs.length;
    const totalExercises = logs.reduce(
      (sum, log) => sum + log.exercise_logs.length,
      0
    );

    // Calculate average ratings
    const ratingsData = logs
      .map((log) => ({
        difficulty: log.overall_difficulty,
        energy: log.energy_level,
        enjoyment: log.enjoyment,
      }))
      .filter((r) => r.difficulty || r.energy || r.enjoyment);

    const avgDifficulty = ratingsData.length
      ? ratingsData.reduce((sum, r) => sum + (r.difficulty || 0), 0) /
        ratingsData.filter((r) => r.difficulty).length
      : null;

    const avgEnergy = ratingsData.length
      ? ratingsData.reduce((sum, r) => sum + (r.energy || 0), 0) /
        ratingsData.filter((r) => r.energy).length
      : null;

    const avgEnjoyment = ratingsData.length
      ? ratingsData.reduce((sum, r) => sum + (r.enjoyment || 0), 0) /
        ratingsData.filter((r) => r.enjoyment).length
      : null;

    // Calculate total training time
    const totalMinutes = logs.reduce((sum, log) => {
      const duration =
        (new Date(log.completed_at).getTime() -
          new Date(log.started_at).getTime()) /
        1000 /
        60;
      return sum + duration;
    }, 0);

    return {
      period_days: days,
      total_workouts: totalWorkouts,
      total_exercises: totalExercises,
      total_training_minutes: Math.round(totalMinutes),
      average_difficulty: avgDifficulty ? Math.round(avgDifficulty * 10) / 10 : null,
      average_energy_level: avgEnergy ? Math.round(avgEnergy * 10) / 10 : null,
      average_enjoyment: avgEnjoyment ? Math.round(avgEnjoyment * 10) / 10 : null,
    };
  },

  /**
   * Get exercise performance history for tracking progress
   */
  async getExerciseHistory(
    userId: string,
    exerciseId: string,
    limit = 20
  ) {
    const logs = await prisma.exerciseLog.findMany({
      where: {
        exercise_id: exerciseId,
        workout_log: {
          user_id: userId,
        },
      },
      include: {
        workout_log: {
          select: {
            id: true,
            started_at: true,
            completed_at: true,
          },
        },
      },
      orderBy: {
        workout_log: {
          started_at: 'desc',
        },
      },
      take: limit,
    });

    return logs.map((log) => ({
      workout_log_id: log.workout_log_id,
      date: log.workout_log.started_at,
      sets: log.sets,
      total_reps: log.total_reps,
      max_reps: log.max_reps,
      avg_rpe: log.avg_rpe,
    }));
  },
};
