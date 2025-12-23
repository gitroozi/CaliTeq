import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('\n=== Checking User Profile ===\n');

  const profile = await prisma.userProfile.findFirst({
    where: {
      user: {
        email: 'test@example.com'
      }
    }
  });

  if (profile) {
    console.log('Profile found:');
    console.log('  training_experience:', profile.training_experience);
    console.log('  activity_level:', profile.activity_level);
    console.log('  days_per_week:', profile.days_per_week);
    console.log('  minutes_per_session:', profile.minutes_per_session);
    console.log('\nEquipment (JSONB):');
    console.log('  ', profile.equipment);
    console.log('\nAssessment Scores (JSONB):');
    console.log('  ', profile.assessment_scores);
    console.log('\nGoals (JSONB):');
    console.log('  ', profile.goals);
    console.log('\nInjuries (JSONB):');
    console.log('  ', profile.injuries);
  } else {
    console.log('No profile found');
  }

  await prisma.$disconnect();
}

main().catch(console.error);
