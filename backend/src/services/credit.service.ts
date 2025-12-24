import { AuditService } from './audit.service.js'
import prisma from '../utils/db.js'

/**
 * Credit Service
 * Handles user credit management (grant, spend, refund, balance)
 */
export class CreditService {
  /**
   * Get user's credit balance
   */
  static async getUserCredits(userId: string) {
    const credits = await prisma.userCredit.findUnique({
      where: { user_id: userId },
    })

    if (!credits) {
      // Create credit account if it doesn't exist
      const newCredits = await prisma.userCredit.create({
        data: {
          user_id: userId,
          balance: 0,
          lifetime_earned: 0,
          lifetime_spent: 0,
        },
      })

      return {
        userId: newCredits.user_id,
        balance: newCredits.balance,
        lifetimeEarned: newCredits.lifetime_earned,
        lifetimeSpent: newCredits.lifetime_spent,
      }
    }

    return {
      userId: credits.user_id,
      balance: credits.balance,
      lifetimeEarned: credits.lifetime_earned,
      lifetimeSpent: credits.lifetime_spent,
    }
  }

  /**
   * Grant credits to a user (admin action)
   */
  static async grantCredits(
    userId: string,
    amount: number,
    adminId: string,
    reason: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    if (amount <= 0) {
      throw new Error('Credit amount must be positive')
    }

    return await prisma.$transaction(async (tx) => {
      // Get or create user credits
      let userCredits = await tx.userCredit.findUnique({
        where: { user_id: userId },
      })

      if (!userCredits) {
        userCredits = await tx.userCredit.create({
          data: {
            user_id: userId,
            balance: 0,
            lifetime_earned: 0,
            lifetime_spent: 0,
          },
        })
      }

      // Update credits
      const updatedCredits = await tx.userCredit.update({
        where: { user_id: userId },
        data: {
          balance: userCredits.balance + amount,
          lifetime_earned: userCredits.lifetime_earned + amount,
        },
      })

      // Create transaction record
      await tx.creditTransaction.create({
        data: {
          user_id: userId,
          amount,
          transaction_type: 'admin_grant',
          description: reason,
          balance_after: updatedCredits.balance,
          admin_id: adminId,
        },
      })

      // Log the grant
      await AuditService.logAction({
        adminId,
        action: 'credits.grant',
        targetType: 'user',
        targetId: userId,
        changes: {
          amount,
          before: { balance: userCredits.balance },
          after: { balance: updatedCredits.balance },
          reason,
        },
        ipAddress,
        userAgent,
      })

      return {
        userId: updatedCredits.user_id,
        balance: updatedCredits.balance,
        amountGranted: amount,
      }
    })
  }

  /**
   * Revoke credits from a user (admin action)
   */
  static async revokeCredits(
    userId: string,
    amount: number,
    adminId: string,
    reason: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    if (amount <= 0) {
      throw new Error('Credit amount must be positive')
    }

    return await prisma.$transaction(async (tx) => {
      // Get user credits
      const userCredits = await tx.userCredit.findUnique({
        where: { user_id: userId },
      })

      if (!userCredits) {
        throw new Error('User credit account not found')
      }

      // Check if user has enough credits
      if (userCredits.balance < amount) {
        throw new Error(`Insufficient credits. User has ${userCredits.balance}, trying to revoke ${amount}`)
      }

      // Update credits
      const updatedCredits = await tx.userCredit.update({
        where: { user_id: userId },
        data: {
          balance: userCredits.balance - amount,
          lifetime_spent: userCredits.lifetime_spent + amount,
        },
      })

      // Create transaction record
      await tx.creditTransaction.create({
        data: {
          user_id: userId,
          amount: -amount,
          transaction_type: 'admin_revoke',
          description: reason,
          balance_after: updatedCredits.balance,
          admin_id: adminId,
        },
      })

      // Log the revocation
      await AuditService.logAction({
        adminId,
        action: 'credits.revoke',
        targetType: 'user',
        targetId: userId,
        changes: {
          amount: -amount,
          before: { balance: userCredits.balance },
          after: { balance: updatedCredits.balance },
          reason,
        },
        ipAddress,
        userAgent,
      })

      return {
        userId: updatedCredits.user_id,
        balance: updatedCredits.balance,
        amountRevoked: amount,
      }
    })
  }

  /**
   * Spend credits (called by system during plan generation)
   */
  static async spendCredits(
    userId: string,
    amount: number,
    referenceId: string,
    referenceType: string,
    description: string
  ) {
    if (amount <= 0) {
      throw new Error('Credit amount must be positive')
    }

    return await prisma.$transaction(async (tx) => {
      // Get user credits
      const userCredits = await tx.userCredit.findUnique({
        where: { user_id: userId },
      })

      if (!userCredits) {
        throw new Error('User credit account not found')
      }

      // Check if user has enough credits
      if (userCredits.balance < amount) {
        throw new Error(`Insufficient credits. Required: ${amount}, Available: ${userCredits.balance}`)
      }

      // Update credits
      const updatedCredits = await tx.userCredit.update({
        where: { user_id: userId },
        data: {
          balance: userCredits.balance - amount,
          lifetime_spent: userCredits.lifetime_spent + amount,
        },
      })

      // Create transaction record
      await tx.creditTransaction.create({
        data: {
          user_id: userId,
          amount: -amount,
          transaction_type: 'plan_generation',
          reference_id: referenceId,
          reference_type: referenceType,
          description,
          balance_after: updatedCredits.balance,
        },
      })

      return {
        userId: updatedCredits.user_id,
        balance: updatedCredits.balance,
        amountSpent: amount,
      }
    })
  }

  /**
   * Refund credits (called when plan generation fails)
   */
  static async refundCredits(
    userId: string,
    amount: number,
    referenceId: string,
    referenceType: string,
    description: string
  ) {
    if (amount <= 0) {
      throw new Error('Credit amount must be positive')
    }

    return await prisma.$transaction(async (tx) => {
      // Get user credits
      const userCredits = await tx.userCredit.findUnique({
        where: { user_id: userId },
      })

      if (!userCredits) {
        throw new Error('User credit account not found')
      }

      // Update credits
      const updatedCredits = await tx.userCredit.update({
        where: { user_id: userId },
        data: {
          balance: userCredits.balance + amount,
          lifetime_spent: userCredits.lifetime_spent - amount,
        },
      })

      // Create transaction record
      await tx.creditTransaction.create({
        data: {
          user_id: userId,
          amount,
          transaction_type: 'refund',
          reference_id: referenceId,
          reference_type: referenceType,
          description,
          balance_after: updatedCredits.balance,
        },
      })

      return {
        userId: updatedCredits.user_id,
        balance: updatedCredits.balance,
        amountRefunded: amount,
      }
    })
  }

  /**
   * Get user's credit transaction history
   */
  static async getUserTransactions(
    userId: string,
    options: {
      limit?: number
      offset?: number
      transactionType?: string
    } = {}
  ) {
    const { limit = 50, offset = 0, transactionType } = options

    const where: any = { user_id: userId }
    if (transactionType) where.transaction_type = transactionType

    const [transactions, total] = await Promise.all([
      prisma.creditTransaction.findMany({
        where,
        orderBy: { created_at: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.creditTransaction.count({ where }),
    ])

    return {
      transactions: transactions.map((tx) => ({
        id: tx.id,
        amount: tx.amount,
        transactionType: tx.transaction_type,
        description: tx.description,
        balanceAfter: tx.balance_after,
        referenceId: tx.reference_id,
        referenceType: tx.reference_type,
        createdAt: tx.created_at,
      })),
      total,
      limit,
      offset,
    }
  }

  /**
   * Grant monthly credits to all active users based on their tier
   */
  static async grantMonthlyCredits(adminId: string) {
    const results = {
      processed: 0,
      succeeded: 0,
      failed: 0,
      errors: [] as string[],
    }

    // Get all active subscriptions
    const subscriptions = await prisma.userSubscription.findMany({
      where: { status: 'active' },
      include: {
        subscription_tier: true,
        user: {
          select: { email: true },
        },
      },
    })

    results.processed = subscriptions.length

    for (const subscription of subscriptions) {
      try {
        await this.grantCredits(
          subscription.user_id,
          subscription.subscription_tier.credits_per_month,
          adminId,
          `Monthly credit grant for ${subscription.subscription_tier.display_name} tier`
        )
        results.succeeded++
      } catch (error) {
        results.failed++
        results.errors.push(
          `Failed to grant credits to ${subscription.user.email}: ${error instanceof Error ? error.message : 'Unknown error'}`
        )
      }
    }

    // Log the batch operation
    await AuditService.logAction({
      adminId,
      action: 'credits.monthly_grant_batch',
      targetType: 'system',
      targetId: 'batch_operation',
      changes: {
        processed: results.processed,
        succeeded: results.succeeded,
        failed: results.failed,
      },
    })

    return results
  }

  /**
   * Get credit statistics
   */
  static async getCreditStats() {
    const [
      totalUsers,
      totalCreditsInCirculation,
      averageBalance,
      recentTransactions,
    ] = await Promise.all([
      prisma.userCredit.count(),
      prisma.userCredit.aggregate({
        _sum: { balance: true },
      }),
      prisma.userCredit.aggregate({
        _avg: { balance: true },
      }),
      prisma.creditTransaction.findMany({
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
        },
      }),
    ])

    return {
      total_users_with_credits: totalUsers,
      total_credits_in_circulation: totalCreditsInCirculation._sum.balance || 0,
      average_balance: Math.round(averageBalance._avg.balance || 0),
      recent_transactions: recentTransactions.map((tx) => ({
        userEmail: tx.user.email,
        amount: tx.amount,
        type: tx.transaction_type,
        description: tx.description,
        balanceAfter: tx.balance_after,
        createdAt: tx.created_at,
      })),
    }
  }
}

