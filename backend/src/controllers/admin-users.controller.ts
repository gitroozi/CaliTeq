import { Response } from 'express';
import { AdminRequest } from '../types/express';
import { AdminUserService } from '../services/admin-user.service';

export const adminUsersController = {
  /**
   * Get paginated list of users
   * GET /api/admin/users
   */
  async getUsers(req: AdminRequest, res: Response) {
    try {
      const adminId = req.adminId;

      if (!adminId) {
        return res.status(401).json({
          error: 'Unauthorized',
        });
      }

      const {
        page,
        limit,
        search,
        subscriptionTier,
        isActive,
        sortBy,
        sortOrder,
      } = req.query;

      // Calculate offset from page
      const pageNum = page ? parseInt(String(page), 10) : 1;
      const limitNum = limit ? parseInt(String(limit), 10) : 20;
      const offset = (pageNum - 1) * limitNum;

      const result = await AdminUserService.getUsers({
        limit: limitNum,
        offset,
        search: search ? String(search) : undefined,
        subscriptionTier: subscriptionTier ? String(subscriptionTier) : undefined,
        isActive: isActive !== undefined ? isActive === 'true' : undefined,
        sortBy: sortBy ? String(sortBy) as any : 'created_at',
        sortOrder: sortOrder ? String(sortOrder) as any : 'desc',
      });

      return res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('Get users error:', error);
      return res.status(500).json({
        error: error.message || 'Failed to fetch users',
      });
    }
  },

  /**
   * Get detailed user information
   * GET /api/admin/users/:id
   */
  async getUserDetails(req: AdminRequest, res: Response) {
    try {
      const adminId = req.adminId;

      if (!adminId) {
        return res.status(401).json({
          error: 'Unauthorized',
        });
      }

      const { id } = req.params;

      const ipAddress = req.ip || req.headers['x-forwarded-for'] as string || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';

      const user = await AdminUserService.getUserDetails(
        id,
        adminId,
        ipAddress,
        userAgent
      );

      return res.json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      console.error('Get user details error:', error);
      const statusCode = error.message.includes('not found') ? 404 : 500;
      return res.status(statusCode).json({
        error: error.message || 'Failed to fetch user details',
      });
    }
  },

  /**
   * Update user status (activate/deactivate)
   * PUT /api/admin/users/:id/status
   */
  async updateUserStatus(req: AdminRequest, res: Response) {
    try {
      const adminId = req.adminId;

      if (!adminId) {
        return res.status(401).json({
          error: 'Unauthorized',
        });
      }

      const { id } = req.params;
      const { isActive, reason } = req.body;

      if (isActive === undefined) {
        return res.status(400).json({
          error: 'isActive field is required',
        });
      }

      const ipAddress = req.ip || req.headers['x-forwarded-for'] as string || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';

      await AdminUserService.updateUserStatus(
        id,
        isActive,
        adminId,
        reason,
        ipAddress,
        userAgent
      );

      return res.json({
        success: true,
        message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error: any) {
      console.error('Update user status error:', error);
      const statusCode = error.message.includes('not found') ? 404 : 500;
      return res.status(statusCode).json({
        error: error.message || 'Failed to update user status',
      });
    }
  },

  /**
   * Update user email
   * PUT /api/admin/users/:id/email
   */
  async updateUserEmail(req: AdminRequest, res: Response) {
    try {
      const adminId = req.adminId;

      if (!adminId) {
        return res.status(401).json({
          error: 'Unauthorized',
        });
      }

      const { id } = req.params;
      const { email, reason } = req.body;

      if (!email) {
        return res.status(400).json({
          error: 'Email is required',
        });
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: 'Invalid email format',
        });
      }

      const ipAddress = req.ip || req.headers['x-forwarded-for'] as string || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';

      await AdminUserService.updateUserEmail(
        id,
        email,
        adminId,
        reason,
        ipAddress,
        userAgent
      );

      return res.json({
        success: true,
        message: 'User email updated successfully',
      });
    } catch (error: any) {
      console.error('Update user email error:', error);
      const statusCode = error.message.includes('not found') ? 404 :
                        error.message.includes('already in use') ? 400 : 500;
      return res.status(statusCode).json({
        error: error.message || 'Failed to update user email',
      });
    }
  },

  /**
   * Get user statistics
   * GET /api/admin/users/stats
   */
  async getUserStats(req: AdminRequest, res: Response) {
    try {
      const adminId = req.adminId;

      if (!adminId) {
        return res.status(401).json({
          error: 'Unauthorized',
        });
      }

      const stats = await AdminUserService.getUserStats();

      return res.json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      console.error('Get user stats error:', error);
      return res.status(500).json({
        error: error.message || 'Failed to fetch user statistics',
      });
    }
  },

  /**
   * Search users by email
   * GET /api/admin/users/search
   */
  async searchUsers(req: AdminRequest, res: Response) {
    try {
      const adminId = req.adminId;

      if (!adminId) {
        return res.status(401).json({
          error: 'Unauthorized',
        });
      }

      const { email } = req.query;

      if (!email) {
        return res.status(400).json({
          error: 'Email query parameter is required',
        });
      }

      const users = await AdminUserService.searchUsersByEmail(String(email));

      return res.json({
        success: true,
        data: users,
      });
    } catch (error: any) {
      console.error('Search users error:', error);
      return res.status(500).json({
        error: error.message || 'Failed to search users',
      });
    }
  },
};
