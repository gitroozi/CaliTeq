import { Router } from 'express';
import * as progressController from '../controllers/progress.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All progress routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/progress/metrics
 * @desc    Create a new progress metric
 * @access  Private
 * @body    { metric_type, data, recorded_at?, notes? }
 */
router.post('/metrics', progressController.createMetric);

/**
 * @route   GET /api/progress/metrics
 * @desc    Get progress metrics with filters
 * @access  Private
 * @query   metric_type?, from_date?, to_date?, limit?, offset?
 */
router.get('/metrics', progressController.getMetrics);

/**
 * @route   GET /api/progress/metrics/:id
 * @desc    Get a specific metric by ID
 * @access  Private
 */
router.get('/metrics/:id', progressController.getMetricById);

/**
 * @route   DELETE /api/progress/metrics/:id
 * @desc    Delete a progress metric
 * @access  Private
 */
router.delete('/metrics/:id', progressController.deleteMetric);

/**
 * @route   GET /api/progress/stats
 * @desc    Get all stats summary
 * @access  Private
 * @query   days? (default: 30)
 */
router.get('/stats', progressController.getAllStats);

/**
 * @route   GET /api/progress/stats/:metricType
 * @desc    Get statistics for a specific metric type
 * @access  Private
 * @query   days? (default: 30)
 */
router.get('/stats/:metricType', progressController.getMetricStats);

/**
 * @route   GET /api/progress/history/:metricType
 * @desc    Get metric history with trend data
 * @access  Private
 * @query   days? (default: 90)
 */
router.get('/history/:metricType', progressController.getMetricHistory);

export default router;
