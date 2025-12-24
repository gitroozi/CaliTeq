/**
 * Workout Routes
 *
 * Route definitions for workout plan and session endpoints
 */

import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as workoutController from '../controllers/workout.controller';

const router = Router();

// Workout Plan routes (all require authentication)
router.post('/workout-plans/generate', authenticate, workoutController.generatePlan);
router.get('/workout-plans/active', authenticate, workoutController.getActivePlan);
router.get('/workout-plans/:id', authenticate, workoutController.getPlanById);
router.get('/workout-plans', authenticate, workoutController.getUserPlans);
router.put('/workout-plans/:id/deactivate', authenticate, workoutController.deactivatePlan);

// Workout Session routes (all require authentication)
router.get('/workout-sessions/today', authenticate, workoutController.getTodayWorkout);
router.get('/workout-sessions/week/:weekNumber', authenticate, workoutController.getWeekSessions);
router.get('/workout-sessions/:id', authenticate, workoutController.getSessionById);

export default router;
