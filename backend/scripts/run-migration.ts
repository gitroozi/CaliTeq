import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function runMigration() {
  try {
    console.log('🔄 Reading migration SQL file...');

    const migrationPath = path.join(
      __dirname,
      '../prisma/migrations/20251224064331_add_admin_system/migration.sql'
    );

    const sql = fs.readFileSync(migrationPath, 'utf-8');

    console.log('🔄 Executing migration...');

    // Split SQL by semicolons and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      console.log(`  Executing: ${statement.substring(0, 50)}...`);
      await prisma.$executeRawUnsafe(statement);
    }

    console.log('✅ Migration completed successfully!');
    console.log(`   Created ${statements.length} database objects`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

runMigration();
