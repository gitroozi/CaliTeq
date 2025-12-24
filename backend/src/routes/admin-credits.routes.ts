import { Router } from 'express';
import { adminCreditsController } from '../controllers/admin-credits.controller';
import { authenticateAdmin } from '../middleware/admin-auth.middleware';

const router = Router();

// All routes require admin authentication
router.use(authenticateAdmin);

// Credit statistics
router.get('/stats', adminCreditsController.getCreditStats);

// User credit management
router.get('/users/:id/credits', adminCreditsController.getUserCredits);
router.post('/users/:id/credits/grant', adminCreditsController.grantCredits);
router.post('/users/:id/credits/revoke', adminCreditsController.revokeCredits);
router.get('/users/:id/credits/transactions', adminCreditsController.getUserCreditTransactions);

export default router;
