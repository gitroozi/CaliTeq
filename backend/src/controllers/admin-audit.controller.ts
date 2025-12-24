import { Response } from 'express';
import { AdminRequest } from '../types/express';
import { AuditService } from '../services/audit.service';

export const adminAuditController = {
  /**
   * Get audit logs with filters
   * GET /api/admin/audit/logs
   */
  async getAuditLogs(req: AdminRequest, res: Response) {
    try {
      const adminId = req.adminId;
      const isSuperAdmin = req.isSuperAdmin;

      if (!adminId) {
        return res.status(401).json({
          error: 'Unauthorized',
        });
      }

      const {
        page,
        limit,
        action,
        targetType,
        filterAdminId,
        fromDate,
        toDate,
      } = req.query;

      // Calculate offset from page
      const pageNum = page ? parseInt(String(page), 10) : 1;
      const limitNum = limit ? parseInt(String(limit), 10) : 50;
      const offset = (pageNum - 1) * limitNum;

      // Non-super admins can only see their own logs
      const effectiveAdminId = isSuperAdmin && filterAdminId
        ? String(filterAdminId)
        : (!isSuperAdmin ? adminId : undefined);

      const logs = isSuperAdmin
        ? await AuditService.getAllLogs({
            limit: limitNum,
            offset,
            action: action ? String(action) : undefined,
            targetType: targetType ? String(targetType) : undefined,
            adminId: effectiveAdminId,
            fromDate: fromDate ? new Date(String(fromDate)) : undefined,
            toDate: toDate ? new Date(String(toDate)) : undefined,
          })
        : await AuditService.getAdminLogs(adminId, {
            limit: limitNum,
            offset,
            action: action ? String(action) : undefined,
            targetType: targetType ? String(targetType) : undefined,
          });

      return res.json({
        success: true,
        data: logs,
      });
    } catch (error: any) {
      console.error('Get audit logs error:', error);
      return res.status(500).json({
        error: error.message || 'Failed to fetch audit logs',
      });
    }
  },

  /**
   * Get audit logs for a specific user
   * GET /api/admin/audit/logs/user/:userId
   */
  async getUserAuditLogs(req: AdminRequest, res: Response) {
    try {
      const adminId = req.adminId;

      if (!adminId) {
        return res.status(401).json({
          error: 'Unauthorized',
        });
      }

      const { userId } = req.params;
      const { page, limit } = req.query;

      // Calculate offset from page
      const pageNum = page ? parseInt(String(page), 10) : 1;
      const limitNum = limit ? parseInt(String(limit), 10) : 50;
      const offset = (pageNum - 1) * limitNum;

      const logs = await AuditService.getTargetLogs('user', userId, {
        limit: limitNum,
        offset,
      });

      return res.json({
        success: true,
        data: logs,
      });
    } catch (error: any) {
      console.error('Get user audit logs error:', error);
      return res.status(500).json({
        error: error.message || 'Failed to fetch user audit logs',
      });
    }
  },

  /**
   * Get impersonation logs
   * GET /api/admin/audit/impersonation
   */
  async getImpersonationLogs(req: AdminRequest, res: Response) {
    try {
      const adminId = req.adminId;
      const isSuperAdmin = req.isSuperAdmin;

      if (!adminId) {
        return res.status(401).json({
          error: 'Unauthorized',
        });
      }

      const { filterAdminId, userId, page, limit } = req.query;

      // Calculate offset from page
      const pageNum = page ? parseInt(String(page), 10) : 1;
      const limitNum = limit ? parseInt(String(limit), 10) : 50;
      const offset = (pageNum - 1) * limitNum;

      // Non-super admins can only see their own impersonation logs
      const effectiveAdminId = isSuperAdmin && filterAdminId
        ? String(filterAdminId)
        : (!isSuperAdmin ? adminId : undefined);

      const logs = await AuditService.getImpersonationLogs({
        adminId: effectiveAdminId,
        userId: userId ? String(userId) : undefined,
        limit: limitNum,
        offset,
      });

      return res.json({
        success: true,
        data: logs,
      });
    } catch (error: any) {
      console.error('Get impersonation logs error:', error);
      return res.status(500).json({
        error: error.message || 'Failed to fetch impersonation logs',
      });
    }
  },

  /**
   * Get audit statistics
   * GET /api/admin/audit/stats
   */
  async getAuditStats(req: AdminRequest, res: Response) {
    try {
      const adminId = req.adminId;

      if (!adminId) {
        return res.status(401).json({
          error: 'Unauthorized',
        });
      }

      const stats = await AuditService.getStatistics();

      return res.json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      console.error('Get audit stats error:', error);
      return res.status(500).json({
        error: error.message || 'Failed to fetch audit statistics',
      });
    }
  },
};
