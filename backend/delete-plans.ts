import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Deleting workout plans for test user...');

  const user = await prisma.user.findUnique({
    where: { email: 'test@example.com' }
  });

  if (!user) {
    console.log('User not found');
    return;
  }

  const deleted = await prisma.workoutPlan.deleteMany({
    where: { user_id: user.id }
  });

  console.log(`Deleted ${deleted.count} workout plans`);

  await prisma.$disconnect();
}

main().catch(console.error);
