import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // =====================================================
  // MOVEMENT PATTERNS
  // =====================================================
  console.log('Creating movement patterns...')

  const horizontalPush = await prisma.movementPattern.create({
    data: {
      name: 'horizontal_push',
      display_name: 'Horizontal Push',
      category: 'primary',
      description: 'Pushing movements in horizontal plane (push-ups, dips)',
      sort_order: 1,
    },
  })

  const verticalPush = await prisma.movementPattern.create({
    data: {
      name: 'vertical_push',
      display_name: 'Vertical Push',
      category: 'primary',
      description: 'Pushing movements in vertical plane (pike push-ups, handstands)',
      sort_order: 2,
    },
  })

  const horizontalPull = await prisma.movementPattern.create({
    data: {
      name: 'horizontal_pull',
      display_name: 'Horizontal Pull',
      category: 'primary',
      description: 'Pulling movements in horizontal plane (rows)',
      sort_order: 3,
    },
  })

  const verticalPull = await prisma.movementPattern.create({
    data: {
      name: 'vertical_pull',
      display_name: 'Vertical Pull',
      category: 'primary',
      description: 'Pulling movements in vertical plane (pull-ups, chin-ups)',
      sort_order: 4,
    },
  })

  const squat = await prisma.movementPattern.create({
    data: {
      name: 'squat',
      display_name: 'Squat',
      category: 'primary',
      description: 'Knee-dominant lower body movements',
      sort_order: 5,
    },
  })

  const hinge = await prisma.movementPattern.create({
    data: {
      name: 'hinge',
      display_name: 'Hinge',
      category: 'primary',
      description: 'Hip-dominant lower body movements',
      sort_order: 6,
    },
  })

  const coreStability = await prisma.movementPattern.create({
    data: {
      name: 'core_stability',
      display_name: 'Core Stability',
      category: 'primary',
      description: 'Anti-extension, anti-flexion, anti-rotation core exercises',
      sort_order: 7,
    },
  })

  console.log('✅ Created 7 primary movement patterns')

  // =====================================================
  // HORIZONTAL PUSH EXERCISES
  // =====================================================
  console.log('Creating horizontal push exercises...')

  const wallPushups = await prisma.exercise.create({
    data: {
      name: 'Wall Push-ups',
      slug: 'wall-push-ups',
      movement_pattern_id: horizontalPush.id,
      difficulty: 1,
      description: 'Push-ups performed against a wall at an upright angle.',
      setup_instructions: 'Stand arm\'s length from wall. Place hands on wall at shoulder height.',
      execution_instructions: 'Lean forward, bend elbows to bring chest to wall. Push back to starting position.',
      common_mistakes: ['Flaring elbows too wide', 'Arching lower back', 'Not going deep enough'],
      coaching_cues: ['Keep core tight', 'Control the descent', 'Full range of motion'],
      target_muscles: ['pectoralis major', 'triceps', 'anterior deltoid'],
      equipment_required: [],
      contraindications: [],
      tags: ['beginner', 'bodyweight', 'chest'],
      estimated_time_to_master_weeks: 2,
    },
  })

  const inclinePushupsHigh = await prisma.exercise.create({
    data: {
      name: 'Incline Push-ups (High)',
      slug: 'incline-push-ups-high',
      movement_pattern_id: horizontalPush.id,
      difficulty: 2,
      description: 'Push-ups with hands on elevated surface (table, counter height).',
      setup_instructions: 'Place hands on stable elevated surface at hip height.',
      execution_instructions: 'Lower chest to surface, then push back up.',
      common_mistakes: ['Sagging hips', 'Incomplete range of motion'],
      coaching_cues: ['Straight line from head to heels', 'Touch chest to surface'],
      target_muscles: ['pectoralis major', 'triceps', 'anterior deltoid'],
      equipment_required: ['elevated_surface'],
      contraindications: [],
      tags: ['beginner', 'bodyweight', 'chest'],
      estimated_time_to_master_weeks: 3,
    },
  })

  const standardPushups = await prisma.exercise.create({
    data: {
      name: 'Standard Push-ups',
      slug: 'standard-push-ups',
      movement_pattern_id: horizontalPush.id,
      difficulty: 5,
      description: 'Classic push-up from the floor. MAJOR MILESTONE exercise.',
      setup_instructions: 'Start in plank position with hands shoulder-width apart.',
      execution_instructions: 'Lower body until chest nearly touches floor. Push back to starting position.',
      common_mistakes: ['Flaring elbows past 45 degrees', 'Sagging hips', 'Head jutting forward'],
      coaching_cues: ['Elbows 45 degrees', 'Core braced', 'Full ROM'],
      target_muscles: ['pectoralis major', 'triceps', 'anterior deltoid', 'core'],
      equipment_required: [],
      contraindications: [],
      tags: ['intermediate', 'bodyweight', 'chest', 'milestone'],
      estimated_time_to_master_weeks: 8,
    },
  })

  const diamondPushups = await prisma.exercise.create({
    data: {
      name: 'Diamond Push-ups',
      slug: 'diamond-push-ups',
      movement_pattern_id: horizontalPush.id,
      difficulty: 7,
      description: 'Close-grip push-ups with hands forming diamond shape.',
      setup_instructions: 'Hands close together forming diamond/triangle shape with thumbs and index fingers.',
      execution_instructions: 'Lower chest to hands, keeping elbows close to body. Push back up.',
      common_mistakes: ['Elbows flaring out', 'Incomplete depth'],
      coaching_cues: ['Elbows track back', 'Triceps focused'],
      target_muscles: ['triceps', 'pectoralis major', 'anterior deltoid'],
      equipment_required: [],
      contraindications: [],
      tags: ['advanced', 'bodyweight', 'triceps'],
      estimated_time_to_master_weeks: 12,
    },
  })

  // =====================================================
  // VERTICAL PULL EXERCISES
  // =====================================================
  console.log('Creating vertical pull exercises...')

  const deadHang = await prisma.exercise.create({
    data: {
      name: 'Dead Hang',
      slug: 'dead-hang',
      movement_pattern_id: verticalPull.id,
      difficulty: 2,
      description: 'Static hang from pull-up bar with straight arms.',
      setup_instructions: 'Grab pull-up bar with overhand grip, shoulder-width apart.',
      execution_instructions: 'Hang with straight arms, engage shoulders down and back.',
      common_mistakes: ['Completely relaxed shoulders', 'Swinging'],
      coaching_cues: ['Active shoulders', 'Scapular depression'],
      target_muscles: ['latissimus dorsi', 'forearms', 'grip'],
      equipment_required: ['pull_up_bar'],
      contraindications: [],
      tags: ['beginner', 'bodyweight', 'back', 'grip'],
      estimated_time_to_master_weeks: 2,
    },
  })

  const negativesPullups = await prisma.exercise.create({
    data: {
      name: 'Negative Pull-ups',
      slug: 'negative-pull-ups',
      movement_pattern_id: verticalPull.id,
      difficulty: 4,
      description: 'Eccentric-only pull-ups, jumping or stepping to top position.',
      setup_instructions: 'Jump or step to top of pull-up (chin over bar).',
      execution_instructions: 'Lower yourself slowly (3-5 seconds) to dead hang.',
      common_mistakes: ['Dropping too fast', 'Not reaching full extension'],
      coaching_cues: ['Slow descent', 'Control the motion'],
      target_muscles: ['latissimus dorsi', 'biceps', 'posterior deltoid'],
      equipment_required: ['pull_up_bar'],
      contraindications: [],
      tags: ['intermediate', 'bodyweight', 'back', 'eccentric'],
      estimated_time_to_master_weeks: 4,
    },
  })

  const pullups = await prisma.exercise.create({
    data: {
      name: 'Pull-ups',
      slug: 'pull-ups',
      movement_pattern_id: verticalPull.id,
      difficulty: 6,
      description: 'Full pull-up from dead hang to chin over bar. MAJOR MILESTONE.',
      setup_instructions: 'Grab bar with overhand grip, shoulder-width or slightly wider.',
      execution_instructions: 'Pull until chin clears bar. Lower with control to dead hang.',
      common_mistakes: ['Kipping/swinging', 'Partial ROM', 'Shrugging shoulders'],
      coaching_cues: ['Dead hang start', 'Chest to bar', 'Controlled descent'],
      target_muscles: ['latissimus dorsi', 'biceps', 'posterior deltoid', 'core'],
      equipment_required: ['pull_up_bar'],
      contraindications: [],
      tags: ['advanced', 'bodyweight', 'back', 'milestone'],
      estimated_time_to_master_weeks: 12,
    },
  })

  // =====================================================
  // SQUAT EXERCISES
  // =====================================================
  console.log('Creating squat exercises...')

  const boxSquats = await prisma.exercise.create({
    data: {
      name: 'Box Squats',
      slug: 'box-squats',
      movement_pattern_id: squat.id,
      difficulty: 2,
      description: 'Squats to a box or bench to ensure proper depth.',
      setup_instructions: 'Stand in front of box/chair at knee height.',
      execution_instructions: 'Squat down until sitting on box, then stand back up.',
      common_mistakes: ['Dropping onto box', 'Knees caving in'],
      coaching_cues: ['Control the descent', 'Drive through heels'],
      target_muscles: ['quadriceps', 'glutes', 'hamstrings'],
      equipment_required: ['elevated_surface'],
      contraindications: [],
      tags: ['beginner', 'bodyweight', 'legs'],
      estimated_time_to_master_weeks: 2,
    },
  })

  const bodyweightSquats = await prisma.exercise.create({
    data: {
      name: 'Bodyweight Squats',
      slug: 'bodyweight-squats',
      movement_pattern_id: squat.id,
      difficulty: 3,
      description: 'Standard bodyweight squat to parallel or below.',
      setup_instructions: 'Stand with feet shoulder-width apart.',
      execution_instructions: 'Squat down until thighs parallel to ground. Stand back up.',
      common_mistakes: ['Knees caving in', 'Heels lifting', 'Excessive forward lean'],
      coaching_cues: ['Knees track over toes', 'Chest up', 'Full depth'],
      target_muscles: ['quadriceps', 'glutes', 'hamstrings'],
      equipment_required: [],
      contraindications: [],
      tags: ['beginner', 'bodyweight', 'legs'],
      estimated_time_to_master_weeks: 4,
    },
  })

  const pistolSquats = await prisma.exercise.create({
    data: {
      name: 'Pistol Squats',
      slug: 'pistol-squats',
      movement_pattern_id: squat.id,
      difficulty: 8,
      description: 'Single-leg squat with opposite leg extended forward.',
      setup_instructions: 'Stand on one leg, extend other leg forward.',
      execution_instructions: 'Squat down on one leg while keeping other leg extended. Stand back up.',
      common_mistakes: ['Losing balance', 'Heel lifting', 'Rounding back'],
      coaching_cues: ['Counterbalance with arms', 'Drive through heel'],
      target_muscles: ['quadriceps', 'glutes', 'core', 'balance'],
      equipment_required: [],
      contraindications: ['knee_issues'],
      tags: ['advanced', 'bodyweight', 'legs', 'unilateral'],
      estimated_time_to_master_weeks: 16,
    },
  })

  // =====================================================
  // HORIZONTAL PULL EXERCISES
  // =====================================================
  console.log('Creating horizontal pull exercises...')

  const inclineRows = await prisma.exercise.create({
    data: {
      name: 'Incline Rows (Table)',
      slug: 'incline-rows-table',
      movement_pattern_id: horizontalPull.id,
      difficulty: 2,
      description: 'Bodyweight rows using a sturdy table or high bar.',
      setup_instructions: 'Lie under table, grab edge with overhand grip, body straight.',
      execution_instructions: 'Pull chest to table, keeping body straight. Lower with control.',
      common_mistakes: ['Sagging hips', 'Using momentum', 'Incomplete range'],
      coaching_cues: ['Squeeze shoulder blades', 'Pull elbows back', 'Straight body line'],
      target_muscles: ['latissimus dorsi', 'rhomboids', 'biceps', 'posterior deltoid'],
      equipment_required: ['elevated_surface'],
      contraindications: [],
      tags: ['beginner', 'bodyweight', 'back', 'horizontal_pull'],
      estimated_time_to_master_weeks: 3,
    },
  })

  const australianRows = await prisma.exercise.create({
    data: {
      name: 'Australian Rows',
      slug: 'australian-rows',
      movement_pattern_id: horizontalPull.id,
      difficulty: 4,
      description: 'Inverted rows with feet elevated, body parallel to ground.',
      setup_instructions: 'Set bar at hip height. Hang underneath with arms extended, body straight.',
      execution_instructions: 'Pull chest to bar, squeezing shoulder blades. Lower to full extension.',
      common_mistakes: ['Flaring elbows', 'Not reaching full depth', 'Breaking body line'],
      coaching_cues: ['Retract scapula', 'Touch chest to bar', 'Control descent'],
      target_muscles: ['latissimus dorsi', 'rhomboids', 'trapezius', 'biceps'],
      equipment_required: ['pull_up_bar'],
      contraindications: [],
      tags: ['intermediate', 'bodyweight', 'back', 'horizontal_pull', 'milestone'],
      estimated_time_to_master_weeks: 6,
    },
  })

  const archerRows = await prisma.exercise.create({
    data: {
      name: 'Archer Rows',
      slug: 'archer-rows',
      movement_pattern_id: horizontalPull.id,
      difficulty: 6,
      description: 'Single-arm emphasis rows alternating sides.',
      setup_instructions: 'Wide grip on bar, pull to one side while extending opposite arm.',
      execution_instructions: 'Pull to one side, straightening opposite arm. Alternate sides.',
      common_mistakes: ['Rotating torso', 'Using momentum'],
      coaching_cues: ['Keep hips square', 'Pull to armpit', 'Slow and controlled'],
      target_muscles: ['latissimus dorsi', 'rhomboids', 'biceps'],
      equipment_required: ['pull_up_bar'],
      contraindications: [],
      tags: ['advanced', 'bodyweight', 'back', 'unilateral'],
      estimated_time_to_master_weeks: 10,
    },
  })

  const oneArmRows = await prisma.exercise.create({
    data: {
      name: 'One-Arm Rows',
      slug: 'one-arm-rows',
      movement_pattern_id: horizontalPull.id,
      difficulty: 8,
      description: 'Full single-arm inverted row.',
      setup_instructions: 'Grab bar with one hand, other arm extended or on hip.',
      execution_instructions: 'Pull body up with one arm until chest reaches bar. Lower with control.',
      common_mistakes: ['Excessive rotation', 'Momentum usage'],
      coaching_cues: ['Minimize rotation', 'Full range of motion', 'Core stability'],
      target_muscles: ['latissimus dorsi', 'rhomboids', 'biceps', 'core', 'obliques'],
      equipment_required: ['pull_up_bar'],
      contraindications: [],
      tags: ['advanced', 'bodyweight', 'back', 'unilateral'],
      estimated_time_to_master_weeks: 16,
    },
  })

  // =====================================================
  // HINGE EXERCISES
  // =====================================================
  console.log('Creating hinge exercises...')

  const gluteBridges = await prisma.exercise.create({
    data: {
      name: 'Glute Bridges',
      slug: 'glute-bridges',
      movement_pattern_id: hinge.id,
      difficulty: 1,
      description: 'Hip extension from floor, foundational hinge pattern.',
      setup_instructions: 'Lie on back, knees bent, feet flat on floor hip-width apart.',
      execution_instructions: 'Drive through heels to lift hips until body forms straight line. Lower with control.',
      common_mistakes: ['Hyperextending lower back', 'Pushing through toes', 'Not squeezing glutes'],
      coaching_cues: ['Squeeze glutes at top', 'Neutral spine', 'Drive through heels'],
      target_muscles: ['glutes', 'hamstrings', 'lower back'],
      equipment_required: [],
      contraindications: [],
      tags: ['beginner', 'bodyweight', 'glutes', 'hinge'],
      estimated_time_to_master_weeks: 2,
    },
  })

  const singleLegGluteBridges = await prisma.exercise.create({
    data: {
      name: 'Single-Leg Glute Bridges',
      slug: 'single-leg-glute-bridges',
      movement_pattern_id: hinge.id,
      difficulty: 3,
      description: 'Unilateral hip extension, increased stability demand.',
      setup_instructions: 'Lie on back, one foot flat, other leg extended in air.',
      execution_instructions: 'Drive through planted foot to lift hips. Keep hips level. Lower and repeat.',
      common_mistakes: ['Hip dropping', 'Excessive arching', 'Rotating pelvis'],
      coaching_cues: ['Keep hips level', 'Glute of working leg', 'Controlled movement'],
      target_muscles: ['glutes', 'hamstrings', 'core stability'],
      equipment_required: [],
      contraindications: [],
      tags: ['intermediate', 'bodyweight', 'glutes', 'unilateral'],
      estimated_time_to_master_weeks: 4,
    },
  })

  const goodMornings = await prisma.exercise.create({
    data: {
      name: 'Bodyweight Good Mornings',
      slug: 'bodyweight-good-mornings',
      movement_pattern_id: hinge.id,
      difficulty: 4,
      description: 'Standing hip hinge emphasizing hamstring and posterior chain.',
      setup_instructions: 'Stand with feet hip-width, hands behind head.',
      execution_instructions: 'Hinge at hips, pushing them back while keeping back straight. Return to standing.',
      common_mistakes: ['Rounding back', 'Bending knees too much', 'Looking up'],
      coaching_cues: ['Hinge from hips', 'Chest up', 'Feel hamstring stretch'],
      target_muscles: ['hamstrings', 'glutes', 'erector spinae'],
      equipment_required: [],
      contraindications: ['lower_back_issues'],
      tags: ['intermediate', 'bodyweight', 'hamstrings', 'hinge'],
      estimated_time_to_master_weeks: 4,
    },
  })

  const nordicCurls = await prisma.exercise.create({
    data: {
      name: 'Nordic Curls',
      slug: 'nordic-curls',
      movement_pattern_id: hinge.id,
      difficulty: 7,
      description: 'Eccentric hamstring exercise, extremely challenging.',
      setup_instructions: 'Kneel with ankles anchored, hands ready to catch fall.',
      execution_instructions: 'Lower body forward as slowly as possible, resisting with hamstrings. Catch with hands.',
      common_mistakes: ['Dropping too fast', 'Breaking at hips', 'Not using full range'],
      coaching_cues: ['Slow eccentric', 'Straight line from knees to head', 'Hamstrings working'],
      target_muscles: ['hamstrings', 'glutes', 'core'],
      equipment_required: ['anchor_point'],
      contraindications: ['hamstring_injury', 'knee_issues'],
      tags: ['advanced', 'bodyweight', 'hamstrings', 'eccentric'],
      estimated_time_to_master_weeks: 12,
    },
  })

  const singleLegRomanianDeadlift = await prisma.exercise.create({
    data: {
      name: 'Single-Leg RDL (Bodyweight)',
      slug: 'single-leg-rdl-bodyweight',
      movement_pattern_id: hinge.id,
      difficulty: 5,
      description: 'Unilateral hinge pattern with balance component.',
      setup_instructions: 'Stand on one leg, slight knee bend.',
      execution_instructions: 'Hinge forward, extending free leg back for balance. Return to standing.',
      common_mistakes: ['Rounding back', 'Rotating hips', 'Bending standing knee too much'],
      coaching_cues: ['Hips square to ground', 'Flat back', 'Balance and control'],
      target_muscles: ['hamstrings', 'glutes', 'lower back', 'balance'],
      equipment_required: [],
      contraindications: ['balance_issues'],
      tags: ['intermediate', 'bodyweight', 'hamstrings', 'unilateral', 'balance'],
      estimated_time_to_master_weeks: 6,
    },
  })

  // =====================================================
  // VERTICAL PUSH EXERCISES
  // =====================================================
  console.log('Creating vertical push exercises...')

  const pikePushups = await prisma.exercise.create({
    data: {
      name: 'Pike Push-ups',
      slug: 'pike-push-ups',
      movement_pattern_id: verticalPush.id,
      difficulty: 4,
      description: 'Push-ups in pike position, targeting shoulders.',
      setup_instructions: 'Start in downward dog position with hands and feet on ground.',
      execution_instructions: 'Bend elbows to lower head toward ground. Push back up.',
      common_mistakes: ['Feet too far back', 'Not getting deep enough', 'Flaring elbows'],
      coaching_cues: ['Hips high', 'Head to ground', 'Elbows at 45 degrees'],
      target_muscles: ['anterior deltoid', 'triceps', 'upper chest'],
      equipment_required: [],
      contraindications: ['shoulder_issues', 'wrist_issues'],
      tags: ['intermediate', 'bodyweight', 'shoulders'],
      estimated_time_to_master_weeks: 4,
    },
  })

  const elevatedPikePushups = await prisma.exercise.create({
    data: {
      name: 'Elevated Pike Push-ups',
      slug: 'elevated-pike-push-ups',
      movement_pattern_id: verticalPush.id,
      difficulty: 6,
      description: 'Pike push-ups with feet on elevated surface for increased difficulty.',
      setup_instructions: 'Feet on box/chair, hands on ground in pike position.',
      execution_instructions: 'Lower head to ground between hands. Press back up.',
      common_mistakes: ['Loss of pike position', 'Incomplete range'],
      coaching_cues: ['Maintain pike angle', 'Full depth', 'Vertical pressing path'],
      target_muscles: ['anterior deltoid', 'triceps', 'upper chest', 'core'],
      equipment_required: ['elevated_surface'],
      contraindications: ['shoulder_issues', 'wrist_issues'],
      tags: ['advanced', 'bodyweight', 'shoulders'],
      estimated_time_to_master_weeks: 8,
    },
  })

  const wallHandstands = await prisma.exercise.create({
    data: {
      name: 'Wall Handstand Hold',
      slug: 'wall-handstand-hold',
      movement_pattern_id: verticalPush.id,
      difficulty: 5,
      description: 'Static handstand against wall for time.',
      setup_instructions: 'Kick up into handstand with heels touching wall, hands shoulder-width.',
      execution_instructions: 'Hold position with body straight, shoulders fully extended.',
      common_mistakes: ['Banana back', 'Not pushing through shoulders', 'Improper head position'],
      coaching_cues: ['Push tall through shoulders', 'Straight body line', 'Look at ground'],
      target_muscles: ['anterior deltoid', 'trapezius', 'core', 'balance'],
      equipment_required: [],
      contraindications: ['shoulder_issues', 'wrist_issues', 'high_blood_pressure'],
      tags: ['advanced', 'bodyweight', 'shoulders', 'gymnastics', 'isometric'],
      estimated_time_to_master_weeks: 6,
    },
  })

  const wallHandstandPushups = await prisma.exercise.create({
    data: {
      name: 'Wall Handstand Push-ups',
      slug: 'wall-handstand-push-ups',
      movement_pattern_id: verticalPush.id,
      difficulty: 8,
      description: 'Full vertical push-up in handstand position against wall. MAJOR MILESTONE.',
      setup_instructions: 'Kick into handstand, heels on wall, hands shoulder-width apart.',
      execution_instructions: 'Lower head to ground in controlled manner. Press back to lockout.',
      common_mistakes: ['Incomplete range', 'Flaring elbows excessively', 'Losing body tension'],
      coaching_cues: ['Head to ground', 'Press to full lockout', 'Control the descent'],
      target_muscles: ['anterior deltoid', 'triceps', 'upper chest', 'core'],
      equipment_required: [],
      contraindications: ['shoulder_issues', 'wrist_issues', 'high_blood_pressure', 'neck_issues'],
      tags: ['advanced', 'bodyweight', 'shoulders', 'milestone', 'gymnastics'],
      estimated_time_to_master_weeks: 16,
    },
  })

  const freestandingHandstands = await prisma.exercise.create({
    data: {
      name: 'Freestanding Handstand Push-ups',
      slug: 'freestanding-handstand-push-ups',
      movement_pattern_id: verticalPush.id,
      difficulty: 10,
      description: 'Handstand push-ups without wall support, elite level.',
      setup_instructions: 'Kick into freestanding handstand, find balance.',
      execution_instructions: 'Lower head to ground while maintaining balance. Press back up.',
      common_mistakes: ['Losing balance', 'Incomplete depth', 'Excessive movement'],
      coaching_cues: ['Find balance first', 'Strict form', 'Full range of motion'],
      target_muscles: ['anterior deltoid', 'triceps', 'core', 'balance', 'proprioception'],
      equipment_required: [],
      contraindications: ['shoulder_issues', 'wrist_issues', 'high_blood_pressure', 'neck_issues', 'balance_issues'],
      tags: ['elite', 'bodyweight', 'shoulders', 'gymnastics', 'balance'],
      estimated_time_to_master_weeks: 24,
    },
  })

  // =====================================================
  // CORE EXERCISES
  // =====================================================
  console.log('Creating core exercises...')

  const plank = await prisma.exercise.create({
    data: {
      name: 'Plank Hold',
      slug: 'plank-hold',
      movement_pattern_id: coreStability.id,
      difficulty: 2,
      description: 'Static hold in plank position.',
      setup_instructions: 'Forearms on ground, elbows under shoulders, legs extended.',
      execution_instructions: 'Hold position with straight line from head to heels.',
      common_mistakes: ['Sagging hips', 'Raised hips', 'Head dropping'],
      coaching_cues: ['Neutral spine', 'Squeeze glutes', 'Breathe steadily'],
      target_muscles: ['rectus abdominis', 'transverse abdominis', 'obliques'],
      equipment_required: [],
      contraindications: [],
      tags: ['beginner', 'bodyweight', 'core', 'isometric'],
      estimated_time_to_master_weeks: 2,
    },
  })

  const hollowHold = await prisma.exercise.create({
    data: {
      name: 'Hollow Body Hold',
      slug: 'hollow-body-hold',
      movement_pattern_id: coreStability.id,
      difficulty: 4,
      description: 'Static hold in hollow body position (gymnastics fundamental).',
      setup_instructions: 'Lie on back, arms overhead, legs extended.',
      execution_instructions: 'Press lower back into floor, lift shoulders and legs off ground.',
      common_mistakes: ['Arching lower back', 'Holding breath'],
      coaching_cues: ['Lower back flat', 'Posterior pelvic tilt', 'Steady breathing'],
      target_muscles: ['rectus abdominis', 'hip flexors'],
      equipment_required: [],
      contraindications: [],
      tags: ['intermediate', 'bodyweight', 'core', 'gymnastics'],
      estimated_time_to_master_weeks: 6,
    },
  })

  console.log('✅ Created sample exercises')

  // =====================================================
  // EXERCISE PROGRESSIONS
  // =====================================================
  console.log('Creating exercise progressions...')

  await prisma.exerciseProgression.createMany({
    data: [
      // Horizontal push progressions
      {
        from_exercise_id: wallPushups.id,
        to_exercise_id: inclinePushupsHigh.id,
        progression_type: 'progression',
      },
      {
        from_exercise_id: inclinePushupsHigh.id,
        to_exercise_id: standardPushups.id,
        progression_type: 'progression',
      },
      {
        from_exercise_id: standardPushups.id,
        to_exercise_id: diamondPushups.id,
        progression_type: 'progression',
      },
      // Horizontal pull progressions
      {
        from_exercise_id: inclineRows.id,
        to_exercise_id: australianRows.id,
        progression_type: 'progression',
      },
      {
        from_exercise_id: australianRows.id,
        to_exercise_id: archerRows.id,
        progression_type: 'progression',
      },
      {
        from_exercise_id: archerRows.id,
        to_exercise_id: oneArmRows.id,
        progression_type: 'progression',
      },
      // Vertical pull progressions
      {
        from_exercise_id: deadHang.id,
        to_exercise_id: negativesPullups.id,
        progression_type: 'progression',
      },
      {
        from_exercise_id: negativesPullups.id,
        to_exercise_id: pullups.id,
        progression_type: 'progression',
      },
      // Vertical push progressions
      {
        from_exercise_id: pikePushups.id,
        to_exercise_id: elevatedPikePushups.id,
        progression_type: 'progression',
      },
      {
        from_exercise_id: elevatedPikePushups.id,
        to_exercise_id: wallHandstandPushups.id,
        progression_type: 'progression',
      },
      {
        from_exercise_id: wallHandstands.id,
        to_exercise_id: wallHandstandPushups.id,
        progression_type: 'alternative',
      },
      {
        from_exercise_id: wallHandstandPushups.id,
        to_exercise_id: freestandingHandstands.id,
        progression_type: 'progression',
      },
      // Squat progressions
      {
        from_exercise_id: boxSquats.id,
        to_exercise_id: bodyweightSquats.id,
        progression_type: 'progression',
      },
      {
        from_exercise_id: bodyweightSquats.id,
        to_exercise_id: pistolSquats.id,
        progression_type: 'progression',
      },
      // Hinge progressions
      {
        from_exercise_id: gluteBridges.id,
        to_exercise_id: singleLegGluteBridges.id,
        progression_type: 'progression',
      },
      {
        from_exercise_id: singleLegGluteBridges.id,
        to_exercise_id: goodMornings.id,
        progression_type: 'progression',
      },
      {
        from_exercise_id: goodMornings.id,
        to_exercise_id: singleLegRomanianDeadlift.id,
        progression_type: 'progression',
      },
      {
        from_exercise_id: singleLegRomanianDeadlift.id,
        to_exercise_id: nordicCurls.id,
        progression_type: 'progression',
      },
      // Core progressions
      {
        from_exercise_id: plank.id,
        to_exercise_id: hollowHold.id,
        progression_type: 'progression',
      },
    ],
  })

  console.log('✅ Created exercise progressions')

  // =====================================================
  // SUBSCRIPTION TIERS
  // =====================================================
  console.log('Creating subscription tiers...')

  const freeTier = await prisma.subscriptionTier.create({
    data: {
      name: 'free',
      display_name: 'Free',
      description: 'Get started with basic calisthenics training',
      price_monthly: 0,
      credits_per_month: 3,
      features: {
        max_active_plans: 1,
        plan_generation: true,
        exercise_library: true,
        workout_logging: true,
        progress_tracking: 'basic',
        ai_coaching: false,
        custom_exercises: false,
      },
      is_active: true,
      sort_order: 1,
    },
  })

  const proTier = await prisma.subscriptionTier.create({
    data: {
      name: 'pro',
      display_name: 'Pro',
      description: 'Unlock advanced features and unlimited plan generation',
      price_monthly: 9.99,
      credits_per_month: 20,
      features: {
        max_active_plans: 3,
        plan_generation: true,
        exercise_library: true,
        workout_logging: true,
        progress_tracking: 'advanced',
        ai_coaching: true,
        custom_exercises: true,
        priority_support: true,
      },
      is_active: true,
      sort_order: 2,
    },
  })

  const premiumTier = await prisma.subscriptionTier.create({
    data: {
      name: 'premium',
      display_name: 'Premium',
      description: 'The ultimate calisthenics training experience',
      price_monthly: 19.99,
      credits_per_month: 100,
      features: {
        max_active_plans: 999,
        plan_generation: true,
        exercise_library: true,
        workout_logging: true,
        progress_tracking: 'advanced',
        ai_coaching: true,
        custom_exercises: true,
        priority_support: true,
        video_analysis: true,
        nutrition_tracking: true,
        community_access: true,
      },
      is_active: true,
      sort_order: 3,
    },
  })

  console.log('✅ Created 3 subscription tiers')

  // =====================================================
  // INITIAL ADMIN ACCOUNT
  // =====================================================
  console.log('Creating initial admin account...')

  const adminPassword = await bcrypt.hash('Admin123!', 10)

  const admin = await prisma.admin.create({
    data: {
      email: 'admin@califlow.com',
      password_hash: adminPassword,
      first_name: 'System',
      last_name: 'Administrator',
      is_super_admin: true,
      is_active: true,
    },
  })

  console.log('✅ Created initial admin account (admin@califlow.com / Admin123!)')

  console.log('\n🎉 Database seeded successfully!')
  console.log('\n📊 Summary:')
  console.log('- Movement Patterns: 7')
  console.log('- Exercises: 26')
  console.log('  - Horizontal Push: 4')
  console.log('  - Horizontal Pull: 4')
  console.log('  - Vertical Push: 5')
  console.log('  - Vertical Pull: 3')
  console.log('  - Squat: 3')
  console.log('  - Hinge: 5')
  console.log('  - Core: 2')
  console.log('- Progressions: 21')
  console.log('- Subscription Tiers: 3 (Free, Pro, Premium)')
  console.log('- Admin Accounts: 1')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
