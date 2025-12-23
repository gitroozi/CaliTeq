import { Router } from 'express';
import {
  getProfile,
  createProfile,
  updateProfile,
  checkProfileComplete,
  deleteProfile,
} from '../controllers/profile.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All profile routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/users/profile
 * @desc    Get current user's profile
 * @access  Private
 */
router.get('/profile', getProfile);

/**
 * @route   POST /api/users/profile
 * @desc    Create user profile (also works as upsert)
 * @access  Private
 */
router.post('/profile', createProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', updateProfile);

/**
 * @route   GET /api/users/profile/complete
 * @desc    Check if user profile is complete
 * @access  Private
 */
router.get('/profile/complete', checkProfileComplete);

/**
 * @route   DELETE /api/users/profile
 * @desc    Delete user profile
 * @access  Private
 */
router.delete('/profile', deleteProfile);

export default router;
