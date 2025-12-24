import { Router } from 'express';
import { adminUsersController } from '../controllers/admin-users.controller';
import { authenticateAdmin } from '../middleware/admin-auth.middleware';

const router = Router();

// All routes require admin authentication
router.use(authenticateAdmin);

// Stats and search (before :id routes to avoid conflicts)
router.get('/stats', adminUsersController.getUserStats);
router.get('/search', adminUsersController.searchUsers);

// User management routes
router.get('/', adminUsersController.getUsers);
router.get('/:id', adminUsersController.getUserDetails);
router.put('/:id/status', adminUsersController.updateUserStatus);
router.put('/:id/email', adminUsersController.updateUserEmail);

export default router;
