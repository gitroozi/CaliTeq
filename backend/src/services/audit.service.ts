import prisma from '../utils/db.js'

export interface AuditLogData {
  adminId: string
  action: string
  targetType: string
  targetId: string
  changes?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  impersonatedUserId?: string
}

/**
 * Audit Service
 * Handles logging of all admin actions for compliance and security
 */
export class AuditService {
  /**
   * Log an admin action
   */
  static async logAction(data: AuditLogData): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          admin_id: data.adminId,
          action: data.action,
          target_type: data.targetType,
          target_id: data.targetId,
          changes: data.changes || null,
          ip_address: data.ipAddress || null,
          user_agent: data.userAgent || null,
          impersonated_user_id: data.impersonatedUserId || null,
        },
      })
    } catch (error) {
      // Log audit failures but don't block the main operation
      console.error('Failed to create audit log:', error)
    }
  }

  /**
   * Get audit logs for an admin
   */
  static async getAdminLogs(
    adminId: string,
    options: {
      limit?: number
      offset?: number
      action?: string
      targetType?: string
    } = {}
  ) {
    const { limit = 50, offset = 0, action, targetType } = options

    const where: any = { admin_id: adminId }
    if (action) where.action = action
    if (targetType) where.target_type = targetType

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { created_at: 'desc' },
        take: limit,
        skip: offset,
        include: {
          admin: {
            select: {
              email: true,
              first_name: true,
              last_name: true,
            },
          },
        },
      }),
      prisma.auditLog.count({ where }),
    ])

    return {
      logs,
      total,
      limit,
      offset,
    }
  }

  /**
   * Get audit logs for a specific target (e.g., all actions on a user)
   */
  static async getTargetLogs(
    targetType: string,
    targetId: string,
    options: {
      limit?: number
      offset?: number
    } = {}
  ) {
    const { limit = 50, offset = 0 } = options

    const where = {
      target_type: targetType,
      target_id: targetId,
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { created_at: 'desc' },
        take: limit,
        skip: offset,
        include: {
          admin: {
            select: {
              email: true,
              first_name: true,
              last_name: true,
            },
          },
        },
      }),
      prisma.auditLog.count({ where }),
    ])

    return {
      logs,
      total,
      limit,
      offset,
    }
  }

  /**
   * Get all audit logs (super admin only)
   */
  static async getAllLogs(
    options: {
      limit?: number
      offset?: number
      action?: string
      targetType?: string
      adminId?: string
      fromDate?: Date
      toDate?: Date
    } = {}
  ) {
    const { limit = 50, offset = 0, action, targetType, adminId, fromDate, toDate } = options

    const where: any = {}
    if (action) where.action = action
    if (targetType) where.target_type = targetType
    if (adminId) where.admin_id = adminId
    if (fromDate || toDate) {
      where.created_at = {}
      if (fromDate) where.created_at.gte = fromDate
      if (toDate) where.created_at.lte = toDate
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { created_at: 'desc' },
        take: limit,
        skip: offset,
        include: {
          admin: {
            select: {
              email: true,
              first_name: true,
              last_name: true,
              is_super_admin: true,
            },
          },
        },
      }),
      prisma.auditLog.count({ where }),
    ])

    return {
      logs,
      total,
      limit,
      offset,
    }
  }

  /**
   * Get impersonation logs (all impersonation sessions)
   */
  static async getImpersonationLogs(
    options: {
      limit?: number
      offset?: number
      adminId?: string
      userId?: string
    } = {}
  ) {
    const { limit = 50, offset = 0, adminId, userId } = options

    const where: any = {
      action: { startsWith: 'impersonation.' },
    }
    if (adminId) where.admin_id = adminId
    if (userId) where.impersonated_user_id = userId

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { created_at: 'desc' },
        take: limit,
        skip: offset,
        include: {
          admin: {
            select: {
              email: true,
              first_name: true,
              last_name: true,
            },
          },
        },
      }),
      prisma.auditLog.count({ where }),
    ])

    return {
      logs,
      total,
      limit,
      offset,
    }
  }

  /**
   * Get audit log statistics
   */
  static async getStatistics(adminId?: string) {
    const where: any = adminId ? { admin_id: adminId } : {}

    const [
      totalLogs,
      uniqueAdmins,
      actionCounts,
      recentLogs,
    ] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.groupBy({
        by: ['admin_id'],
        where,
        _count: true,
      }),
      prisma.auditLog.groupBy({
        by: ['action'],
        where,
        _count: true,
        orderBy: {
          _count: {
            action: 'desc',
          },
        },
        take: 10,
      }),
      prisma.auditLog.findMany({
        where,
        orderBy: { created_at: 'desc' },
        take: 5,
        include: {
          admin: {
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
      total_logs: totalLogs,
      unique_admins: uniqueAdmins.length,
      top_actions: actionCounts.map((item) => ({
        action: item.action,
        count: item._count,
      })),
      recent_logs: recentLogs,
    }
  }
}

