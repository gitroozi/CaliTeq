import { Router } from 'express';
import { adminAuthController } from '../controllers/admin-auth.controller';
import { authenticateAdmin, requireSuperAdmin } from '../middleware/admin-auth.middleware';

const router = Router();

// Public routes
router.post('/login', adminAuthController.login);
router.post('/refresh', adminAuthController.refreshToken);

// Protected routes
router.get('/me', authenticateAdmin, adminAuthController.getMe);
router.put('/password', authenticateAdmin, adminAuthController.changePassword);

// Super admin only routes
router.post('/create', authenticateAdmin, requireSuperAdmin, adminAuthController.createAdmin);
router.put('/:id/deactivate', authenticateAdmin, requireSuperAdmin, adminAuthController.deactivateAdmin);

export default router;
