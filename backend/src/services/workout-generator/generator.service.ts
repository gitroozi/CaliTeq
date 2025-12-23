/**
 * Workout Generator Service
 *
 * Core service that orchestrates the generation of personalized 12-week workout programs.
 * Combines periodization templates, exercise selection, and user profile data.
 */

import { PrismaClient, User, UserProfile, Prisma } from '@prisma/client';
import {
  getPeriodizationTemplate,
  getMesocycleForWeek,
  isDeloadWeek,
  getDeloadParameters,
  getRestPeriod,
  getSets,
  PeriodizationTemplate,
  MesocycleTemplate,
} from './periodization';
import {
  selectExercisesForSession,
  getFullBodyPatternRequirements,
  getUpperLowerPatternRequirements,
  determineSplitType,
  getUserEquipment,
  getRecentExerciseIds,
} from './exercise-selector';

const prisma = new PrismaClient();

export interface WorkoutGenerationInput {
  userId: string;
}

export interface GeneratedWorkoutPlan {
  workoutPlan: {
    id: string;
    userId: string;
    name: string;
    description: string | null;
    startDate: Date;
    endDate: Date;
    totalWeeks: number;
    daysPerWeek: number;
    splitType: string;
    mesocycles: any;
    status: string;
  };
  sessionsCount: number;
  exercisesCount: number;
}

/**
 * Generate a complete 12-week workout program for a user
 */
export async function generateWorkoutPlan(
  input: WorkoutGenerationInput
): Promise<GeneratedWorkoutPlan> {
  // 1. Get user profile
  const user = await prisma.user.findUnique({
    where: { id: input.userId },
    include: { profile: true },
  });

  if (!user || !user.profile) {
    throw new Error('User profile not found. Complete onboarding first.');
  }

  const profile = user.profile;

  // 2. Validate profile completeness
  validateProfileForGeneration(profile);

  // 3. Determine training frequency
  const frequency = determineTrainingFrequency(profile);

  // 4. Select periodization template
  const template = getPeriodizationTemplate(
    profile.training_experience as
      | 'never'
      | 'beginner'
      | 'intermediate'
      | 'advanced'
  );

  // 5. Determine split type
  const splitType = determineSplitType(
    frequency,
    profile.training_experience as
      | 'never'
      | 'beginner'
      | 'intermediate'
      | 'advanced'
  );

  // 6. Get user equipment
  const equipment = (profile.equipment as any) || {};
  const availableEquipment = getUserEquipment({
    pullUpBar: equipment.pullUpBar,
    dipBars: equipment.dipBars,
    resistanceBands: equipment.resistanceBands,
    gymnasticsRings: equipment.gymnasticsRings,
    parallettes: equipment.parallettes,
    weightedVest: equipment.weightedVest,
  });

  // 7. Get user injuries
  const userInjuries = (profile.injuries as string[]) || [];

  // 8. Get recent exercise history
  const recentExerciseIds = await getRecentExerciseIds(input.userId);

  // 9. Create workout plan record
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + 12 * 7); // 12 weeks

  const workoutPlan = await prisma.workoutPlan.create({
    data: {
      user_id: input.userId,
      name: `${template.templateName} - ${new Date().toLocaleDateString()}`,
      ai_explanation: generatePlanDescription(profile, template),
      start_date: startDate,
      end_date: endDate,
      duration_weeks: 12,
      frequency: frequency,
      split_type: splitType,
      mesocycles: template.mesocycles as any,
      deload_weeks: template.deloadWeeks,
      status: 'active',
    },
  });

  // 10. Generate workout sessions for 12 weeks
  let sessionCount = 0;
  let exerciseCount = 0;

  for (let week = 1; week <= 12; week++) {
    let mesocycle = getMesocycleForWeek(template, week);
    const isDeload = isDeloadWeek(template, week);

    // For deload weeks, use the previous mesocycle's parameters
    if (!mesocycle && week > 1) {
      mesocycle = getMesocycleForWeek(template, week - 1);
    }

    if (!mesocycle) continue;

    // Generate sessions for this week
    const weeklySessionsData = await generateWeeklySessions({
      workoutPlanId: workoutPlan.id,
      userId: input.userId,
      week,
      startDate,
      frequency,
      splitType,
      mesocycle,
      isDeload,
      profile,
      availableEquipment,
      userInjuries,
      recentExerciseIds,
    });

    sessionCount += weeklySessionsData.sessionsCreated;
    exerciseCount += weeklySessionsData.exercisesCreated;
  }

  return {
    workoutPlan,
    sessionsCount: sessionCount,
    exercisesCount: exerciseCount,
  };
}

/**
 * Validate that user profile has required data for workout generation
 */
function validateProfileForGeneration(profile: UserProfile): void {
  const required = [
    'training_experience',
    'activity_level',
    'days_per_week',
    'minutes_per_session',
  ];

  for (const field of required) {
    if (!(profile as any)[field]) {
      throw new Error(`Profile missing required field: ${field}`);
    }
  }

  if (
    !profile.goals ||
    !Array.isArray(profile.goals) ||
    profile.goals.length === 0
  ) {
    throw new Error('Profile must have at least one fitness goal');
  }

  // Check assessment scores
  const assessmentScores = (profile.assessment_scores as any) || {};
  const assessmentFields = [
    'pushLevel',
    'pullLevel',
    'squatLevel',
    'hingeLevel',
    'coreLevel',
  ];

  for (const field of assessmentFields) {
    const value = assessmentScores[field];
    if (value === null || value === undefined) {
      throw new Error(`Profile missing assessment: ${field}`);
    }
  }
}

/**
 * Determine optimal training frequency based on user profile
 */
function determineTrainingFrequency(profile: UserProfile): number {
  let baseFrequency = profile.days_per_week;

  // Note: date_of_birth is stored in User model, not UserProfile
  // For age calculation, we'd need to join with User or pass it separately
  // Using a default for now
  const age = 30;

  if (profile.activity_level === 'sedentary' && age > 40) {
    baseFrequency = Math.min(baseFrequency, 3);
  }

  if (profile.minutes_per_session < 30) {
    baseFrequency = Math.min(baseFrequency + 1, 5);
  }

  if (profile.minutes_per_session > 60) {
    baseFrequency = Math.max(baseFrequency - 1, 2);
  }

  return Math.max(2, Math.min(baseFrequency, 5));
}

/**
 * Generate plan description based on user profile and template
 */
function generatePlanDescription(
  profile: UserProfile,
  template: PeriodizationTemplate
): string {
  const goals = (profile.goals as string[]) || [];
  const primaryGoal = goals[0] || 'general fitness';

  return `A personalized 12-week ${template.templateName.toLowerCase()} designed for ${primaryGoal}. This program includes ${template.mesocycles.length} training phases with strategic deload weeks for optimal recovery and progress.`;
}

/**
 * Generate workout sessions for a single week
 */
async function generateWeeklySessions(params: {
  workoutPlanId: string;
  userId: string;
  week: number;
  startDate: Date;
  frequency: number;
  splitType: string;
  mesocycle: MesocycleTemplate;
  isDeload: boolean;
  profile: UserProfile;
  availableEquipment: string[];
  userInjuries: string[];
  recentExerciseIds: string[];
}): Promise<{ sessionsCreated: number; exercisesCreated: number }> {
  const {
    workoutPlanId,
    userId,
    week,
    startDate,
    frequency,
    splitType,
    mesocycle,
    isDeload,
    profile,
    availableEquipment,
    userInjuries,
    recentExerciseIds,
  } = params;

  let sessionsCreated = 0;
  let exercisesCreated = 0;

  // Determine session schedule (e.g., Mon, Wed, Fri for 3x/week)
  const sessionDays = getSessionDays(frequency);

  for (let dayIndex = 0; dayIndex < sessionDays.length; dayIndex++) {
    const dayOfWeek = sessionDays[dayIndex];

    // Calculate session date
    const sessionDate = new Date(startDate);
    sessionDate.setDate(
      startDate.getDate() + (week - 1) * 7 + dayOfWeek - 1
    );

    // Determine session type based on split
    const sessionType = getSessionType(splitType, dayIndex, frequency);

    // Create workout session
    const session = await prisma.workoutSession.create({
      data: {
        workout_plan_id: workoutPlanId,
        user_id: userId,
        week_number: week,
        day_of_week: dayOfWeek,
        session_number: dayIndex + 1,
        scheduled_date: sessionDate,
        name: `Week ${week} - ${sessionType}`,
        warmup: getWarmupStructure(),
        cooldown: getCooldownStructure(),
        is_deload: isDeload,
        status: 'scheduled',
      },
    });

    sessionsCreated++;

    // Select exercises for this session
    const exercises = await selectExercisesForThisSession({
      sessionType,
      splitType,
      profile,
      availableEquipment,
      userInjuries,
      recentExerciseIds,
    });

    // Get base parameters from mesocycle
    let baseSets = getSets(mesocycle);
    let baseReps = mesocycle.reps;
    const restPeriod = getRestPeriod(mesocycle);

    // Apply deload adjustments if needed
    if (isDeload) {
      const deloadParams = getDeloadParameters({
        sets: baseSets,
        reps: baseReps,
      });
      baseSets = deloadParams.sets;
      baseReps = deloadParams.reps;
    }

    // Create exercise entries for this session
    for (let i = 0; i < exercises.length; i++) {
      await prisma.workoutSessionExercise.create({
        data: {
          workout_session_id: session.id,
          exercise_id: exercises[i].id,
          exercise_order: i + 1,
          sets: baseSets,
          reps: baseReps,
          rest_seconds: restPeriod,
          tempo: null,
          coaching_notes: generateCoachingNotes(exercises[i], profile),
        },
      });

      exercisesCreated++;
    }
  }

  return { sessionsCreated, exercisesCreated };
}

/**
 * Get session days based on frequency
 * Returns array of day numbers (1=Monday, 7=Sunday)
 */
function getSessionDays(frequency: number): number[] {
  const schedules: { [key: number]: number[] } = {
    2: [1, 4], // Monday, Thursday
    3: [1, 3, 5], // Monday, Wednesday, Friday
    4: [1, 2, 4, 5], // Mon, Tue, Thu, Fri
    5: [1, 2, 3, 5, 6], // Mon, Tue, Wed, Fri, Sat
  };

  return schedules[frequency] || schedules[3];
}

/**
 * Determine session type based on split and day
 */
function getSessionType(
  splitType: string,
  dayIndex: number,
  totalDays: number
): string {
  if (splitType === 'full-body') {
    return `Full Body ${String.fromCharCode(65 + (dayIndex % 2))}`; // A, B, A...
  }

  if (splitType === 'upper-lower') {
    return dayIndex % 2 === 0 ? 'Upper Body' : 'Lower Body';
  }

  if (splitType === 'push-pull-legs') {
    const types = ['Push', 'Pull', 'Legs'];
    return types[dayIndex % 3];
  }

  return 'Full Body';
}

/**
 * Select exercises for a specific session
 */
async function selectExercisesForThisSession(params: {
  sessionType: string;
  splitType: string;
  profile: UserProfile;
  availableEquipment: string[];
  userInjuries: string[];
  recentExerciseIds: string[];
}) {
  const { sessionType, profile, availableEquipment, userInjuries } = params;

  // Get movement patterns based on session type
  let patternRequirements: {
    patternId: string;
    userLevel: number;
    count?: number;
  }[] = [];

  if (sessionType.includes('Full Body')) {
    const patterns = await getFullBodyPatternRequirements();
    patternRequirements = patterns
      .filter((p) => p.required)
      .map((p) => ({
        patternId: p.patternId,
        userLevel: getUserLevelForPattern(p.patternName, profile),
        count: 1,
      }));
  } else if (sessionType.includes('Upper')) {
    const patterns = await getUpperLowerPatternRequirements('upper');
    patternRequirements = patterns.map((p) => ({
      patternId: p.patternId,
      userLevel: getUserLevelForPattern(p.patternName, profile),
      count: p.count,
    }));
  } else if (sessionType.includes('Lower')) {
    const patterns = await getUpperLowerPatternRequirements('lower');
    patternRequirements = patterns.map((p) => ({
      patternId: p.patternId,
      userLevel: getUserLevelForPattern(p.patternName, profile),
      count: p.count,
    }));
  }

  return await selectExercisesForSession(
    patternRequirements,
    availableEquipment,
    userInjuries,
    params.recentExerciseIds
  );
}

/**
 * Get user's skill level for a movement pattern
 */
function getUserLevelForPattern(
  patternName: string,
  profile: UserProfile
): number {
  const assessmentScores = (profile.assessment_scores as any) || {};

  const mapping: { [key: string]: string } = {
    'horizontal_push': 'pushLevel',
    'horizontal_pull': 'pullLevel',
    'vertical_push': 'pushLevel',
    'vertical_pull': 'pullLevel',
    'squat': 'squatLevel',
    'hinge': 'hingeLevel',
    'core_stability': 'coreLevel',
  };

  const fieldName = mapping[patternName];
  if (!fieldName) return 5; // Default to mid-level

  return assessmentScores[fieldName] || 5;
}

/**
 * Get warmup structure (stored as JSONB)
 */
function getWarmupStructure(): any {
  return {
    duration: '5-10 minutes',
    activities: [
      'Dynamic stretching',
      'Joint mobility',
      'Light movement preparation',
    ],
  };
}

/**
 * Get cooldown structure (stored as JSONB)
 */
function getCooldownStructure(): any {
  return {
    duration: '5 minutes',
    activities: ['Static stretching', 'Breathing exercises'],
  };
}

/**
 * Generate coaching notes for an exercise
 */
function generateCoachingNotes(exercise: any, profile: UserProfile): string {
  const injuries = (profile.injuries as string[]) || [];

  let notes = 'Focus on controlled movement and proper form.';

  // Add injury-specific notes
  if (injuries.includes('shoulder_pain') && exercise.targetMuscles) {
    const targets = exercise.targetMuscles as string[];
    if (
      targets.some((m: string) =>
        ['chest', 'shoulders', 'triceps'].includes(m)
      )
    ) {
      notes += ' Keep movements pain-free and reduce range if needed.';
    }
  }

  if (injuries.includes('knee_pain') && exercise.targetMuscles) {
    const targets = exercise.targetMuscles as string[];
    if (targets.some((m: string) => ['quads', 'glutes'].includes(m))) {
      notes += ' Avoid deep knee flexion if painful.';
    }
  }

  return notes;
}
