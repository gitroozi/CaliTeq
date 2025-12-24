import { Response } from 'express';
import { AdminRequest } from '../types/express';
import { CreditService } from '../services/credit.service';

export const adminCreditsController = {
  /**
   * Grant credits to a user
   * POST /api/admin/users/:id/credits/grant
   */
  async grantCredits(req: AdminRequest, res: Response) {
    try {
      const adminId = req.adminId;

      if (!adminId) {
        return res.status(401).json({
          error: 'Unauthorized',
        });
      }

      const { id: userId } = req.params;
      const { amount, description } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({
          error: 'Amount must be a positive number',
        });
      }

      const ipAddress = req.ip || req.headers['x-forwarded-for'] as string || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';

      const result = await CreditService.grantCredits(
        adminId,
        userId,
        amount,
        ipAddress,
        userAgent,
        description || 'Admin credit grant'
      );

      return res.json({
        success: true,
        data: result,
        message: `Granted ${amount} credits successfully`,
      });
    } catch (error: any) {
      console.error('Grant credits error:', error);
      const statusCode = error.message.includes('not found') ? 404 : 500;
      return res.status(statusCode).json({
        error: error.message || 'Failed to grant credits',
      });
    }
  },

  /**
   * Revoke credits from a user
   * POST /api/admin/users/:id/credits/revoke
   */
  async revokeCredits(req: AdminRequest, res: Response) {
    try {
      const adminId = req.adminId;

      if (!adminId) {
        return res.status(401).json({
          error: 'Unauthorized',
        });
      }

      const { id: userId } = req.params;
      const { amount, reason } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({
          error: 'Amount must be a positive number',
        });
      }

      const ipAddress = req.ip || req.headers['x-forwarded-for'] as string || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';

      const result = await CreditService.revokeCredits(
        adminId,
        userId,
        amount,
        ipAddress,
        userAgent,
        reason || 'Admin credit revocation'
      );

      return res.json({
        success: true,
        data: result,
        message: `Revoked ${amount} credits successfully`,
      });
    } catch (error: any) {
      console.error('Revoke credits error:', error);
      const statusCode = error.message.includes('not found') ? 404 :
                        error.message.includes('Insufficient') ? 400 : 500;
      return res.status(statusCode).json({
        error: error.message || 'Failed to revoke credits',
      });
    }
  },

  /**
   * Get user's credit balance
   * GET /api/admin/users/:id/credits
   */
  async getUserCredits(req: AdminRequest, res: Response) {
    try {
      const adminId = req.adminId;

      if (!adminId) {
        return res.status(401).json({
          error: 'Unauthorized',
        });
      }

      const { id: userId } = req.params;

      const credits = await CreditService.getUserCredits(userId);

      return res.json({
        success: true,
        data: credits,
      });
    } catch (error: any) {
      console.error('Get user credits error:', error);
      return res.status(500).json({
        error: error.message || 'Failed to fetch user credits',
      });
    }
  },

  /**
   * Get user's credit transaction history
   * GET /api/admin/users/:id/credits/transactions
   */
  async getUserCreditTransactions(req: AdminRequest, res: Response) {
    try {
      const adminId = req.adminId;

      if (!adminId) {
        return res.status(401).json({
          error: 'Unauthorized',
        });
      }

      const { id: userId } = req.params;
      const { page, limit, transactionType } = req.query;

      // Calculate offset from page
      const pageNum = page ? parseInt(String(page), 10) : 1;
      const limitNum = limit ? parseInt(String(limit), 10) : 20;
      const offset = (pageNum - 1) * limitNum;

      const transactions = await CreditService.getUserTransactions(
        userId,
        {
          limit: limitNum,
          offset,
          transactionType: transactionType ? String(transactionType) : undefined,
        }
      );

      return res.json({
        success: true,
        data: transactions,
      });
    } catch (error: any) {
      console.error('Get user credit transactions error:', error);
      return res.status(500).json({
        error: error.message || 'Failed to fetch credit transactions',
      });
    }
  },

  /**
   * Get credit statistics
   * GET /api/admin/credits/stats
   */
  async getCreditStats(req: AdminRequest, res: Response) {
    try {
      const adminId = req.adminId;

      if (!adminId) {
        return res.status(401).json({
          error: 'Unauthorized',
        });
      }

      const stats = await CreditService.getCreditStats();

      return res.json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      console.error('Get credit stats error:', error);
      return res.status(500).json({
        error: error.message || 'Failed to fetch credit statistics',
      });
    }
  },
};
