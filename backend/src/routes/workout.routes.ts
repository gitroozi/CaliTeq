/**
 * Workout Routes
 *
 * Route definitions for workout plan and session endpoints
 */

import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as workoutController from '../controllers/workout.controller';

const router = Router();

// All workout routes require authentication
router.use(authenticate);

// Workout Plan routes
router.post('/workout-plans/generate', workoutController.generatePlan);
router.get('/workout-plans/active', workoutController.getActivePlan);
router.get('/workout-plans/:id', workoutController.getPlanById);
router.get('/workout-plans', workoutController.getUserPlans);
router.put('/workout-plans/:id/deactivate', workoutController.deactivatePlan);

// Workout Session routes
router.get('/workout-sessions/today', workoutController.getTodayWorkout);
router.get('/workout-sessions/week/:weekNumber', workoutController.getWeekSessions);
router.get('/workout-sessions/:id', workoutController.getSessionById);

export default router;
