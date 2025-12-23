import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verify() {
  console.log('🔍 Verifying admin and subscription system...\n')

  // Count records
  const adminCount = await prisma.admin.count()
  const tierCount = await prisma.subscriptionTier.count()
  const subscriptionCount = await prisma.userSubscription.count()
  const creditAccountCount = await prisma.userCredit.count()
  const transactionCount = await prisma.creditTransaction.count()
  const auditLogCount = await prisma.auditLog.count()

  console.log('📊 Record Counts:')
  console.log(`   - Admins: ${adminCount}`)
  console.log(`   - Subscription Tiers: ${tierCount}`)
  console.log(`   - User Subscriptions: ${subscriptionCount}`)
  console.log(`   - User Credit Accounts: ${creditAccountCount}`)
  console.log(`   - Credit Transactions: ${transactionCount}`)
  console.log(`   - Audit Logs: ${auditLogCount}`)

  // Check sample user
  console.log('\n👤 Sample User Check:')
  const sampleUser = await prisma.user.findFirst({
    include: {
      subscription: {
        include: {
          subscription_tier: true,
        },
      },
      credits: true,
    },
  })

  if (sampleUser) {
    console.log(`   Email: ${sampleUser.email}`)
    console.log(`   Tier: ${sampleUser.subscription?.subscription_tier.display_name || 'None'}`)
    console.log(`   Status: ${sampleUser.subscription?.status || 'None'}`)
    console.log(`   Credits: ${sampleUser.credits?.balance || 0}`)
    console.log(`   Lifetime Earned: ${sampleUser.credits?.lifetime_earned || 0}`)
    console.log(`   Lifetime Spent: ${sampleUser.credits?.lifetime_spent || 0}`)
  }

  // Check admin
  console.log('\n🔐 Admin Account:')
  const admin = await prisma.admin.findUnique({
    where: { email: 'admin@califlow.com' },
  })

  if (admin) {
    console.log(`   Email: ${admin.email}`)
    console.log(`   Name: ${admin.first_name} ${admin.last_name}`)
    console.log(`   Super Admin: ${admin.is_super_admin}`)
    console.log(`   Active: ${admin.is_active}`)
  }

  // Check tiers
  console.log('\n💳 Subscription Tiers:')
  const tiers = await prisma.subscriptionTier.findMany({
    orderBy: { sort_order: 'asc' },
  })

  for (const tier of tiers) {
    console.log(`   - ${tier.display_name}: $${tier.price_monthly}/mo, ${tier.credits_per_month} credits`)
  }

  console.log('\n✅ Verification complete!')
}

verify()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Verification failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
