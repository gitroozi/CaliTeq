import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('\n=== Checking Database ===\n');

  // Check exercises
  const exerciseCount = await prisma.exercise.count();
  const publishedExercises = await prisma.exercise.count({ where: { is_published: true } });
  console.log(`Total exercises: ${exerciseCount}`);
  console.log(`Published exercises: ${publishedExercises}`);

  // Check movement patterns
  const patterns = await prisma.movementPattern.findMany({
    include: {
      _count: {
        select: { exercises: true }
      }
    }
  });
  console.log('\nMovement Patterns:');
  patterns.forEach(p => {
    console.log(`  - ${p.name}: ${p._count.exercises} exercises (primary: ${p.is_primary})`);
  });

  // Check a sample exercise
  const sampleExercise = await prisma.exercise.findFirst({
    where: { is_published: true },
    include: { movement_pattern: true }
  });

  if (sampleExercise) {
    console.log('\nSample Exercise:');
    console.log(`  Name: ${sampleExercise.name}`);
    console.log(`  Pattern: ${sampleExercise.movement_pattern.name}`);
    console.log(`  Difficulty: ${sampleExercise.difficulty}`);
    console.log(`  Equipment:`, sampleExercise.equipment_required);
  }

  await prisma.$disconnect();
}

main().catch(console.error);
