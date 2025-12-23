import { Router } from 'express';
import {
  getExercises,
  getExerciseById,
  getMovementPatterns,
  getExercisesByPattern,
  searchExercises,
  getProgressionChain,
} from '../controllers/exercise.controller';

const router = Router();

// =====================================================
// EXERCISE ROUTES
// =====================================================

/**
 * @route   GET /api/exercises/search
 * @desc    Search exercises by text query
 * @access  Public
 * @note    MUST be before /:idOrSlug to avoid conflicts
 */
router.get('/exercises/search', searchExercises);

/**
 * @route   GET /api/exercises
 * @desc    Get all exercises with optional filtering and pagination
 * @access  Public
 */
router.get('/exercises', getExercises);

/**
 * @route   GET /api/exercises/:idOrSlug
 * @desc    Get single exercise by ID or slug
 * @access  Public
 */
router.get('/exercises/:idOrSlug', getExerciseById);

/**
 * @route   GET /api/exercises/:id/progression-chain
 * @desc    Get exercise progression chain (all progressions from easiest to hardest)
 * @access  Public
 */
router.get('/exercises/:id/progression-chain', getProgressionChain);

/**
 * @route   GET /api/movement-patterns
 * @desc    Get all movement patterns
 * @access  Public
 */
router.get('/movement-patterns', getMovementPatterns);

/**
 * @route   GET /api/movement-patterns/:patternIdOrName/exercises
 * @desc    Get exercises by movement pattern
 * @access  Public
 */
router.get('/movement-patterns/:patternIdOrName/exercises', getExercisesByPattern);

export default router;
