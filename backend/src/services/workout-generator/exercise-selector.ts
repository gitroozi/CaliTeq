/**
 * Exercise Selection Service
 *
 * Implements the filtering and selection logic for choosing appropriate exercises
 * based on user profile, movement patterns, difficulty, equipment, and contraindications.
 */

import { PrismaClient, Exercise, MovementPattern } from '@prisma/client';

const prisma = new PrismaClient();

export interface ExerciseSelectionCriteria {
  movementPatternId: string;
  userLevel: number; // 1-10 skill level for this pattern
  availableEquipment: string[];
  userInjuries: string[];
  recentExerciseIds?: string[]; // Exercises performed in last 14 days
  favoriteExerciseIds?: string[];
}

export interface SelectedExercise {
  exercise: Exercise;
  sets: number;
  reps: string;
  restSeconds: number;
  order: number;
}

/**
 * Select an exercise for a given movement pattern
 */
export async function selectExercise(
  criteria: ExerciseSelectionCriteria
): Promise<Exercise | null> {
  // Step 1: Get all exercises for the movement pattern
  let exercises = await prisma.exercise.findMany({
    where: {
      movement_pattern_id: criteria.movementPatternId,
      is_published: true,
    },
  });

  if (exercises.length === 0) {
    return null;
  }

  // Step 2: Filter by difficulty (slightly below to slightly above user level)
  const minDifficulty = Math.max(1, criteria.userLevel - 1);
  const maxDifficulty = criteria.userLevel + 2; // Allow exercises up to 2 levels above

  exercises = exercises.filter(
    (e) => e.difficulty >= minDifficulty && e.difficulty <= maxDifficulty
  );

  // Step 3: Filter by equipment availability
  exercises = exercises.filter((e) => {
    if (!e.equipment_required || e.equipment_required.length === 0) {
      return true; // No equipment needed
    }
    // Check if all required equipment is available
    return (e.equipment_required as string[]).every((eq) =>
      criteria.availableEquipment.includes(eq)
    );
  });

  // Step 4: Filter by contraindications
  if (criteria.userInjuries && criteria.userInjuries.length > 0) {
    exercises = exercises.filter((e) => {
      if (!e.contraindications || e.contraindications.length === 0) {
        return true; // No contraindications
      }
      // Check if any contraindication matches user injuries
      return !(e.contraindications as string[]).some((contra) =>
        criteria.userInjuries.includes(contra)
      );
    });
  }

  if (exercises.length === 0) {
    return null;
  }

  // Step 5: Apply preference weighting and selection
  const recentIds = new Set(criteria.recentExerciseIds || []);
  const favoriteIds = new Set(criteria.favoriteExerciseIds || []);

  // Prioritize favorites not done recently
  const favoritesNotRecent = exercises.filter(
    (e) => favoriteIds.has(e.id) && !recentIds.has(e.id)
  );

  if (favoritesNotRecent.length > 0) {
    return selectRandomExercise(favoritesNotRecent);
  }

  // Choose from exercises not done recently
  const freshExercises = exercises.filter((e) => !recentIds.has(e.id));

  if (freshExercises.length > 0) {
    // From fresh exercises, prefer higher difficulty
    const sortedByDifficulty = freshExercises.sort(
      (a, b) => b.difficulty - a.difficulty
    );
    // Take top 3 by difficulty and randomly select
    const topExercises = sortedByDifficulty.slice(
      0,
      Math.min(3, sortedByDifficulty.length)
    );
    return selectRandomExercise(topExercises);
  }

  // All exercises done recently, choose highest difficulty
  const sortedByDifficulty = exercises.sort(
    (a, b) => b.difficulty - a.difficulty
  );
  return sortedByDifficulty[0];
}

/**
 * Select multiple exercises for a workout session
 */
export async function selectExercisesForSession(
  patterns: {
    patternId: string;
    userLevel: number;
    count?: number; // How many exercises for this pattern
  }[],
  availableEquipment: string[],
  userInjuries: string[],
  recentExerciseIds?: string[],
  favoriteExerciseIds?: string[]
): Promise<Exercise[]> {
  const selectedExercises: Exercise[] = [];

  for (const pattern of patterns) {
    const count = pattern.count || 1;

    for (let i = 0; i < count; i++) {
      const exercise = await selectExercise({
        movementPatternId: pattern.patternId,
        userLevel: pattern.userLevel,
        availableEquipment,
        userInjuries,
        recentExerciseIds: [
          ...(recentExerciseIds || []),
          ...selectedExercises.map((e) => e.id),
        ],
        favoriteExerciseIds,
      });

      if (exercise) {
        selectedExercises.push(exercise);
      }
    }
  }

  return selectedExercises;
}

/**
 * Get movement pattern requirements for a full-body session
 */
export async function getFullBodyPatternRequirements(): Promise<
  { patternId: string; patternName: string; required: boolean }[]
> {
  const patterns = await prisma.movementPattern.findMany({
    where: { category: 'primary' },
    orderBy: { sort_order: 'asc' },
  });

  return patterns.map((p) => ({
    patternId: p.id,
    patternName: p.name,
    required: [
      'horizontal_push',
      'horizontal_pull',
      'squat',
      'hinge',
      'core_stability',
    ].includes(p.name),
  }));
}

/**
 * Get movement pattern requirements for upper/lower split
 */
export async function getUpperLowerPatternRequirements(
  sessionType: 'upper' | 'lower'
): Promise<{ patternId: string; patternName: string; count: number }[]> {
  const patterns = await prisma.movementPattern.findMany({
    where: { category: 'primary' },
    orderBy: { sort_order: 'asc' },
  });

  if (sessionType === 'upper') {
    return patterns
      .filter((p) =>
        [
          'horizontal_push',
          'horizontal_pull',
          'vertical_push',
          'vertical_pull',
          'core_stability',
        ].includes(p.name)
      )
      .map((p) => ({
        patternId: p.id,
        patternName: p.name,
        count: p.name === 'core_stability' ? 1 : 1,
      }));
  } else {
    // lower
    return patterns
      .filter((p) => ['squat', 'hinge', 'core_stability'].includes(p.name))
      .map((p) => ({
        patternId: p.id,
        patternName: p.name,
        count: p.name === 'core_stability' ? 2 : 2,
      }));
  }
}

/**
 * Determine split type based on frequency and experience
 */
export function determineSplitType(
  frequency: number,
  experience: 'never' | 'beginner' | 'intermediate' | 'advanced'
): 'full-body' | 'upper-lower' | 'push-pull-legs' {
  if (frequency <= 3 && (experience === 'never' || experience === 'beginner')) {
    return 'full-body';
  }

  if (frequency === 3 && experience !== 'never' && experience !== 'beginner') {
    return 'full-body'; // Can also be upper-lower, defaulting to full-body
  }

  if (frequency === 4) {
    return 'upper-lower';
  }

  if (frequency >= 5) {
    return 'push-pull-legs';
  }

  return 'full-body';
}

/**
 * Get user's available equipment as array
 */
export function getUserEquipment(userProfile: {
  pullUpBar: boolean;
  dipBars: boolean;
  resistanceBands: boolean;
  gymnasticsRings: boolean;
  parallettes: boolean;
  weightedVest: boolean;
}): string[] {
  const equipment: string[] = ['none']; // Bodyweight always available

  if (userProfile.pullUpBar) equipment.push('pull_up_bar');
  if (userProfile.dipBars) equipment.push('dip_bars');
  if (userProfile.resistanceBands) equipment.push('resistance_bands');
  if (userProfile.gymnasticsRings) equipment.push('gymnastics_rings');
  if (userProfile.parallettes) equipment.push('parallettes');
  if (userProfile.weightedVest) equipment.push('weighted_vest');

  return equipment;
}

/**
 * Helper: Select random exercise from array
 */
function selectRandomExercise(exercises: Exercise[]): Exercise {
  return exercises[Math.floor(Math.random() * exercises.length)];
}

/**
 * Get recent exercise IDs from user's workout history
 */
export async function getRecentExerciseIds(
  userId: string,
  days: number = 14
): Promise<string[]> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const recentLogs = await prisma.workoutLog.findMany({
    where: {
      user_id: userId,
      completed_at: {
        gte: cutoffDate,
      },
    },
    include: {
      exercise_logs: {
        select: {
          exercise_id: true,
        },
      },
    },
  });

  const exerciseIds = new Set<string>();
  recentLogs.forEach((log) => {
    log.exercise_logs.forEach((exLog) => {
      exerciseIds.add(exLog.exercise_id);
    });
  });

  return Array.from(exerciseIds);
}
