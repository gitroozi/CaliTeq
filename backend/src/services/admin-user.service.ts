import { AuditService } from './audit.service.js'
import prisma from '../utils/db.js'

/**
 * Admin User Service
 * Handles user management operations for admins
 */
export class AdminUserService {
  /**
   * Get all users with pagination and filters
   */
  static async getUsers(
    options: {
      limit?: number
      offset?: number
      search?: string
      subscriptionTier?: string
      isActive?: boolean
      sortBy?: 'created_at' | 'email' | 'last_login_at'
      sortOrder?: 'asc' | 'desc'
    } = {}
  ) {
    const {
      limit = 50,
      offset = 0,
      search,
      subscriptionTier,
      isActive,
      sortBy = 'created_at',
      sortOrder = 'desc',
    } = options

    const where: any = {}

    // Search filter
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { first_name: { contains: search, mode: 'insensitive' } },
        { last_name: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Subscription tier filter
    if (subscriptionTier) {
      where.subscription_tier = subscriptionTier
    }

    // Active status filter
    if (isActive !== undefined) {
      where.is_active = isActive
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        take: limit,
        skip: offset,
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
          subscription_tier: true,
          is_active: true,
          email_verified: true,
          created_at: true,
          last_login_at: true,
          subscription: {
            select: {
              status: true,
              subscription_tier: {
                select: {
                  display_name: true,
                },
              },
            },
          },
          credits: {
            select: {
              balance: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ])

    return {
      users: users.map((user) => ({
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        subscriptionTier: user.subscription?.subscription_tier.display_name || user.subscription_tier,
        subscriptionStatus: user.subscription?.status || 'unknown',
        creditBalance: user.credits?.balance || 0,
        isActive: user.is_active,
        emailVerified: user.email_verified,
        createdAt: user.created_at,
        lastLoginAt: user.last_login_at,
      })),
      total,
      limit,
      offset,
    }
  }

  /**
   * Get detailed user information
   */
  static async getUserDetails(userId: string, adminId: string, ipAddress?: string, userAgent?: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        subscription: {
          include: {
            subscription_tier: true,
          },
        },
        credits: true,
        workout_plans: {
          orderBy: { created_at: 'desc' },
          take: 5,
          select: {
            id: true,
            name: true,
            status: true,
            start_date: true,
            end_date: true,
            created_at: true,
          },
        },
        workout_logs: {
          orderBy: { started_at: 'desc' },
          take: 5,
          select: {
            id: true,
            started_at: true,
            completed_at: true,
            overall_difficulty: true,
            energy_level: true,
          },
        },
        progress_metrics: {
          orderBy: { recorded_at: 'desc' },
          take: 5,
          select: {
            id: true,
            metric_type: true,
            recorded_at: true,
            data: true,
          },
        },
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    // Log the view action
    await AuditService.logAction({
      adminId,
      action: 'user.view',
      targetType: 'user',
      targetId: userId,
      ipAddress,
      userAgent,
    })

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      dateOfBirth: user.date_of_birth,
      gender: user.gender,
      heightCm: user.height_cm ? Number(user.height_cm) : null,
      currentWeightKg: user.current_weight_kg ? Number(user.current_weight_kg) : null,
      targetWeightKg: user.target_weight_kg ? Number(user.target_weight_kg) : null,
      emailVerified: user.email_verified,
      isActive: user.is_active,
      subscriptionTier: user.subscription_tier,
      preferences: user.preferences,
      createdAt: user.created_at,
      lastLoginAt: user.last_login_at,
      subscription: user.subscription
        ? {
            tier: {
              name: user.subscription.subscription_tier.name,
              displayName: user.subscription.subscription_tier.display_name,
              priceMonthly: Number(user.subscription.subscription_tier.price_monthly),
              creditsPerMonth: user.subscription.subscription_tier.credits_per_month,
            },
            status: user.subscription.status,
            startedAt: user.subscription.started_at,
            expiresAt: user.subscription.expires_at,
            autoRenew: user.subscription.auto_renew,
          }
        : null,
      credits: user.credits
        ? {
            balance: user.credits.balance,
            lifetimeEarned: user.credits.lifetime_earned,
            lifetimeSpent: user.credits.lifetime_spent,
          }
        : null,
      profile: user.profile
        ? {
            trainingExperience: user.profile.training_experience,
            activityLevel: user.profile.activity_level,
            goals: user.profile.goals,
            daysPerWeek: user.profile.days_per_week,
            minutesPerSession: user.profile.minutes_per_session,
            injuries: user.profile.injuries,
            medicalConditions: user.profile.medical_conditions,
            equipment: user.profile.equipment,
            assessmentScores: user.profile.assessment_scores,
          }
        : null,
      recentWorkoutPlans: user.workout_plans,
      recentWorkouts: user.workout_logs.map((log) => ({
        id: log.id,
        startedAt: log.started_at,
        completedAt: log.completed_at,
        difficulty: log.overall_difficulty,
        energy: log.energy_level,
      })),
      recentProgressMetrics: user.progress_metrics.map((metric) => ({
        id: metric.id,
        type: metric.metric_type,
        recordedAt: metric.recorded_at,
        data: metric.data,
      })),
    }
  }

  /**
   * Update user account status
   */
  static async updateUserStatus(
    userId: string,
    isActive: boolean,
    adminId: string,
    reason?: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new Error('User not found')
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { is_active: isActive },
    })

    // Log the status change
    await AuditService.logAction({
      adminId,
      action: isActive ? 'user.activate' : 'user.deactivate',
      targetType: 'user',
      targetId: userId,
      changes: {
        before: { is_active: user.is_active },
        after: { is_active: isActive },
        reason: reason || (isActive ? 'Admin activation' : 'Admin deactivation'),
      },
      ipAddress,
      userAgent,
    })

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      isActive: updatedUser.is_active,
    }
  }

  /**
   * Update user email
   */
  static async updateUserEmail(
    userId: string,
    newEmail: string,
    adminId: string,
    reason?: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new Error('User not found')
    }

    // Check if email is already taken
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail },
    })

    if (existingUser && existingUser.id !== userId) {
      throw new Error('Email is already taken')
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        email: newEmail,
        email_verified: false, // Reset verification when email changes
      },
    })

    // Log the email change
    await AuditService.logAction({
      adminId,
      action: 'user.email_change',
      targetType: 'user',
      targetId: userId,
      changes: {
        before: { email: user.email },
        after: { email: newEmail },
        reason: reason || 'Admin email change',
      },
      ipAddress,
      userAgent,
    })

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      emailVerified: updatedUser.email_verified,
    }
  }

  /**
   * Get user statistics dashboard
   */
  static async getUserStats() {
    const [
      totalUsers,
      activeUsers,
      verifiedUsers,
      tierBreakdown,
      recentSignups,
      activeUsersByDay,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { is_active: true } }),
      prisma.user.count({ where: { email_verified: true } }),
      prisma.user.groupBy({
        by: ['subscription_tier'],
        _count: true,
      }),
      prisma.user.findMany({
        orderBy: { created_at: 'desc' },
        take: 10,
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
          subscription_tier: true,
          created_at: true,
        },
      }),
      prisma.user.count({
        where: {
          last_login_at: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      }),
    ])

    return {
      total_users: totalUsers,
      active_users: activeUsers,
      verified_users: verifiedUsers,
      active_last_24h: activeUsersByDay,
      tier_breakdown: tierBreakdown.map((item) => ({
        tier: item.subscription_tier,
        count: item._count,
      })),
      recent_signups: recentSignups.map((user) => ({
        id: user.id,
        email: user.email,
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        tier: user.subscription_tier,
        createdAt: user.created_at,
      })),
    }
  }

  /**
   * Search users by email
   */
  static async searchUsersByEmail(query: string, limit = 20) {
    const users = await prisma.user.findMany({
      where: {
        email: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: limit,
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        subscription_tier: true,
        is_active: true,
      },
    })

    return users.map((user) => ({
      id: user.id,
      email: user.email,
      name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
      tier: user.subscription_tier,
      isActive: user.is_active,
    }))
  }
}
