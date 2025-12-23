import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Data migration script to assign existing users to the Free tier
 * and initialize their credit balances
 */
async function migrateExistingUsers() {
  console.log('🔄 Starting data migration for existing users...')

  try {
    // Get the Free tier
    const freeTier = await prisma.subscriptionTier.findUnique({
      where: { name: 'free' },
    })

    if (!freeTier) {
      console.error('❌ Free tier not found. Please run seed first.')
      process.exit(1)
    }

    console.log('✅ Found Free tier:', freeTier.display_name)

    // Get all users without subscriptions
    const usersWithoutSubscription = await prisma.user.findMany({
      where: {
        subscription: null,
      },
      select: {
        id: true,
        email: true,
      },
    })

    console.log(`📊 Found ${usersWithoutSubscription.length} users without subscriptions`)

    if (usersWithoutSubscription.length === 0) {
      console.log('✅ All users already have subscriptions')
      return
    }

    // Create subscriptions and credits for each user
    let migratedCount = 0
    for (const user of usersWithoutSubscription) {
      await prisma.$transaction(async (tx) => {
        // Create subscription
        await tx.userSubscription.create({
          data: {
            user_id: user.id,
            subscription_tier_id: freeTier.id,
            status: 'active',
            auto_renew: true,
          },
        })

        // Create credit account with initial balance
        await tx.userCredit.create({
          data: {
            user_id: user.id,
            balance: freeTier.credits_per_month,
            lifetime_earned: freeTier.credits_per_month,
            lifetime_spent: 0,
          },
        })

        // Create initial credit transaction
        await tx.creditTransaction.create({
          data: {
            user_id: user.id,
            amount: freeTier.credits_per_month,
            transaction_type: 'monthly_grant',
            description: 'Initial credit grant for migrated user',
            balance_after: freeTier.credits_per_month,
          },
        })

        // Update user's subscription_tier field for backward compatibility
        await tx.user.update({
          where: { id: user.id },
          data: { subscription_tier: 'free' },
        })
      })

      migratedCount++
      console.log(`  ✅ Migrated user: ${user.email}`)
    }

    console.log(`\n🎉 Successfully migrated ${migratedCount} users to Free tier`)
    console.log(`   - Assigned Free tier subscription`)
    console.log(`   - Initialized credit balance: ${freeTier.credits_per_month} credits`)
  } catch (error) {
    console.error('❌ Error during migration:', error)
    throw error
  }
}

migrateExistingUsers()
  .then(async () => {
    await prisma.$disconnect()
    console.log('\n✅ Migration completed successfully')
  })
  .catch(async (e) => {
    console.error('❌ Migration failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
