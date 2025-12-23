import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// =====================================================
// TYPES & INTERFACES
// =====================================================

export interface ExerciseFilters {
  movementPattern?: string; // Movement pattern name or ID
  difficulty?: number; // 1-10
  minDifficulty?: number;
  maxDifficulty?: number;
  equipment?: string[]; // Array of equipment names
  noEquipment?: boolean; // Only bodyweight exercises
  search?: string; // Text search in name/description
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface ExerciseResponse {
  id: string;
  name: string;
  slug: string;
  difficulty: number;
  description: string | null;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  setupInstructions: string | null;
  executionInstructions: string | null;
  commonMistakes: string[];
  coachingCues: string[];
  targetMuscles: string[];
  equipmentRequired: string[];
  contraindications: string[];
  tags: string[];
  movementPattern: {
    id: string;
    name: string;
    displayName: string;
    category: string;
  };
  progression?: {
    id: string;
    name: string;
    difficulty: number;
  } | null;
  regression?: {
    id: string;
    name: string;
    difficulty: number;
  } | null;
}

export interface MovementPatternResponse {
  id: string;
  name: string;
  displayName: string;
  category: string;
  description: string | null;
  sortOrder: number | null;
  exerciseCount: number;
}

// =====================================================
// EXERCISE SERVICE
// =====================================================

export class ExerciseService {
  /**
   * Get all exercises with optional filtering and pagination
   */
  async getExercises(
    filters: ExerciseFilters = {},
    pagination: PaginationOptions = {}
  ): Promise<{
    exercises: ExerciseResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = pagination.page || 1;
    const limit = pagination.limit || 20;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ExerciseWhereInput = {
      is_published: true,
    };

    // Filter by movement pattern
    if (filters.movementPattern) {
      // Check if it's a UUID or a name
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        filters.movementPattern
      );

      if (isUUID) {
        where.movement_pattern_id = filters.movementPattern;
      } else {
        where.movement_pattern = {
          name: filters.movementPattern,
        };
      }
    }

    // Filter by difficulty
    if (filters.difficulty !== undefined) {
      where.difficulty = filters.difficulty;
    } else {
      // Range filtering
      if (filters.minDifficulty !== undefined || filters.maxDifficulty !== undefined) {
        where.difficulty = {
          ...(filters.minDifficulty !== undefined && { gte: filters.minDifficulty }),
          ...(filters.maxDifficulty !== undefined && { lte: filters.maxDifficulty }),
        };
      }
    }

    // Filter by equipment
    if (filters.noEquipment) {
      where.equipment_required = {
        isEmpty: true,
      };
    } else if (filters.equipment && filters.equipment.length > 0) {
      where.equipment_required = {
        hasSome: filters.equipment,
      };
    }

    // Text search
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { tags: { hasSome: [filters.search.toLowerCase()] } },
      ];
    }

    // Get total count
    const total = await prisma.exercise.count({ where });

    // Get exercises
    const exercises = await prisma.exercise.findMany({
      where,
      skip,
      take: limit,
      include: {
        movement_pattern: true,
        progression: {
          select: {
            id: true,
            name: true,
            difficulty: true,
          },
        },
        regression: {
          select: {
            id: true,
            name: true,
            difficulty: true,
          },
        },
      },
      orderBy: [
        { movement_pattern: { sort_order: 'asc' } },
        { difficulty: 'asc' },
        { name: 'asc' },
      ],
    });

    const totalPages = Math.ceil(total / limit);

    return {
      exercises: exercises.map(this.formatExerciseResponse),
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Get single exercise by ID or slug
   */
  async getExerciseById(idOrSlug: string): Promise<ExerciseResponse | null> {
    // Check if it's a UUID or a slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      idOrSlug
    );

    const exercise = await prisma.exercise.findFirst({
      where: isUUID ? { id: idOrSlug } : { slug: idOrSlug },
      include: {
        movement_pattern: true,
        progression: {
          select: {
            id: true,
            name: true,
            difficulty: true,
          },
        },
        regression: {
          select: {
            id: true,
            name: true,
            difficulty: true,
          },
        },
      },
    });

    if (!exercise) {
      return null;
    }

    return this.formatExerciseResponse(exercise);
  }

  /**
   * Get all movement patterns
   */
  async getMovementPatterns(): Promise<MovementPatternResponse[]> {
    const patterns = await prisma.movementPattern.findMany({
      include: {
        _count: {
          select: {
            exercises: {
              where: {
                is_published: true,
              },
            },
          },
        },
      },
      orderBy: [{ sort_order: 'asc' }, { name: 'asc' }],
    });

    return patterns.map((pattern) => ({
      id: pattern.id,
      name: pattern.name,
      displayName: pattern.display_name,
      category: pattern.category,
      description: pattern.description,
      sortOrder: pattern.sort_order,
      exerciseCount: pattern._count.exercises,
    }));
  }

  /**
   * Get exercises by movement pattern
   */
  async getExercisesByPattern(
    patternIdOrName: string,
    pagination: PaginationOptions = {}
  ): Promise<{
    exercises: ExerciseResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return this.getExercises({ movementPattern: patternIdOrName }, pagination);
  }

  /**
   * Search exercises
   */
  async searchExercises(
    query: string,
    filters: Omit<ExerciseFilters, 'search'> = {},
    pagination: PaginationOptions = {}
  ): Promise<{
    exercises: ExerciseResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return this.getExercises({ ...filters, search: query }, pagination);
  }

  /**
   * Get exercise progression chain (all progressions from easiest to hardest)
   */
  async getProgressionChain(exerciseId: string): Promise<ExerciseResponse[]> {
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
      include: {
        movement_pattern: true,
        progression: true,
        regression: true,
      },
    });

    if (!exercise) {
      return [];
    }

    const chain: any[] = [];
    const visited = new Set<string>();

    // Find the easiest exercise in the chain (follow regressions)
    let current: any = exercise;
    visited.add(current.id);

    while (current.regression_id && !visited.has(current.regression_id)) {
      const regression = await prisma.exercise.findUnique({
        where: { id: current.regression_id },
        include: {
          movement_pattern: true,
          progression: true,
          regression: true,
        },
      });

      if (!regression) break;
      visited.add(regression.id);
      current = regression;
    }

    // Now follow progressions from the easiest exercise
    chain.push(current);
    visited.clear();
    visited.add(current.id);

    while (current.progression_id && !visited.has(current.progression_id)) {
      const progression = await prisma.exercise.findUnique({
        where: { id: current.progression_id },
        include: {
          movement_pattern: true,
          progression: true,
          regression: true,
        },
      });

      if (!progression) break;
      visited.add(progression.id);
      chain.push(progression);
      current = progression;
    }

    return chain.map(this.formatExerciseResponse);
  }

  /**
   * Format exercise for API response
   */
  private formatExerciseResponse(exercise: any): ExerciseResponse {
    return {
      id: exercise.id,
      name: exercise.name,
      slug: exercise.slug,
      difficulty: exercise.difficulty,
      description: exercise.description,
      videoUrl: exercise.video_url,
      thumbnailUrl: exercise.thumbnail_url,
      setupInstructions: exercise.setup_instructions,
      executionInstructions: exercise.execution_instructions,
      commonMistakes: exercise.common_mistakes,
      coachingCues: exercise.coaching_cues,
      targetMuscles: exercise.target_muscles,
      equipmentRequired: exercise.equipment_required,
      contraindications: exercise.contraindications,
      tags: exercise.tags,
      movementPattern: {
        id: exercise.movement_pattern.id,
        name: exercise.movement_pattern.name,
        displayName: exercise.movement_pattern.display_name,
        category: exercise.movement_pattern.category,
      },
      progression: exercise.progression
        ? {
            id: exercise.progression.id,
            name: exercise.progression.name,
            difficulty: exercise.progression.difficulty,
          }
        : null,
      regression: exercise.regression
        ? {
            id: exercise.regression.id,
            name: exercise.regression.name,
            difficulty: exercise.regression.difficulty,
          }
        : null,
    };
  }
}

export default new ExerciseService();
