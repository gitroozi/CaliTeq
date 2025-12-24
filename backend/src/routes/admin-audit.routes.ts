import { Router } from 'express';
import { adminAuditController } from '../controllers/admin-audit.controller';
import { authenticateAdmin } from '../middleware/admin-auth.middleware';

const router = Router();

// All routes require admin authentication
router.use(authenticateAdmin);

// Audit logs
router.get('/logs', adminAuditController.getAuditLogs);
router.get('/logs/user/:userId', adminAuditController.getUserAuditLogs);
router.get('/logs/impersonation', adminAuditController.getImpersonationLogs);
router.get('/stats', adminAuditController.getAuditStats);

export default router;
