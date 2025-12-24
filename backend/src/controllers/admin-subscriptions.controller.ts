import { Response } from 'express';
import { AdminRequest } from '../types/express';
import { SubscriptionService } from '../services/subscription.service';

export const adminSubscriptionsController = {
  /**
   * Get all subscription tiers
   * GET /api/admin/subscriptions/tiers
   */
  async getSubscriptionTiers(req: AdminRequest, res: Response) {
    try {
      const adminId = req.adminId;

      if (!adminId) {
        return res.status(401).json({
          error: 'Unauthorized',
        });
      }

      const tiers = await SubscriptionService.getTiers();

      return res.json({
        success: true,
        data: tiers,
      });
    } catch (error: any) {
      console.error('Get subscription tiers error:', error);
      return res.status(500).json({
        error: error.message || 'Failed to fetch subscription tiers',
      });
    }
  },

  /**
   * Change user's subscription tier
   * PUT /api/admin/users/:id/subscription
   */
  async changeUserSubscription(req: AdminRequest, res: Response) {
    try {
      const adminId = req.adminId;

      if (!adminId) {
        return res.status(401).json({
          error: 'Unauthorized',
        });
      }

      const { id: userId } = req.params;
      const { tierName, reason } = req.body;

      if (!tierName) {
        return res.status(400).json({
          error: 'Subscription tier name is required',
        });
      }

      const ipAddress = req.ip || req.headers['x-forwarded-for'] as string || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';

      await SubscriptionService.changeUserTier(
        userId,
        tierName,
        adminId,
        reason,
        ipAddress,
        userAgent
      );

      return res.json({
        success: true,
        message: 'User subscription changed successfully',
      });
    } catch (error: any) {
      console.error('Change user subscription error:', error);
      const statusCode = error.message.includes('not found') ? 404 : 500;
      return res.status(statusCode).json({
        error: error.message || 'Failed to change user subscription',
      });
    }
  },

  /**
   * Cancel user's subscription
   * POST /api/admin/users/:id/subscription/cancel
   */
  async cancelUserSubscription(req: AdminRequest, res: Response) {
    try {
      const adminId = req.adminId;

      if (!adminId) {
        return res.status(401).json({
          error: 'Unauthorized',
        });
      }

      const { id: userId } = req.params;
      const { reason } = req.body;

      const ipAddress = req.ip || req.headers['x-forwarded-for'] as string || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';

      await SubscriptionService.cancelSubscription(
        userId,
        adminId,
        reason,
        ipAddress,
        userAgent
      );

      return res.json({
        success: true,
        message: 'User subscription cancelled successfully',
      });
    } catch (error: any) {
      console.error('Cancel user subscription error:', error);
      const statusCode = error.message.includes('not found') ? 404 : 500;
      return res.status(statusCode).json({
        error: error.message || 'Failed to cancel user subscription',
      });
    }
  },

  /**
   * Reactivate cancelled subscription
   * POST /api/admin/users/:id/subscription/reactivate
   */
  async reactivateUserSubscription(req: AdminRequest, res: Response) {
    try {
      const adminId = req.adminId;

      if (!adminId) {
        return res.status(401).json({
          error: 'Unauthorized',
        });
      }

      const { id: userId } = req.params;
      const { reason } = req.body;

      const ipAddress = req.ip || req.headers['x-forwarded-for'] as string || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';

      await SubscriptionService.reactivateSubscription(
        userId,
        adminId,
        reason,
        ipAddress,
        userAgent
      );

      return res.json({
        success: true,
        message: 'User subscription reactivated successfully',
      });
    } catch (error: any) {
      console.error('Reactivate user subscription error:', error);
      const statusCode = error.message.includes('not found') ? 404 : 500;
      return res.status(statusCode).json({
        error: error.message || 'Failed to reactivate user subscription',
      });
    }
  },

  /**
   * Get subscription statistics
   * GET /api/admin/subscriptions/stats
   */
  async getSubscriptionStats(req: AdminRequest, res: Response) {
    try {
      const adminId = req.adminId;

      if (!adminId) {
        return res.status(401).json({
          error: 'Unauthorized',
        });
      }

      const stats = await SubscriptionService.getSubscriptionStats();

      return res.json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      console.error('Get subscription stats error:', error);
      return res.status(500).json({
        error: error.message || 'Failed to fetch subscription statistics',
      });
    }
  },

  /**
   * Get subscription history for a user
   * GET /api/admin/users/:id/subscription/history
   */
  async getUserSubscriptionHistory(req: AdminRequest, res: Response) {
    try {
      const adminId = req.adminId;

      if (!adminId) {
        return res.status(401).json({
          error: 'Unauthorized',
        });
      }

      const { id: userId } = req.params;

      const history = await SubscriptionService.getUserSubscriptionHistory(userId);

      return res.json({
        success: true,
        data: history,
      });
    } catch (error: any) {
      console.error('Get user subscription history error:', error);
      return res.status(500).json({
        error: error.message || 'Failed to fetch subscription history',
      });
    }
  },
};
