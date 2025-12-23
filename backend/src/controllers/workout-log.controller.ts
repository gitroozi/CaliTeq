import { Response } from 'express';
import { AuthRequest } from '../types/express';
import { workoutLogService } from '../services/workout-log.service';

export const workoutLogController = {
  /**
   * Create a new workout log
   * POST /api/workout-logs
   */
  async createWorkoutLog(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({
          error: 'Unauthorized',
        });
      }
      const logData = req.body;

      // Validate required fields
      if (!logData.started_at || !logData.completed_at) {
        return res.status(400).json({
          error: 'Missing required fields: started_at, completed_at',
        });
      }

      if (!logData.exercises || !Array.isArray(logData.exercises)) {
        return res.status(400).json({
          error: 'exercises must be an array',
        });
      }

      if (logData.exercises.length === 0) {
        return res.status(400).json({
          error: 'At least one exercise must be logged',
        });
      }

      // Validate each exercise has required fields
      for (let i = 0; i < logData.exercises.length; i++) {
        const exercise = logData.exercises[i];
        if (!exercise.exercise_id) {
          return res.status(400).json({
            error: `Exercise at index ${i} missing exercise_id`,
          });
        }
        if (!exercise.sets || !Array.isArray(exercise.sets)) {
          return res.status(400).json({
            error: `Exercise at index ${i} missing sets array`,
          });
        }
        if (exercise.sets.length === 0) {
          return res.status(400).json({
            error: `Exercise at index ${i} must have at least one set`,
          });
        }
      }

      const workoutLog = await workoutLogService.createWorkoutLog(
        userId,
        logData
      );

      return res.status(201).json({
        success: true,
        data: workoutLog,
      });
    } catch (error: any) {
      console.error('Error creating workout log:', error);
      return res.status(400).json({
        error: error.message || 'Failed to create workout log',
      });
    }
  },

  /**
   * Get all workout logs for the authenticated user
   * GET /api/workout-logs
   */
  async getWorkoutLogs(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({
          error: 'Unauthorized',
        });
      }
      const {
        from_date,
        to_date,
        workout_session_id,
        limit,
        offset,
      } = req.query;

      const filters = {
        from_date: from_date ? String(from_date) : undefined,
        to_date: to_date ? String(to_date) : undefined,
        workout_session_id: workout_session_id
          ? String(workout_session_id)
          : undefined,
        limit: limit ? parseInt(String(limit), 10) : undefined,
        offset: offset ? parseInt(String(offset), 10) : undefined,
      };

      // Validate limit and offset
      if (filters.limit && (filters.limit < 1 || filters.limit > 100)) {
        return res.status(400).json({
          error: 'limit must be between 1 and 100',
        });
      }

      if (filters.offset && filters.offset < 0) {
        return res.status(400).json({
          error: 'offset must be non-negative',
        });
      }

      const result = await workoutLogService.getWorkoutLogs(userId, filters);

      return res.json({
        success: true,
        data: result.logs,
        pagination: {
          total: result.total,
          limit: result.limit,
          offset: result.offset,
          has_more: result.has_more,
        },
      });
    } catch (error: any) {
      console.error('Error fetching workout logs:', error);
      return res.status(500).json({
        error: error.message || 'Failed to fetch workout logs',
      });
    }
  },

  /**
   * Get a specific workout log by ID
   * GET /api/workout-logs/:id
   */
  async getWorkoutLogById(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({
          error: 'Unauthorized',
        });
      }
      const { id } = req.params;

      const log = await workoutLogService.getWorkoutLogById(userId, id);

      return res.json({
        success: true,
        data: log,
      });
    } catch (error: any) {
      console.error('Error fetching workout log:', error);
      const statusCode = error.message === 'Workout log not found' ? 404 : 500;
      return res.status(statusCode).json({
        error: error.message || 'Failed to fetch workout log',
      });
    }
  },

  /**
   * Delete a workout log
   * DELETE /api/workout-logs/:id
   */
  async deleteWorkoutLog(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({
          error: 'Unauthorized',
        });
      }
      const { id } = req.params;

      await workoutLogService.deleteWorkoutLog(userId, id);

      return res.json({
        success: true,
        message: 'Workout log deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting workout log:', error);
      const statusCode = error.message === 'Workout log not found' ? 404 : 500;
      return res.status(statusCode).json({
        error: error.message || 'Failed to delete workout log',
      });
    }
  },

  /**
   * Get workout statistics for the authenticated user
   * GET /api/workout-logs/stats
   */
  async getWorkoutStats(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({
          error: 'Unauthorized',
        });
      }
      const { days } = req.query;

      const daysInt = days ? parseInt(String(days), 10) : 30;

      if (daysInt < 1 || daysInt > 365) {
        return res.status(400).json({
          error: 'days must be between 1 and 365',
        });
      }

      const stats = await workoutLogService.getWorkoutStats(userId, daysInt);

      return res.json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      console.error('Error fetching workout stats:', error);
      return res.status(500).json({
        error: error.message || 'Failed to fetch workout stats',
      });
    }
  },

  /**
   * Get exercise performance history
   * GET /api/workout-logs/exercises/:exerciseId/history
   */
  async getExerciseHistory(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({
          error: 'Unauthorized',
        });
      }
      const { exerciseId } = req.params;
      const { limit } = req.query;

      const limitInt = limit ? parseInt(String(limit), 10) : 20;

      if (limitInt < 1 || limitInt > 100) {
        return res.status(400).json({
          error: 'limit must be between 1 and 100',
        });
      }

      const history = await workoutLogService.getExerciseHistory(
        userId,
        exerciseId,
        limitInt
      );

      return res.json({
        success: true,
        data: history,
      });
    } catch (error: any) {
      console.error('Error fetching exercise history:', error);
      return res.status(500).json({
        error: error.message || 'Failed to fetch exercise history',
      });
    }
  },
};
