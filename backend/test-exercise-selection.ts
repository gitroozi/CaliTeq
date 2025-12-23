import { PrismaClient } from '@prisma/client';
import { getFullBodyPatternRequirements, selectExercisesForSession } from './src/services/workout-generator/exercise-selector';

const prisma = new PrismaClient();

async function main() {
  console.log('\n=== Testing Exercise Selection ===\n');

  const profile = await prisma.userProfile.findFirst({
    where: { user: { email: 'test@example.com' } }
  });

  if (!profile) {
    console.log('No profile found');
    return;
  }

  // Get pattern requirements
  const patterns = await getFullBodyPatternRequirements();
  console.log('Pattern requirements:');
  patterns.forEach(p => {
    console.log(`  - ${p.patternName} (ID: ${p.patternId.substring(0, 8)}...) - Required: ${p.required}`);
  });

  // Get assessment scores
  const assessmentScores = (profile.assessment_scores as any) || {};
  console.log('\nAssessment scores:', assessmentScores);

  // Build pattern requirements with user levels
  const patternRequirements = patterns
    .filter(p => p.required)
    .map(p => ({
      patternId: p.patternId,
      userLevel: assessmentScores.pushLevel || 1, // Simplified for testing
      count: 1
    }));

  console.log(`\nRequesting exercises for ${patternRequirements.length} patterns`);

  // Get equipment
  const equipment = (profile.equipment as any) || {};
  const availableEquipment = ['none']; // Bodyweight only

  // Select exercises
  const exercises = await selectExercisesForSession(
    patternRequirements,
    availableEquipment,
    [],
    [],
    []
  );

  console.log(`\nSelected ${exercises.length} exercises:`);
  exercises.forEach(e => {
    console.log(`  - ${e.name} (Difficulty: ${e.difficulty})`);
  });

  await prisma.$disconnect();
}

main().catch(console.error);
