import { generateTokenPair } from '../utils/jwt.js'
import { AuditService } from './audit.service.js'
import prisma from '../utils/db.js'

// In-memory store for active impersonation sessions
// In production, this should be stored in Redis or similar
const activeImpersonations = new Map<
  string, // impersonation session ID
  {
    adminId: string
    userId: string
    startedAt: Date
  }
>()

/**
 * Impersonation Service
 * Handles admin impersonation of user accounts for support purposes
 */
export class ImpersonationService {
  /**
   * Start impersonating a user
   */
  static async startImpersonation(
    userId: string,
    adminId: string,
    reason: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new Error('User not found')
    }

    // Verify admin exists and is active
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    })

    if (!admin || !admin.is_active) {
      throw new Error('Admin not found or inactive')
    }

    // Generate a unique impersonation session ID
    const impersonationSessionId = `imp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Store impersonation session
    activeImpersonations.set(impersonationSessionId, {
      adminId,
      userId,
      startedAt: new Date(),
    })

    // Generate user tokens (admin will use these to act as the user)
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
    })

    // Log impersonation start
    await AuditService.logAction({
      adminId,
      action: 'impersonation.start',
      targetType: 'user',
      targetId: userId,
      changes: {
        reason,
        sessionId: impersonationSessionId,
      },
      impersonatedUserId: userId,
      ipAddress,
      userAgent,
    })

    return {
      impersonationSessionId,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
      tokens,
      startedAt: new Date(),
    }
  }

  /**
   * Stop impersonating a user
   */
  static async stopImpersonation(
    impersonationSessionId: string,
    adminId: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    const session = activeImpersonations.get(impersonationSessionId)

    if (!session) {
      throw new Error('Invalid impersonation session')
    }

    if (session.adminId !== adminId) {
      throw new Error('Cannot stop another admin\'s impersonation session')
    }

    const duration = Date.now() - session.startedAt.getTime()

    // Remove from active sessions
    activeImpersonations.delete(impersonationSessionId)

    // Log impersonation end
    await AuditService.logAction({
      adminId,
      action: 'impersonation.stop',
      targetType: 'user',
      targetId: session.userId,
      changes: {
        sessionId: impersonationSessionId,
        durationMs: duration,
      },
      impersonatedUserId: session.userId,
      ipAddress,
      userAgent,
    })

    return {
      success: true,
      duration: duration,
      userId: session.userId,
    }
  }

  /**
   * Get active impersonation session by ID
   */
  static getActiveSession(impersonationSessionId: string) {
    const session = activeImpersonations.get(impersonationSessionId)

    if (!session) {
      return null
    }

    return {
      adminId: session.adminId,
      userId: session.userId,
      startedAt: session.startedAt,
      duration: Date.now() - session.startedAt.getTime(),
    }
  }

  /**
   * Get all active impersonation sessions (super admin only)
   */
  static async getAllActiveSessions() {
    const sessions = Array.from(activeImpersonations.entries()).map(([sessionId, session]) => ({
      sessionId,
      adminId: session.adminId,
      userId: session.userId,
      startedAt: session.startedAt,
      duration: Date.now() - session.startedAt.getTime(),
    }))

    // Enrich with user and admin details
    const enrichedSessions = await Promise.all(
      sessions.map(async (session) => {
        const [user, admin] = await Promise.all([
          prisma.user.findUnique({
            where: { id: session.userId },
            select: {
              email: true,
              first_name: true,
              last_name: true,
            },
          }),
          prisma.admin.findUnique({
            where: { id: session.adminId },
            select: {
              email: true,
              first_name: true,
              last_name: true,
            },
          }),
        ])

        return {
          ...session,
          user: user
            ? {
                email: user.email,
                name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
              }
            : null,
          admin: admin
            ? {
                email: admin.email,
                name: `${admin.first_name} ${admin.last_name}`,
              }
            : null,
        }
      })
    )

    return enrichedSessions
  }

  /**
   * Get impersonation sessions for a specific admin
   */
  static async getAdminSessions(adminId: string) {
    const sessions = Array.from(activeImpersonations.entries())
      .filter(([_, session]) => session.adminId === adminId)
      .map(([sessionId, session]) => ({
        sessionId,
        userId: session.userId,
        startedAt: session.startedAt,
        duration: Date.now() - session.startedAt.getTime(),
      }))

    // Enrich with user details
    const enrichedSessions = await Promise.all(
      sessions.map(async (session) => {
        const user = await prisma.user.findUnique({
          where: { id: session.userId },
          select: {
            email: true,
            first_name: true,
            last_name: true,
          },
        })

        return {
          ...session,
          user: user
            ? {
                email: user.email,
                name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
              }
            : null,
        }
      })
    )

    return enrichedSessions
  }

  /**
   * Force stop all impersonation sessions for a user (emergency)
   */
  static async forceStopUserSessions(
    userId: string,
    stoppedByAdminId: string,
    reason: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    const stoppedSessions: string[] = []

    // Find all sessions for this user
    for (const [sessionId, session] of activeImpersonations.entries()) {
      if (session.userId === userId) {
        const duration = Date.now() - session.startedAt.getTime()

        // Remove session
        activeImpersonations.delete(sessionId)
        stoppedSessions.push(sessionId)

        // Log the forced stop
        await AuditService.logAction({
          adminId: stoppedByAdminId,
          action: 'impersonation.force_stop',
          targetType: 'user',
          targetId: userId,
          changes: {
            sessionId,
            originalAdminId: session.adminId,
            durationMs: duration,
            reason,
          },
          impersonatedUserId: userId,
          ipAddress,
          userAgent,
        })
      }
    }

    return {
      stoppedSessions: stoppedSessions.length,
      sessionIds: stoppedSessions,
    }
  }

  /**
   * Clean up expired sessions (called periodically)
   * Sessions older than maxDurationMs will be automatically stopped
   */
  static async cleanupExpiredSessions(maxDurationMs = 3600000) {
    // Default: 1 hour
    const now = Date.now()
    const expiredSessions: string[] = []

    for (const [sessionId, session] of activeImpersonations.entries()) {
      const duration = now - session.startedAt.getTime()

      if (duration > maxDurationMs) {
        // Log auto-cleanup
        await AuditService.logAction({
          adminId: session.adminId,
          action: 'impersonation.auto_cleanup',
          targetType: 'user',
          targetId: session.userId,
          changes: {
            sessionId,
            durationMs: duration,
            reason: 'Session exceeded maximum duration',
          },
          impersonatedUserId: session.userId,
        })

        activeImpersonations.delete(sessionId)
        expiredSessions.push(sessionId)
      }
    }

    return {
      cleanedUp: expiredSessions.length,
      sessionIds: expiredSessions,
    }
  }

  /**
   * Get impersonation history for a user
   */
  static async getUserImpersonationHistory(userId: string, limit = 50) {
    const logs = await AuditService.getTargetLogs('user', userId, { limit })

    const impersonationLogs = logs.logs.filter(
      (log) => log.action.startsWith('impersonation.')
    )

    return impersonationLogs.map((log) => ({
      action: log.action,
      admin: {
        email: log.admin.email,
        name: `${log.admin.first_name} ${log.admin.last_name}`,
      },
      timestamp: log.created_at,
      details: log.changes,
      ipAddress: log.ip_address,
    }))
  }
}
