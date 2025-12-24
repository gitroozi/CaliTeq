import { Router } from 'express';
import { adminSubscriptionsController } from '../controllers/admin-subscriptions.controller';
import { authenticateAdmin } from '../middleware/admin-auth.middleware';

const router = Router();

// All routes require admin authentication
router.use(authenticateAdmin);

// Tier management
router.get('/tiers', adminSubscriptionsController.getSubscriptionTiers);
router.get('/stats', adminSubscriptionsController.getSubscriptionStats);

// User subscription management
router.put('/users/:id/subscription', adminSubscriptionsController.changeUserSubscription);
router.post('/users/:id/subscription/cancel', adminSubscriptionsController.cancelUserSubscription);
router.post('/users/:id/subscription/reactivate', adminSubscriptionsController.reactivateUserSubscription);
router.get('/users/:id/subscription/history', adminSubscriptionsController.getUserSubscriptionHistory);

export default router;
