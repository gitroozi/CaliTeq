import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUser() {
  try {
    // Find user by name or email containing 'kimi'
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: 'kimi', mode: 'insensitive' } },
          { first_name: { contains: 'kimi', mode: 'insensitive' } },
          { last_name: { contains: 'kimi', mode: 'insensitive' } },
        ],
      },
      include: {
        user_profile: true,
        workout_plans: {
          orderBy: { created_at: 'desc' },
          take: 5,
        },
      },
    });

    console.log('\n=== Users matching "kimi" ===');
    for (const user of users) {
      console.log('\nUser:', {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        isActive: user.is_active,
      });

      console.log('Profile:', user.user_profile ? {
        id: user.user_profile.id,
        experienceLevel: user.user_profile.experience_level,
        trainingGoal: user.user_profile.training_goal,
        hasCompletedOnboarding: user.user_profile.has_completed_onboarding,
      } : 'NO PROFILE');

      console.log('Workout Plans:', user.workout_plans.length);
      for (const plan of user.workout_plans) {
        console.log('  -', {
          id: plan.id,
          name: plan.name,
          status: plan.status,
          isActive: plan.is_active,
          startDate: plan.start_date,
          weeksCount: plan.weeks_count,
        });
      }
    }

    if (users.length === 0) {
      console.log('No users found matching "kimi"');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
