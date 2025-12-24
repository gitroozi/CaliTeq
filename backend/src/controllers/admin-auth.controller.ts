import { Request, Response } from 'express';
import { AdminRequest } from '../types/express';
import { AdminAuthService } from '../services/admin-auth.service';

export const adminAuthController = {
  /**
   * Admin login
   * POST /api/admin/auth/login
   */
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Get IP address and user agent for audit logging
      const ipAddress = req.ip || req.headers['x-forwarded-for'] as string || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          error: 'Email and password are required',
        });
      }

      const result = await AdminAuthService.login({
        email,
        password,
        ipAddress,
        userAgent,
      });

      return res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('Admin login error:', error);
      const statusCode = error.message === 'Invalid credentials' ? 401 : 500;
      return res.status(statusCode).json({
        error: error.message || 'Login failed',
      });
    }
  },

  /**
   * Refresh admin access token
   * POST /api/admin/auth/refresh
   */
  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          error: 'Refresh token is required',
        });
      }

      const result = await AdminAuthService.refreshToken(refreshToken);

      return res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('Admin token refresh error:', error);
      const statusCode = error.message === 'Invalid or expired refresh token' ? 401 : 500;
      return res.status(statusCode).json({
        error: error.message || 'Token refresh failed',
      });
    }
  },

  /**
   * Get current admin profile
   * GET /api/admin/auth/me
   */
  async getMe(req: AdminRequest, res: Response) {
    try {
      const adminId = req.adminId;

      if (!adminId) {
        return res.status(401).json({
          error: 'Unauthorized',
        });
      }

      const admin = await AdminAuthService.getAdminProfile(adminId);

      return res.json({
        success: true,
        data: admin,
      });
    } catch (error: any) {
      console.error('Get admin profile error:', error);
      return res.status(500).json({
        error: error.message || 'Failed to fetch admin profile',
      });
    }
  },

  /**
   * Change admin password
   * PUT /api/admin/auth/password
   */
  async changePassword(req: AdminRequest, res: Response) {
    try {
      const adminId = req.adminId;

      if (!adminId) {
        return res.status(401).json({
          error: 'Unauthorized',
        });
      }

      const { currentPassword, newPassword } = req.body;

      // Validate required fields
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          error: 'Current password and new password are required',
        });
      }

      // Validate new password strength
      if (newPassword.length < 8) {
        return res.status(400).json({
          error: 'New password must be at least 8 characters long',
        });
      }

      const ipAddress = req.ip || req.headers['x-forwarded-for'] as string || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';

      await AdminAuthService.changePassword(
        adminId,
        currentPassword,
        newPassword,
        ipAddress,
        userAgent
      );

      return res.json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error: any) {
      console.error('Change password error:', error);
      const statusCode = error.message === 'Current password is incorrect' ? 401 : 500;
      return res.status(statusCode).json({
        error: error.message || 'Failed to change password',
      });
    }
  },

  /**
   * Create new admin account (super admin only)
   * POST /api/admin/auth/create
   */
  async createAdmin(req: AdminRequest, res: Response) {
    try {
      const creatorAdminId = req.adminId;

      if (!creatorAdminId) {
        return res.status(401).json({
          error: 'Unauthorized',
        });
      }

      const { email, password, firstName, lastName, isSuperAdmin } = req.body;

      // Validate required fields
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
          error: 'Email, password, first name, and last name are required',
        });
      }

      // Validate password strength
      if (password.length < 8) {
        return res.status(400).json({
          error: 'Password must be at least 8 characters long',
        });
      }

      const ipAddress = req.ip || req.headers['x-forwarded-for'] as string || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';

      const newAdmin = await AdminAuthService.createAdmin(
        {
          email,
          password,
          firstName,
          lastName,
          isSuperAdmin: isSuperAdmin || false,
        },
        creatorAdminId,
        ipAddress,
        userAgent
      );

      return res.status(201).json({
        success: true,
        data: newAdmin,
      });
    } catch (error: any) {
      console.error('Create admin error:', error);
      const statusCode = error.message.includes('Super admin') ? 403 : 500;
      return res.status(statusCode).json({
        error: error.message || 'Failed to create admin',
      });
    }
  },

  /**
   * Deactivate admin account (super admin only)
   * PUT /api/admin/auth/:id/deactivate
   */
  async deactivateAdmin(req: AdminRequest, res: Response) {
    try {
      const deactivatorAdminId = req.adminId;

      if (!deactivatorAdminId) {
        return res.status(401).json({
          error: 'Unauthorized',
        });
      }

      const { id } = req.params;

      const ipAddress = req.ip || req.headers['x-forwarded-for'] as string || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';

      await AdminAuthService.deactivateAdmin(
        id,
        deactivatorAdminId,
        ipAddress,
        userAgent
      );

      return res.json({
        success: true,
        message: 'Admin account deactivated successfully',
      });
    } catch (error: any) {
      console.error('Deactivate admin error:', error);
      const statusCode = error.message.includes('Super admin') ? 403 :
                        error.message.includes('not found') ? 404 : 500;
      return res.status(statusCode).json({
        error: error.message || 'Failed to deactivate admin',
      });
    }
  },
};
