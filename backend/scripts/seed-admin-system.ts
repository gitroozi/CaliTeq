import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

/**
 * Seed subscription tiers and initial admin account
 */
async function seedAdminSystem() {
  console.log('🌱 Seeding admin and subscription system...')

  try {
    // =====================================================
    // SUBSCRIPTION TIERS
    // =====================================================
    console.log('Creating subscription tiers...')

    const freeTier = await prisma.subscriptionTier.upsert({
      where: { name: 'free' },
      update: {},
      create: {
        name: 'free',
        display_name: 'Free',
        description: 'Get started with basic calisthenics training',
        price_monthly: 0,
        credits_per_month: 3,
        features: {
          max_active_plans: 1,
          plan_generation: true,
          exercise_library: true,
          workout_logging: true,
          progress_tracking: 'basic',
          ai_coaching: false,
          custom_exercises: false,
        },
        is_active: true,
        sort_order: 1,
      },
    })

    const proTier = await prisma.subscriptionTier.upsert({
      where: { name: 'pro' },
      update: {},
      create: {
        name: 'pro',
        display_name: 'Pro',
        description: 'Unlock advanced features and unlimited plan generation',
        price_monthly: 9.99,
        credits_per_month: 20,
        features: {
          max_active_plans: 3,
          plan_generation: true,
          exercise_library: true,
          workout_logging: true,
          progress_tracking: 'advanced',
          ai_coaching: true,
          custom_exercises: true,
          priority_support: true,
        },
        is_active: true,
        sort_order: 2,
      },
    })

    const premiumTier = await prisma.subscriptionTier.upsert({
      where: { name: 'premium' },
      update: {},
      create: {
        name: 'premium',
        display_name: 'Premium',
        description: 'The ultimate calisthenics training experience',
        price_monthly: 19.99,
        credits_per_month: 100,
        features: {
          max_active_plans: 999,
          plan_generation: true,
          exercise_library: true,
          workout_logging: true,
          progress_tracking: 'advanced',
          ai_coaching: true,
          custom_exercises: true,
          priority_support: true,
          video_analysis: true,
          nutrition_tracking: true,
          community_access: true,
        },
        is_active: true,
        sort_order: 3,
      },
    })

    console.log('✅ Created 3 subscription tiers')
    console.log(`   - Free: $${freeTier.price_monthly}/mo, ${freeTier.credits_per_month} credits`)
    console.log(`   - Pro: $${proTier.price_monthly}/mo, ${proTier.credits_per_month} credits`)
    console.log(`   - Premium: $${premiumTier.price_monthly}/mo, ${premiumTier.credits_per_month} credits`)

    // =====================================================
    // INITIAL ADMIN ACCOUNT
    // =====================================================
    console.log('\nCreating initial admin account...')

    const adminPassword = await bcrypt.hash('Admin123!', 10)

    const admin = await prisma.admin.upsert({
      where: { email: 'admin@califlow.com' },
      update: {},
      create: {
        email: 'admin@califlow.com',
        password_hash: adminPassword,
        first_name: 'System',
        last_name: 'Administrator',
        is_super_admin: true,
        is_active: true,
      },
    })

    console.log('✅ Created initial admin account')
    console.log(`   - Email: ${admin.email}`)
    console.log(`   - Password: Admin123!`)
    console.log(`   - Super Admin: ${admin.is_super_admin}`)

    console.log('\n🎉 Admin system seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding admin system:', error)
    throw error
  }
}

seedAdminSystem()
  .then(async () => {
    await prisma.$disconnect()
    console.log('\n✅ Seeding completed successfully')
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
