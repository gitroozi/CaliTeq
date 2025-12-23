import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const plan = await prisma.workoutPlan.findFirst({
    where: {
      user: { email: 'test@example.com' },
      status: 'active'
    },
    include: {
      workout_sessions: {
        orderBy: [{ week_number: 'asc' }, { day_of_week: 'asc' }],
        include: {
          workout_session_exercises: {
            include: {
              exercise: { select: { name: true } }
            }
          }
        }
      }
    }
  });

  if (!plan) {
    console.log('No active plan found');
    return;
  }

  console.log(`\nPlan: ${plan.name}`);
  console.log(`Total sessions: ${plan.workout_sessions.length}`);
  console.log(`Expected: 36 (12 weeks × 3 days)`);

  // Group by week
  const byWeek: { [key: number]: any[] } = {};
  plan.workout_sessions.forEach(s => {
    if (!byWeek[s.week_number]) byWeek[s.week_number] = [];
    byWeek[s.week_number].push(s);
  });

  console.log('\nSessions per week:');
  Object.keys(byWeek).sort((a, b) => parseInt(a) - parseInt(b)).forEach(week => {
    const sessions = byWeek[parseInt(week)];
    console.log(`  Week ${week}: ${sessions.length} sessions`);
    sessions.forEach(s => {
      console.log(`    - Day ${s.day_of_week}, Session ${s.session_number}: ${s.workout_session_exercises.length} exercises`);
    });
  });

  await prisma.$disconnect();
}

main().catch(console.error);
