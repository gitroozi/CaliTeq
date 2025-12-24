import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTables() {
  try {
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      AND tablename IN ('admins', 'subscription_tiers', 'user_subscriptions', 'user_credits', 'credit_transactions', 'audit_logs')
      ORDER BY tablename
    `;

    console.log('📊 Admin System Tables Status:\n');
    const expectedTables = ['admins', 'audit_logs', 'credit_transactions', 'subscription_tiers', 'user_credits', 'user_subscriptions'];

    for (const expectedTable of expectedTables) {
      const exists = tables.some(t => t.tablename === expectedTable);
      console.log(`  ${exists ? '✅' : '❌'} ${expectedTable}`);
    }

    console.log('\n📋 Found Tables:');
    tables.forEach(t => console.log(`  - ${t.tablename}`));

  } catch (error) {
    console.error('❌ Error checking tables:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTables();
