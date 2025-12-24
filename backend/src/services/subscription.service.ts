import { AuditService } from './audit.service.js'
import prisma from '../utils/db.js'

/**
 * Subscription Service
 * Handles user subscription management and tier changes
 */
export class SubscriptionService {
  /**
   * Get all available subscription tiers
   */
  static async getTiers() {
    const tiers = await prisma.subscriptionTier.findMany({
      where: { is_active: true },
      orderBy: { sort_order: 'asc' },
    })

    return tiers.map((tier) => ({
      id: tier.id,
      name: tier.name,
      displayName: tier.display_name,
      description: tier.description,
      priceMonthly: Number(tier.price_monthly),
      creditsPerMonth: tier.credits_per_month,
      features: tier.features as Record<string, any>,
      isActive: tier.is_active,
      sortOrder: tier.sort_order,
    }))
  }

  /**
   * Get user's current subscription
   */
  static async getUserSubscription(userId: string) {
    const subscription = await prisma.userSubscription.findUnique({
      where: { user_id: userId },
      include: {
        subscription_tier: true,
      },
    })

    if (!subscription) {
      return null
    }

    return {
      id: subscription.id,
      userId: subscription.user_id,
      tier: {
        id: subscription.subscription_tier.id,
        name: subscription.subscription_tier.name,
        displayName: subscription.subscription_tier.display_name,
        priceMonthly: Number(subscription.subscription_tier.price_monthly),
        creditsPerMonth: subscription.subscription_tier.credits_per_month,
        features: subscription.subscription_tier.features as Record<string, any>,
      },
      status: subscription.status,
      startedAt: subscription.started_at,
      expiresAt: subscription.expires_at,
      autoRenew: subscription.auto_renew,
      stripeSubscriptionId: subscription.stripe_subscription_id,
      stripeCustomerId: subscription.stripe_customer_id,
      createdAt: subscription.created_at,
      cancelledAt: subscription.cancelled_at,
    }
  }

  /**
   * Change user's subscription tier (admin action)
   */
  static async changeUserTier(
    userId: string,
    newTierName: string,
    adminId: string,
    reason?: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    // Get the new tier
    const newTier = await prisma.subscriptionTier.findUnique({
      where: { name: newTierName },
    })

    if (!newTier) {
      throw new Error('Subscription tier not found')
    }

    // Get current subscription
    const currentSubscription = await prisma.userSubscription.findUnique({
      where: { user_id: userId },
      include: { subscription_tier: true },
    })

    if (!currentSubscription) {
      throw new Error('User does not have an active subscription')
    }

    const oldTierName = currentSubscription.subscription_tier.name

    // Update subscription
    const updatedSubscription = await prisma.userSubscription.update({
      where: { user_id: userId },
      data: {
        subscription_tier_id: newTier.id,
      },
      include: {
        subscription_tier: true,
      },
    })

    // Update user's subscription_tier field for backward compatibility
    await prisma.user.update({
      where: { id: userId },
      data: { subscription_tier: newTierName },
    })

    // Log the tier change
    await AuditService.logAction({
      adminId,
      action: 'subscription.tier_change',
      targetType: 'user',
      targetId: userId,
      changes: {
        before: { tier: oldTierName },
        after: { tier: newTierName },
        reason: reason || 'Admin tier change',
      },
      ipAddress,
      userAgent,
    })

    return {
      id: updatedSubscription.id,
      userId: updatedSubscription.user_id,
      tier: {
        id: updatedSubscription.subscription_tier.id,
        name: updatedSubscription.subscription_tier.name,
        displayName: updatedSubscription.subscription_tier.display_name,
      },
      status: updatedSubscription.status,
    }
  }

  /**
   * Cancel user's subscription (set to cancel at period end)
   */
  static async cancelSubscription(
    userId: string,
    adminId: string,
    reason?: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    const subscription = await prisma.userSubscription.findUnique({
      where: { user_id: userId },
      include: { subscription_tier: true },
    })

    if (!subscription) {
      throw new Error('User does not have an active subscription')
    }

    // Update subscription
    const updatedSubscription = await prisma.userSubscription.update({
      where: { user_id: userId },
      data: {
        status: 'cancelled',
        auto_renew: false,
        cancelled_at: new Date(),
      },
      include: {
        subscription_tier: true,
      },
    })

    // Log cancellation
    await AuditService.logAction({
      adminId,
      action: 'subscription.cancel',
      targetType: 'user',
      targetId: userId,
      changes: {
        before: { status: subscription.status, auto_renew: subscription.auto_renew },
        after: { status: 'cancelled', auto_renew: false },
        reason: reason || 'Admin cancellation',
      },
      ipAddress,
      userAgent,
    })

    return {
      id: updatedSubscription.id,
      userId: updatedSubscription.user_id,
      status: updatedSubscription.status,
      cancelledAt: updatedSubscription.cancelled_at,
    }
  }

  /**
   * Reactivate a cancelled subscription
   */
  static async reactivateSubscription(
    userId: string,
    adminId: string,
    reason?: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    const subscription = await prisma.userSubscription.findUnique({
      where: { user_id: userId },
      include: { subscription_tier: true },
    })

    if (!subscription) {
      throw new Error('User does not have a subscription')
    }

    // Update subscription
    const updatedSubscription = await prisma.userSubscription.update({
      where: { user_id: userId },
      data: {
        status: 'active',
        auto_renew: true,
        cancelled_at: null,
      },
      include: {
        subscription_tier: true,
      },
    })

    // Log reactivation
    await AuditService.logAction({
      adminId,
      action: 'subscription.reactivate',
      targetType: 'user',
      targetId: userId,
      changes: {
        before: { status: subscription.status, auto_renew: subscription.auto_renew },
        after: { status: 'active', auto_renew: true },
        reason: reason || 'Admin reactivation',
      },
      ipAddress,
      userAgent,
    })

    return {
      id: updatedSubscription.id,
      userId: updatedSubscription.user_id,
      status: updatedSubscription.status,
      autoRenew: updatedSubscription.auto_renew,
    }
  }

  /**
   * Get subscription statistics
   */
  static async getSubscriptionStats() {
    const [
      totalSubscriptions,
      activeSubscriptions,
      tierBreakdown,
      recentSubscriptions,
    ] = await Promise.all([
      prisma.userSubscription.count(),
      prisma.userSubscription.count({
        where: { status: 'active' },
      }),
      prisma.userSubscription.groupBy({
        by: ['subscription_tier_id'],
        _count: true,
      }),
      prisma.userSubscription.findMany({
        orderBy: { created_at: 'desc' },
        take: 10,
        include: {
          user: {
            select: {
              email: true,
              first_name: true,
              last_name: true,
            },
          },
          subscription_tier: {
            select: {
              name: true,
              display_name: true,
            },
          },
        },
      }),
    ])

    // Get tier names for breakdown
    const tiers = await prisma.subscriptionTier.findMany()
    const tierMap = new Map(tiers.map((t) => [t.id, t.display_name]))

    const tierBreakdownWithNames = await Promise.all(
      tierBreakdown.map(async (item) => {
        const tier = tiers.find((t) => t.id === item.subscription_tier_id)
        return {
          tier: tier?.name || 'unknown',
          displayName: tier?.display_name || 'Unknown',
          count: item._count,
        }
      })
    )

    return {
      total_subscriptions: totalSubscriptions,
      active_subscriptions: activeSubscriptions,
      tier_breakdown: tierBreakdownWithNames,
      recent_subscriptions: recentSubscriptions.map((sub) => ({
        userId: sub.user_id,
        userEmail: sub.user.email,
        tier: sub.subscription_tier.display_name,
        status: sub.status,
        createdAt: sub.created_at,
      })),
    }
  }

  /**
   * Get subscription history for a user
   */
  static async getUserSubscriptionHistory(userId: string) {
    // Get audit logs for subscription changes
    const logs = await AuditService.getTargetLogs('user', userId, { limit: 100 })

    const subscriptionLogs = logs.logs.filter(
      (log) => log.action.startsWith('subscription.')
    )

    return subscriptionLogs.map((log) => ({
      action: log.action,
      changes: log.changes,
      performedBy: {
        email: log.admin.email,
        name: `${log.admin.first_name} ${log.admin.last_name}`,
      },
      performedAt: log.created_at,
    }))
  }
}

