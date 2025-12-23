import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const patterns = await prisma.movementPattern.findMany({
    where: { name: { in: ['squat', 'core_stability', 'horizontal_push'] } },
    include: {
      exercises: {
        where: { is_published: true },
        select: {
          name: true,
          difficulty: true,
          equipment_required: true
        }
      }
    }
  });

  patterns.forEach(pattern => {
    console.log(`\n${pattern.name} (ID: ${pattern.id.substring(0, 8)}):`);
    pattern.exercises.forEach(ex => {
      console.log(`  - ${ex.name}: difficulty ${ex.difficulty}, equipment: ${JSON.stringify(ex.equipment_required)}`);
    });
  });

  // Test the difficulty filter logic
  console.log('\nTesting difficulty filter at user level 1:');
  console.log('  minDifficulty:', Math.max(1, 1 - 2), '(max of 1 or level-2)');
  console.log('  maxDifficulty:', 1);
  console.log('  Should include exercises with difficulty 1 only');

  await prisma.$disconnect();
}

main().catch(console.error);
