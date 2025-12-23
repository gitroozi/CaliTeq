import { Request, Response } from 'express';
import exerciseService, { ExerciseFilters, PaginationOptions } from '../services/exercise.service';

// =====================================================
// EXERCISE CONTROLLER
// =====================================================

/**
 * Get all exercises with optional filtering and pagination
 * GET /api/exercises
 * Query params:
 *   - page: number (default: 1)
 *   - limit: number (default: 20, max: 100)
 *   - pattern: string (movement pattern name or ID)
 *   - difficulty: number (exact difficulty 1-10)
 *   - minDifficulty: number (min difficulty 1-10)
 *   - maxDifficulty: number (max difficulty 1-10)
 *   - equipment: string[] (comma-separated)
 *   - noEquipment: boolean
 *   - search: string (text search)
 */
export const getExercises = async (req: Request, res: Response) => {
  try {
    // Parse pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

    const pagination: PaginationOptions = { page, limit };

    // Parse filters
    const filters: ExerciseFilters = {};

    if (req.query.pattern) {
      filters.movementPattern = req.query.pattern as string;
    }

    if (req.query.difficulty) {
      filters.difficulty = parseInt(req.query.difficulty as string);
    }

    if (req.query.minDifficulty) {
      filters.minDifficulty = parseInt(req.query.minDifficulty as string);
    }

    if (req.query.maxDifficulty) {
      filters.maxDifficulty = parseInt(req.query.maxDifficulty as string);
    }

    if (req.query.equipment) {
      const equipmentParam = req.query.equipment as string;
      filters.equipment = equipmentParam.split(',').map((e) => e.trim());
    }

    if (req.query.noEquipment === 'true') {
      filters.noEquipment = true;
    }

    if (req.query.search) {
      filters.search = req.query.search as string;
    }

    const result = await exerciseService.getExercises(filters, pagination);

    return res.status(200).json({
      success: true,
      data: result.exercises,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    console.error('Get exercises error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch exercises',
    });
  }
};

/**
 * Get single exercise by ID or slug
 * GET /api/exercises/:idOrSlug
 */
export const getExerciseById = async (req: Request, res: Response) => {
  try {
    const { idOrSlug } = req.params;

    const exercise = await exerciseService.getExerciseById(idOrSlug);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        error: 'Exercise not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: exercise,
    });
  } catch (error) {
    console.error('Get exercise by ID error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch exercise',
    });
  }
};

/**
 * Get all movement patterns
 * GET /api/movement-patterns
 */
export const getMovementPatterns = async (req: Request, res: Response) => {
  try {
    const patterns = await exerciseService.getMovementPatterns();

    return res.status(200).json({
      success: true,
      data: patterns,
    });
  } catch (error) {
    console.error('Get movement patterns error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch movement patterns',
    });
  }
};

/**
 * Get exercises by movement pattern
 * GET /api/movement-patterns/:patternIdOrName/exercises
 */
export const getExercisesByPattern = async (req: Request, res: Response) => {
  try {
    const { patternIdOrName } = req.params;

    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

    const pagination: PaginationOptions = { page, limit };

    const result = await exerciseService.getExercisesByPattern(patternIdOrName, pagination);

    return res.status(200).json({
      success: true,
      data: result.exercises,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    console.error('Get exercises by pattern error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch exercises',
    });
  }
};

/**
 * Search exercises
 * GET /api/exercises/search
 * Query params:
 *   - q: string (search query)
 *   - pattern: string (optional)
 *   - difficulty: number (optional)
 *   - equipment: string[] (optional)
 *   - page: number (optional)
 *   - limit: number (optional)
 */
export const searchExercises = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query (q) is required',
      });
    }

    // Parse pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

    const pagination: PaginationOptions = { page, limit };

    // Parse additional filters
    const filters: Omit<ExerciseFilters, 'search'> = {};

    if (req.query.pattern) {
      filters.movementPattern = req.query.pattern as string;
    }

    if (req.query.difficulty) {
      filters.difficulty = parseInt(req.query.difficulty as string);
    }

    if (req.query.equipment) {
      const equipmentParam = req.query.equipment as string;
      filters.equipment = equipmentParam.split(',').map((e) => e.trim());
    }

    const result = await exerciseService.searchExercises(query, filters, pagination);

    return res.status(200).json({
      success: true,
      data: result.exercises,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    console.error('Search exercises error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to search exercises',
    });
  }
};

/**
 * Get exercise progression chain
 * GET /api/exercises/:id/progression-chain
 */
export const getProgressionChain = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const chain = await exerciseService.getProgressionChain(id);

    if (chain.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Exercise not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: chain,
    });
  } catch (error) {
    console.error('Get progression chain error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch progression chain',
    });
  }
};
