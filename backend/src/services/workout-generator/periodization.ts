/**
 * Periodization Engine
 *
 * Defines training templates and mesocycle structures for different experience levels.
 * Implements linear periodization for beginners and undulating periodization for advanced.
 */

export interface MesocycleTemplate {
  name: string;
  weekStart: number; // 1-12
  weekEnd: number;
  focus: string;
  sets: number | { min: number; max: number };
  reps: string;
  restSeconds: number | { min: number; max: number };
  rpeTarget: number | { min: number; max: number };
  notes: string;
}

export interface PeriodizationTemplate {
  templateName: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  mesocycles: MesocycleTemplate[];
  deloadWeeks: number[];
}

/**
 * Beginner Template (0-6 months training)
 * Linear periodization: Anatomical Adaptation → Hypertrophy → Strength
 */
export const BEGINNER_TEMPLATE: PeriodizationTemplate = {
  templateName: 'Beginner Linear Periodization',
  experienceLevel: 'beginner',
  deloadWeeks: [4, 8, 12],
  mesocycles: [
    {
      name: 'Anatomical Adaptation',
      weekStart: 1,
      weekEnd: 3,
      focus: 'Movement pattern learning, connective tissue strengthening, work capacity building',
      sets: { min: 2, max: 3 },
      reps: '12-15',
      restSeconds: { min: 60, max: 90 },
      rpeTarget: { min: 6, max: 7 },
      notes: 'Higher reps with lower complexity builds work capacity, teaches patterns, and prepares joints/tendons for heavier loading.',
    },
    {
      name: 'Hypertrophy Introduction',
      weekStart: 5,
      weekEnd: 7,
      focus: 'Muscle building, volume increase, progressive overload',
      sets: 3,
      reps: '8-12',
      restSeconds: { min: 90, max: 120 },
      rpeTarget: { min: 7, max: 8 },
      notes: 'Rep range and volume optimal for muscle protein synthesis. Intensity increases while recovery capacity improves.',
    },
    {
      name: 'Strength Preparation',
      weekStart: 9,
      weekEnd: 11,
      focus: 'Strength development, harder progressions, skill introduction',
      sets: { min: 3, max: 4 },
      reps: '6-10',
      restSeconds: { min: 120, max: 180 },
      rpeTarget: { min: 8, max: 9 },
      notes: 'Lower reps with harder progressions build maximal strength. Prepares for advanced training methods.',
    },
  ],
};

/**
 * Intermediate Template (6-18 months training)
 * Daily Undulating Periodization (DUP)
 */
export const INTERMEDIATE_TEMPLATE: PeriodizationTemplate = {
  templateName: 'Intermediate DUP',
  experienceLevel: 'intermediate',
  deloadWeeks: [4, 8, 12],
  mesocycles: [
    {
      name: 'Strength Phase',
      weekStart: 1,
      weekEnd: 3,
      focus: 'Maximal strength development with undulating volume',
      sets: { min: 4, max: 5 },
      reps: '5-6',
      restSeconds: { min: 120, max: 180 },
      rpeTarget: { min: 8, max: 9 },
      notes: 'Lower reps, higher sets for strength. Alternate with hypertrophy days.',
    },
    {
      name: 'Hypertrophy Phase',
      weekStart: 5,
      weekEnd: 7,
      focus: 'Muscle building with moderate volume and intensity',
      sets: { min: 3, max: 4 },
      reps: '8-12',
      restSeconds: { min: 90, max: 120 },
      rpeTarget: { min: 7, max: 8 },
      notes: 'Classic hypertrophy range. Varies within each week with strength days.',
    },
    {
      name: 'Peak Intensity',
      weekStart: 9,
      weekEnd: 11,
      focus: 'Maximum intensity with reduced volume',
      sets: { min: 3, max: 4 },
      reps: '3-5',
      restSeconds: { min: 180, max: 240 },
      rpeTarget: 9,
      notes: 'Highest intensity week. Focus on skill work and advanced progressions.',
    },
  ],
};

/**
 * Advanced Template (18+ months training)
 * Block periodization: Accumulation → Intensification → Realization
 */
export const ADVANCED_TEMPLATE: PeriodizationTemplate = {
  templateName: 'Advanced Block Periodization',
  experienceLevel: 'advanced',
  deloadWeeks: [5, 9, 12],
  mesocycles: [
    {
      name: 'Accumulation Block',
      weekStart: 1,
      weekEnd: 4,
      focus: 'High volume, moderate intensity - build work capacity and muscle mass',
      sets: { min: 4, max: 5 },
      reps: '10-15',
      restSeconds: { min: 60, max: 90 },
      rpeTarget: { min: 7, max: 8 },
      notes: 'Volume accumulation phase. Builds capacity for intensification.',
    },
    {
      name: 'Intensification Block',
      weekStart: 6,
      weekEnd: 8,
      focus: 'Moderate volume, high intensity - convert hypertrophy to strength',
      sets: { min: 3, max: 4 },
      reps: '5-8',
      restSeconds: { min: 120, max: 180 },
      rpeTarget: { min: 8, max: 9 },
      notes: 'Intensity increases while volume decreases. Converts mass to strength.',
    },
    {
      name: 'Realization Block',
      weekStart: 10,
      weekEnd: 11,
      focus: 'Low volume, maximum intensity - peak performance and PR testing',
      sets: { min: 2, max: 3 },
      reps: '1-5',
      restSeconds: { min: 180, max: 300 },
      rpeTarget: 9,
      notes: 'Peak performance phase. Max effort attempts and skill demonstrations.',
    },
  ],
};

/**
 * Get periodization template based on user experience
 */
export function getPeriodizationTemplate(
  experience: 'never' | 'beginner' | 'intermediate' | 'advanced'
): PeriodizationTemplate {
  switch (experience) {
    case 'never':
    case 'beginner':
      return BEGINNER_TEMPLATE;
    case 'intermediate':
      return INTERMEDIATE_TEMPLATE;
    case 'advanced':
      return ADVANCED_TEMPLATE;
    default:
      return BEGINNER_TEMPLATE;
  }
}

/**
 * Get mesocycle for a specific week
 */
export function getMesocycleForWeek(
  template: PeriodizationTemplate,
  weekNumber: number
): MesocycleTemplate | null {
  return (
    template.mesocycles.find(
      (m) => weekNumber >= m.weekStart && weekNumber <= m.weekEnd
    ) || null
  );
}

/**
 * Check if week is a deload week
 */
export function isDeloadWeek(
  template: PeriodizationTemplate,
  weekNumber: number
): boolean {
  return template.deloadWeeks.includes(weekNumber);
}

/**
 * Calculate deload parameters (50% volume reduction)
 */
export function getDeloadParameters(normalParams: {
  sets: number;
  reps: string;
}): { sets: number; reps: string } {
  const deloadSets = Math.max(1, Math.floor(normalParams.sets * 0.5));

  // Reduce reps by 20-30%
  const repMatch = normalParams.reps.match(/(\d+)-(\d+)/);
  if (repMatch) {
    const minReps = parseInt(repMatch[1]);
    const maxReps = parseInt(repMatch[2]);
    const deloadMinReps = Math.max(1, Math.floor(minReps * 0.7));
    const deloadMaxReps = Math.max(1, Math.floor(maxReps * 0.7));
    return {
      sets: deloadSets,
      reps: `${deloadMinReps}-${deloadMaxReps}`,
    };
  }

  return {
    sets: deloadSets,
    reps: normalParams.reps,
  };
}

/**
 * Get rest period based on mesocycle
 */
export function getRestPeriod(mesocycle: MesocycleTemplate): number {
  if (typeof mesocycle.restSeconds === 'number') {
    return mesocycle.restSeconds;
  }
  // Return middle of range
  return Math.floor(
    (mesocycle.restSeconds.min + mesocycle.restSeconds.max) / 2
  );
}

/**
 * Get sets for mesocycle
 */
export function getSets(mesocycle: MesocycleTemplate): number {
  if (typeof mesocycle.sets === 'number') {
    return mesocycle.sets;
  }
  // Return max sets for normal weeks
  return mesocycle.sets.max;
}
