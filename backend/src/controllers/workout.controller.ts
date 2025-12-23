/**
 * Workout Controller
 *
 * HTTP request handlers for workout plan generation and retrieval
 */

import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateWorkoutPlan } from '../services/workout-generator/generator.service';

const prisma = new PrismaClient();

/**
 * Generate a new workout plan for the authenticated user
 * POST /api/workout-plans/generate
 */
export async function generatePlan(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Check if user already has an active plan
    const existingPlan = await prisma.workoutPlan.findFirst({
      where: {
        user_id: userId,
        status: 'active',
      },
    });

    if (existingPlan) {
      res.status(400).json({
        error: 'You already have an active workout plan',
        existingPlan: {
          id: existingPlan.id,
          name: existingPlan.name,
          startDate: existingPlan.start_date,
          endDate: existingPlan.end_date,
        },
      });
      return;
    }

    // Generate new plan
    const result = await generateWorkoutPlan({ userId });

    res.status(201).json({
      message: 'Workout plan generated successfully',
      plan: result.workoutPlan,
      stats: {
        totalSessions: result.sessionsCount,
        totalExercises: result.exercisesCount,
      },
    });
  } catch (error: any) {
    if (
      error.message.includes('profile') ||
      error.message.includes('required')
    ) {
      res.status(400).json({ error: error.message });
      return;
    }
    next(error);
  }
}

/**
 * Get user's active workout plan
 * GET /api/workout-plans/active
 */
export async function getActivePlan(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const plan = await prisma.workoutPlan.findFirst({
      where: {
        user_id: userId,
        status: 'active',
      },
      include: {
        workout_sessions: {
          orderBy: [{ week_number: 'asc' }, { day_of_week: 'asc' }],
          take: 10, // Return upcoming sessions
        },
      },
    });

    if (!plan) {
      res.status(404).json({ error: 'No active workout plan found' });
      return;
    }

    res.json(plan);
  } catch (error) {
    next(error);
  }
}

/**
 * Get a specific workout plan by ID
 * GET /api/workout-plans/:id
 */
export async function getPlanById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const plan = await prisma.workoutPlan.findFirst({
      where: {
        id,
        user_id: userId, // Ensure user can only access their own plans
      },
      include: {
        workout_sessions: {
          orderBy: [{ week_number: 'asc' }, { day_of_week: 'asc' }],
        },
      },
    });

    if (!plan) {
      res.status(404).json({ error: 'Workout plan not found' });
      return;
    }

    res.json(plan);
  } catch (error) {
    next(error);
  }
}

/**
 * Get all workout plans for user
 * GET /api/workout-plans
 */
export async function getUserPlans(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const plans = await prisma.workoutPlan.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        name: true,
        ai_explanation: true,
        start_date: true,
        end_date: true,
        duration_weeks: true,
        frequency: true,
        split_type: true,
        status: true,
        created_at: true,
        _count: {
          select: {
            workout_sessions: true,
          },
        },
      },
    });

    res.json(plans);
  } catch (error) {
    next(error);
  }
}

/**
 * Get today's workout session
 * GET /api/workout-sessions/today
 */
export async function getTodayWorkout(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const now = new Date();
    const today = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate()
    ));

    const session = await prisma.workoutSession.findFirst({
      where: {
        workout_plan: {
          user_id: userId,
          status: 'active',
        },
        scheduled_date: today,
      },
      include: {
        workout_session_exercises: {
          include: {
            exercise: {
              include: {
                movement_pattern: true,
              },
            },
          },
          orderBy: { exercise_order: 'asc' },
        },
      },
    });

    if (!session) {
      res.status(404).json({ error: 'No workout scheduled for today' });
      return;
    }

    res.json(session);
  } catch (error) {
    next(error);
  }
}

/**
 * Get a specific workout session by ID
 * GET /api/workout-sessions/:id
 */
export async function getSessionById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const session = await prisma.workoutSession.findFirst({
      where: {
        id,
        workout_plan: {
          user_id: userId, // Ensure user owns this session
        },
      },
      include: {
        workout_session_exercises: {
          include: {
            exercise: {
              include: {
                movement_pattern: true,
                progressions: true,
                regressions: true,
              },
            },
          },
          orderBy: { exercise_order: 'asc' },
        },
      },
    });

    if (!session) {
      res.status(404).json({ error: 'Workout session not found' });
      return;
    }

    res.json(session);
  } catch (error) {
    next(error);
  }
}

/**
 * Get sessions for a specific week
 * GET /api/workout-sessions/week/:weekNumber
 */
export async function getWeekSessions(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = (req as any).userId;
    const { weekNumber } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const week = parseInt(weekNumber);
    if (isNaN(week) || week < 1 || week > 12) {
      res.status(400).json({ error: 'Invalid week number (1-12)' });
      return;
    }

    const sessions = await prisma.workoutSession.findMany({
      where: {
        workout_plan: {
          user_id: userId,
          status: 'active',
        },
        week_number: week,
      },
      include: {
        workout_session_exercises: {
          include: {
            exercise: {
              include: {
                movement_pattern: true,
              },
            },
          },
          orderBy: { exercise_order: 'asc' },
        },
      },
      orderBy: { day_of_week: 'asc' },
    });

    res.json(sessions);
  } catch (error) {
    next(error);
  }
}

/**
 * Deactivate (archive) a workout plan
 * PUT /api/workout-plans/:id/deactivate
 */
export async function deactivatePlan(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const plan = await prisma.workoutPlan.findFirst({
      where: {
        id,
        user_id: userId,
      },
    });

    if (!plan) {
      res.status(404).json({ error: 'Workout plan not found' });
      return;
    }

    const updatedPlan = await prisma.workoutPlan.update({
      where: { id },
      data: {
        status: 'completed',
        updated_at: new Date(),
      },
    });

    res.json({
      message: 'Workout plan deactivated',
      plan: updatedPlan,
    });
  } catch (error) {
    next(error);
  }
}
