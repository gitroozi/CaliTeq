import prisma from '../src/utils/db.js'
import { AdminAuthService } from '../src/services/admin-auth.service.js'
import { SubscriptionService } from '../src/services/subscription.service.js'
import { CreditService } from '../src/services/credit.service.js'
import { AdminUserService } from '../src/services/admin-user.service.js'
import { ImpersonationService } from '../src/services/impersonation.service.js'
import { AuditService } from '../src/services/audit.service.js'
import { generateAdminTokenPair, verifyAdminToken } from '../src/utils/admin-jwt.js'

async function testServices() {
  console.log('🧪 Testing Admin Services...\n')

  let testsPassed = 0
  let testsFailed = 0

  try {
    // ==========================================
    // Test 1: Admin JWT Utilities
    // ==========================================
    console.log('📝 Test 1: Admin JWT Utilities')
    try {
      const admin = await prisma.admin.findUnique({
        where: { email: 'admin@califlow.com' },
      })

      if (!admin) throw new Error('Admin not found')

      const tokens = generateAdminTokenPair(admin)
      const payload = verifyAdminToken(tokens.accessToken)

      if (payload.adminId !== admin.id) throw new Error('Token payload mismatch')
      if (payload.isSuperAdmin !== admin.is_super_admin) throw new Error('Super admin flag mismatch')

      console.log('  ✅ JWT generation and verification working')
      testsPassed++
    } catch (error) {
      console.log('  ❌ JWT utilities failed:', error)
      testsFailed++
    }

    // ==========================================
    // Test 2: Admin Login
    // ==========================================
    console.log('\n📝 Test 2: Admin Login')
    try {
      const result = await AdminAuthService.login({
        email: 'admin@califlow.com',
        password: 'Admin123!',
        ipAddress: '127.0.0.1',
        userAgent: 'Test Script',
      })

      if (!result.admin) throw new Error('No admin returned')
      if (!result.tokens.accessToken) throw new Error('No access token')
      if (!result.tokens.refreshToken) throw new Error('No refresh token')

      console.log('  ✅ Admin login successful')
      console.log(`     Email: ${result.admin.email}`)
      console.log(`     Super Admin: ${result.admin.isSuperAdmin}`)
      testsPassed++
    } catch (error) {
      console.log('  ❌ Admin login failed:', error)
      testsFailed++
    }

    // ==========================================
    // Test 3: Subscription Tiers
    // ==========================================
    console.log('\n📝 Test 3: Subscription Tiers')
    try {
      const tiers = await SubscriptionService.getTiers()

      if (tiers.length !== 3) throw new Error('Expected 3 tiers')

      const freeTier = tiers.find((t) => t.name === 'free')
      const proTier = tiers.find((t) => t.name === 'pro')
      const premiumTier = tiers.find((t) => t.name === 'premium')

      if (!freeTier || !proTier || !premiumTier) throw new Error('Missing tiers')

      console.log('  ✅ All subscription tiers found')
      console.log(`     Free: ${freeTier.creditsPerMonth} credits/mo`)
      console.log(`     Pro: ${proTier.creditsPerMonth} credits/mo`)
      console.log(`     Premium: ${premiumTier.creditsPerMonth} credits/mo`)
      testsPassed++
    } catch (error) {
      console.log('  ❌ Subscription tiers failed:', error)
      testsFailed++
    }

    // ==========================================
    // Test 4: User Subscription Management
    // ==========================================
    console.log('\n📝 Test 4: User Subscription Management')
    try {
      const user = await prisma.user.findFirst()
      if (!user) throw new Error('No test user found')

      const admin = await prisma.admin.findFirst()
      if (!admin) throw new Error('No admin found')

      const subscription = await SubscriptionService.getUserSubscription(user.id)

      if (!subscription) throw new Error('User has no subscription')
      if (subscription.tier.name !== 'free') throw new Error('Expected free tier')

      console.log('  ✅ User subscription retrieved')
      console.log(`     User: ${user.email}`)
      console.log(`     Tier: ${subscription.tier.displayName}`)
      console.log(`     Status: ${subscription.status}`)
      testsPassed++
    } catch (error) {
      console.log('  ❌ User subscription management failed:', error)
      testsFailed++
    }

    // ==========================================
    // Test 5: Credit Management
    // ==========================================
    console.log('\n📝 Test 5: Credit Management')
    try {
      const user = await prisma.user.findFirst()
      if (!user) throw new Error('No test user found')

      const admin = await prisma.admin.findFirst()
      if (!admin) throw new Error('No admin found')

      // Get initial balance
      const initialCredits = await CreditService.getUserCredits(user.id)
      console.log(`     Initial balance: ${initialCredits.balance} credits`)

      // Grant credits
      const granted = await CreditService.grantCredits(
        user.id,
        10,
        admin.id,
        'Test credit grant',
        '127.0.0.1',
        'Test Script'
      )

      if (granted.amountGranted !== 10) throw new Error('Grant amount mismatch')
      if (granted.balance !== initialCredits.balance + 10) throw new Error('Balance mismatch')

      console.log(`     After grant: ${granted.balance} credits`)

      // Revoke credits
      const revoked = await CreditService.revokeCredits(
        user.id,
        5,
        admin.id,
        'Test credit revoke',
        '127.0.0.1',
        'Test Script'
      )

      if (revoked.amountRevoked !== 5) throw new Error('Revoke amount mismatch')
      if (revoked.balance !== granted.balance - 5) throw new Error('Balance mismatch after revoke')

      console.log(`     After revoke: ${revoked.balance} credits`)

      console.log('  ✅ Credit management working')
      testsPassed++
    } catch (error) {
      console.log('  ❌ Credit management failed:', error)
      testsFailed++
    }

    // ==========================================
    // Test 6: Admin User Service
    // ==========================================
    console.log('\n📝 Test 6: Admin User Service')
    try {
      const admin = await prisma.admin.findFirst()
      if (!admin) throw new Error('No admin found')

      // Get all users
      const usersResult = await AdminUserService.getUsers({ limit: 5 })

      if (!usersResult.users || usersResult.users.length === 0) {
        throw new Error('No users found')
      }

      console.log(`  ✅ Retrieved ${usersResult.total} users (showing ${usersResult.users.length})`)

      // Get specific user details
      const firstUser = usersResult.users[0]
      const userDetails = await AdminUserService.getUserDetails(
        firstUser.id,
        admin.id,
        '127.0.0.1',
        'Test Script'
      )

      if (userDetails.id !== firstUser.id) throw new Error('User details mismatch')

      console.log(`     User details retrieved: ${userDetails.email}`)
      testsPassed++
    } catch (error) {
      console.log('  ❌ Admin user service failed:', error)
      testsFailed++
    }

    // ==========================================
    // Test 7: Impersonation Service
    // ==========================================
    console.log('\n📝 Test 7: Impersonation Service')
    try {
      const user = await prisma.user.findFirst()
      if (!user) throw new Error('No test user found')

      const admin = await prisma.admin.findFirst()
      if (!admin) throw new Error('No admin found')

      // Start impersonation
      const session = await ImpersonationService.startImpersonation(
        user.id,
        admin.id,
        'Test impersonation',
        '127.0.0.1',
        'Test Script'
      )

      if (!session.impersonationSessionId) throw new Error('No session ID')
      if (session.user.id !== user.id) throw new Error('User ID mismatch')
      if (!session.tokens.accessToken) throw new Error('No tokens generated')

      console.log('  ✅ Impersonation started')
      console.log(`     Session ID: ${session.impersonationSessionId}`)
      console.log(`     Impersonating: ${session.user.email}`)

      // Stop impersonation
      const stopped = await ImpersonationService.stopImpersonation(
        session.impersonationSessionId,
        admin.id,
        '127.0.0.1',
        'Test Script'
      )

      if (!stopped.success) throw new Error('Failed to stop impersonation')

      console.log('  ✅ Impersonation stopped')
      testsPassed++
    } catch (error) {
      console.log('  ❌ Impersonation service failed:', error)
      testsFailed++
    }

    // ==========================================
    // Test 8: Audit Service
    // ==========================================
    console.log('\n📝 Test 8: Audit Service')
    try {
      const admin = await prisma.admin.findFirst()
      if (!admin) throw new Error('No admin found')

      // Get audit logs
      const logs = await AuditService.getAdminLogs(admin.id, { limit: 10 })

      console.log(`  ✅ Retrieved ${logs.total} audit logs`)
      console.log(`     Recent actions:`)
      logs.logs.slice(0, 3).forEach((log) => {
        console.log(`       - ${log.action} (${new Date(log.created_at).toLocaleString()})`)
      })

      testsPassed++
    } catch (error) {
      console.log('  ❌ Audit service failed:', error)
      testsFailed++
    }

    // ==========================================
    // Summary
    // ==========================================
    console.log('\n' + '='.repeat(50))
    console.log('📊 Test Summary')
    console.log('='.repeat(50))
    console.log(`✅ Passed: ${testsPassed}`)
    console.log(`❌ Failed: ${testsFailed}`)
    console.log(`📝 Total: ${testsPassed + testsFailed}`)

    if (testsFailed === 0) {
      console.log('\n🎉 All tests passed!')
    } else {
      console.log('\n⚠️  Some tests failed')
    }
  } catch (error) {
    console.error('\n💥 Fatal error during testing:', error)
    process.exit(1)
  }
}

testServices()
  .then(async () => {
    await prisma.$disconnect()
    console.log('\n✅ Testing completed')
  })
  .catch(async (e) => {
    console.error('❌ Testing failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
