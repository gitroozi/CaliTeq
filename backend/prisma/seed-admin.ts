import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedAdminSystem() {
  console.log('🌱 Seeding admin system...\n');

  try {
    // ========================================
    // 1. SUBSCRIPTION TIERS
    // ========================================
    console.log('📊 Creating subscription tiers...');

    const tiers = [
      {
        name: 'free',
        display_name: 'Free',
        description: 'Perfect for getting started with basic calisthenics training',
        price_monthly: 0,
        credits_per_month: 3,
        features: {
          planGeneration: true,
          workoutLogging: true,
          progressTracking: true,
          exerciseLibrary: true,
          maxPlansPerMonth: 1,
          supportLevel: 'community'
        },
        is_active: true,
        sort_order: 1
      },
      {
        name: 'pro',
        display_name: 'Pro',
        description: 'For serious athletes who want more personalized training',
        price_monthly: 9.99,
        credits_per_month: 20,
        features: {
          planGeneration: true,
          workoutLogging: true,
          progressTracking: true,
          exerciseLibrary: true,
          advancedAnalytics: true,
          maxPlansPerMonth: 5,
          supportLevel: 'email',
          prioritySupport: false
        },
        is_active: true,
        sort_order: 2
      },
      {
        name: 'premium',
        display_name: 'Premium',
        description: 'Ultimate training experience with unlimited features',
        price_monthly: 19.99,
        credits_per_month: 100,
        features: {
          planGeneration: true,
          workoutLogging: true,
          progressTracking: true,
          exerciseLibrary: true,
          advancedAnalytics: true,
          personalizedCoaching: true,
          maxPlansPerMonth: -1, // unlimited
          supportLevel: 'priority',
          prioritySupport: true,
          customWorkouts: true
        },
        is_active: true,
        sort_order: 3
      }
    ];

    for (const tier of tiers) {
      const existing = await prisma.subscriptionTier.findUnique({
        where: { name: tier.name }
      });

      if (existing) {
        console.log(`  ⏭️  Tier "${tier.display_name}" already exists, skipping...`);
      } else {
        await prisma.subscriptionTier.create({
          data: tier
        });
        console.log(`  ✅ Created tier: ${tier.display_name} ($${tier.price_monthly}/mo, ${tier.credits_per_month} credits)`);
      }
    }

    // ========================================
    // 2. SUPER ADMIN ACCOUNT
    // ========================================
    console.log('\n👤 Creating super admin account...');

    const adminEmail = 'admin@caliteq.com';
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      console.log(`  ⏭️  Admin account already exists for ${adminEmail}`);
    } else {
      const password = 'changeme123';
      const passwordHash = await bcrypt.hash(password, 10);

      await prisma.admin.create({
        data: {
          email: adminEmail,
          password_hash: passwordHash,
          first_name: 'Super',
          last_name: 'Admin',
          is_super_admin: true,
          is_active: true
        }
      });

      console.log(`  ✅ Created super admin account`);
      console.log(`     Email: ${adminEmail}`);
      console.log(`     Password: ${password}`);
      console.log(`     ⚠️  IMPORTANT: Change this password immediately after first login!`);
    }

    // ========================================
    // 3. USER SUBSCRIPTIONS
    // ========================================
    console.log('\n📝 Creating user subscriptions for existing users...');

    // Get all users without subscriptions
    const usersWithoutSubscriptions = await prisma.user.findMany({
      where: {
        subscription: null
      },
      select: {
        id: true,
        email: true
      }
    });

    if (usersWithoutSubscriptions.length === 0) {
      console.log('  ⏭️  All users already have subscriptions');
    } else {
      // Get Free tier
      const freeTier = await prisma.subscriptionTier.findUnique({
        where: { name: 'free' }
      });

      if (!freeTier) {
        throw new Error('Free tier not found! Please create subscription tiers first.');
      }

      for (const user of usersWithoutSubscriptions) {
        await prisma.userSubscription.create({
          data: {
            user_id: user.id,
            subscription_tier_id: freeTier.id,
            status: 'active',
            started_at: new Date(),
            auto_renew: true
          }
        });

        console.log(`  ✅ Created Free subscription for ${user.email}`);
      }

      console.log(`  📊 Created ${usersWithoutSubscriptions.length} user subscriptions`);
    }

    // ========================================
    // 4. USER CREDITS
    // ========================================
    console.log('\n💳 Creating user credit accounts...');

    // Get all users without credit accounts
    const usersWithoutCredits = await prisma.user.findMany({
      where: {
        credits: null
      },
      select: {
        id: true,
        email: true,
        subscription: {
          select: {
            subscription_tier: {
              select: {
                name: true,
                credits_per_month: true
              }
            }
          }
        }
      }
    });

    if (usersWithoutCredits.length === 0) {
      console.log('  ⏭️  All users already have credit accounts');
    } else {
      for (const user of usersWithoutCredits) {
        const initialCredits = user.subscription?.subscription_tier?.credits_per_month || 3;

        await prisma.userCredit.create({
          data: {
            user_id: user.id,
            balance: initialCredits,
            lifetime_earned: initialCredits,
            lifetime_spent: 0
          }
        });

        // Create initial credit transaction
        await prisma.creditTransaction.create({
          data: {
            user_id: user.id,
            amount: initialCredits,
            transaction_type: 'monthly_grant',
            description: 'Initial credit grant upon account setup',
            balance_after: initialCredits
          }
        });

        console.log(`  ✅ Created credit account for ${user.email} (${initialCredits} credits)`);
      }

      console.log(`  📊 Created ${usersWithoutCredits.length} credit accounts`);
    }

    // ========================================
    // SUMMARY
    // ========================================
    console.log('\n📊 Seed Summary:');

    const tierCount = await prisma.subscriptionTier.count();
    const adminCount = await prisma.admin.count();
    const subscriptionCount = await prisma.userSubscription.count();
    const creditAccountCount = await prisma.userCredit.count();

    console.log(`  Subscription Tiers: ${tierCount}`);
    console.log(`  Admin Accounts: ${adminCount}`);
    console.log(`  User Subscriptions: ${subscriptionCount}`);
    console.log(`  User Credit Accounts: ${creditAccountCount}`);

    console.log('\n✅ Admin system seed completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedAdminSystem();
