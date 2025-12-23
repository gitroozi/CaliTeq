import { Router } from 'express';
import { workoutLogController } from '../controllers/workout-log.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/workout-logs/stats - Get workout statistics (must come before /:id)
router.get('/stats', workoutLogController.getWorkoutStats);

// GET /api/workout-logs/exercises/:exerciseId/history - Get exercise history
router.get(
  '/exercises/:exerciseId/history',
  workoutLogController.getExerciseHistory
);

// POST /api/workout-logs - Create a new workout log
router.post('/', workoutLogController.createWorkoutLog);

// GET /api/workout-logs - Get all workout logs for user
router.get('/', workoutLogController.getWorkoutLogs);

// GET /api/workout-logs/:id - Get specific workout log
router.get('/:id', workoutLogController.getWorkoutLogById);

// DELETE /api/workout-logs/:id - Delete a workout log
router.delete('/:id', workoutLogController.deleteWorkoutLog);

export default router;
