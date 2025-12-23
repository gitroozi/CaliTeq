import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getUserId = async () => {
  const planUser = await prisma.$queryRawUnsafe(
    'select user_id as id from public.workout_plans limit 1'
  );
  if (planUser?.length) return planUser[0].id;
  const users = await prisma.$queryRawUnsafe(
    'select id from public.users limit 1'
  );
  return users?.length ? users[0].id : null;
};

const formatCount = (rows) => (rows?.length ? Number(rows[0].count ?? rows[0].count) : 0);

const runAnon = async () =>
  prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe('set local role anon');
    const patterns = await tx.$queryRawUnsafe(
      'select count(*)::int as count from public.movement_patterns'
    );
    const exercises = await tx.$queryRawUnsafe(
      'select count(*)::int as count from public.exercises'
    );
    let usersError = null;
    try {
      await tx.$queryRawUnsafe('select count(*)::int as count from public.users');
    } catch (err) {
      usersError = err.message;
    }
    return {
      patterns: formatCount(patterns),
      exercises: formatCount(exercises),
      usersError,
    };
  });

const runAuth = async (userId) =>
  prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe('set local role authenticated');
    await tx.$executeRawUnsafe(
      `select set_config('request.jwt.claim.sub', '${userId}', true)`
    );
    const ownUsers = await tx.$queryRawUnsafe(
      'select count(*)::int as count from public.users'
    );
    const otherUsers = await tx.$queryRawUnsafe(
      'select count(*)::int as count from public.users where id <> auth.uid()'
    );
    const ownPlans = await tx.$queryRawUnsafe(
      'select count(*)::int as count from public.workout_plans'
    );
    const otherPlans = await tx.$queryRawUnsafe(
      'select count(*)::int as count from public.workout_plans where user_id <> auth.uid()'
    );
    return {
      ownUsers: formatCount(ownUsers),
      otherUsers: formatCount(otherUsers),
      ownPlans: formatCount(ownPlans),
      otherPlans: formatCount(otherPlans),
    };
  });

const main = async () => {
  const userId = await getUserId();
  if (!userId) {
    console.log('No users found to test RLS.');
    return;
  }

  const anon = await runAnon();
  const auth = await runAuth(userId);

  console.log('RLS Smoke Test Results');
  console.log('anon movement_patterns:', anon.patterns);
  console.log('anon exercises:', anon.exercises);
  console.log('anon users error:', anon.usersError ? 'DENIED' : 'ALLOWED');
  console.log('auth own users:', auth.ownUsers);
  console.log('auth other users:', auth.otherUsers);
  console.log('auth own plans:', auth.ownPlans);
  console.log('auth other plans:', auth.otherPlans);
};

main()
  .catch((err) => {
    console.error('RLS test failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
