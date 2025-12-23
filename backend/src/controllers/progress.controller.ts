import { Request, Response } from 'express';
import * as progressService from '../services/progress.service';

/**
 * Create a new progress metric
 * POST /api/progress/metrics
 */
export async function createMetric(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).userId;
    const { metric_type, data, recorded_at, notes } = req.body;

    // Validation
    if (!metric_type) {
      res.status(400).json({ error: 'metric_type is required' });
      return;
    }

    if (!data || typeof data !== 'object') {
      res.status(400).json({ error: 'data is required and must be an object' });
      return;
    }

    // Parse recorded_at if provided
    let recordedDate: Date | undefined;
    if (recorded_at) {
      recordedDate = new Date(recorded_at);
      if (isNaN(recordedDate.getTime())) {
        res.status(400).json({ error: 'Invalid recorded_at date format' });
        return;
      }
    }

    const metric = await progressService.createMetric(userId, {
      metric_type: metric_type as progressService.MetricType,
      data,
      recorded_at: recordedDate,
      notes,
    });

    res.status(201).json({
      message: 'Progress metric created successfully',
      metric,
    });
  } catch (error: any) {
    console.error('Error creating progress metric:', error);
    res.status(400).json({ error: error.message || 'Failed to create progress metric' });
  }
}

/**
 * Get progress metrics with filters
 * GET /api/progress/metrics
 */
export async function getMetrics(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).userId;
    const { metric_type, from_date, to_date, limit, offset } = req.query;

    // Parse filters
    const filters: progressService.MetricFilters = {};

    if (metric_type) {
      filters.metric_type = metric_type as progressService.MetricType;
    }

    if (from_date) {
      const fromDate = new Date(from_date as string);
      if (isNaN(fromDate.getTime())) {
        res.status(400).json({ error: 'Invalid from_date format' });
        return;
      }
      filters.from_date = fromDate;
    }

    if (to_date) {
      const toDate = new Date(to_date as string);
      if (isNaN(toDate.getTime())) {
        res.status(400).json({ error: 'Invalid to_date format' });
        return;
      }
      filters.to_date = toDate;
    }

    if (limit) {
      const limitNum = parseInt(limit as string, 10);
      if (isNaN(limitNum) || limitNum < 1 || limitNum > 200) {
        res.status(400).json({ error: 'Invalid limit. Must be between 1 and 200' });
        return;
      }
      filters.limit = limitNum;
    }

    if (offset) {
      const offsetNum = parseInt(offset as string, 10);
      if (isNaN(offsetNum) || offsetNum < 0) {
        res.status(400).json({ error: 'Invalid offset. Must be 0 or greater' });
        return;
      }
      filters.offset = offsetNum;
    }

    const result = await progressService.getMetrics(userId, filters);

    res.json({
      message: 'Progress metrics retrieved successfully',
      ...result,
    });
  } catch (error: any) {
    console.error('Error fetching progress metrics:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch progress metrics' });
  }
}

/**
 * Get a specific metric by ID
 * GET /api/progress/metrics/:id
 */
export async function getMetricById(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const metric = await progressService.getMetricById(userId, id);

    if (!metric) {
      res.status(404).json({ error: 'Metric not found' });
      return;
    }

    res.json({
      message: 'Metric retrieved successfully',
      metric,
    });
  } catch (error: any) {
    console.error('Error fetching metric:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch metric' });
  }
}

/**
 * Delete a progress metric
 * DELETE /api/progress/metrics/:id
 */
export async function deleteMetric(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    await progressService.deleteMetric(userId, id);

    res.json({
      message: 'Progress metric deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting metric:', error);
    if (error.message === 'Metric not found') {
      res.status(404).json({ error: 'Metric not found' });
      return;
    }
    res.status(500).json({ error: error.message || 'Failed to delete metric' });
  }
}

/**
 * Get statistics for a specific metric type
 * GET /api/progress/stats/:metricType
 */
export async function getMetricStats(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).userId;
    const { metricType } = req.params;
    const { days } = req.query;

    // Parse days parameter
    let daysNum = 30; // default
    if (days) {
      daysNum = parseInt(days as string, 10);
      if (isNaN(daysNum) || daysNum < 1 || daysNum > 365) {
        res.status(400).json({ error: 'Invalid days parameter. Must be between 1 and 365' });
        return;
      }
    }

    const stats = await progressService.getMetricStats(
      userId,
      metricType as progressService.MetricType,
      daysNum
    );

    if (!stats) {
      res.status(404).json({
        error: 'No data found for this metric type in the specified period',
      });
      return;
    }

    res.json({
      message: 'Metric statistics retrieved successfully',
      stats,
    });
  } catch (error: any) {
    console.error('Error fetching metric stats:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch metric statistics' });
  }
}

/**
 * Get all stats summary
 * GET /api/progress/stats
 */
export async function getAllStats(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).userId;
    const { days } = req.query;

    // Parse days parameter
    let daysNum = 30; // default
    if (days) {
      daysNum = parseInt(days as string, 10);
      if (isNaN(daysNum) || daysNum < 1 || daysNum > 365) {
        res.status(400).json({ error: 'Invalid days parameter. Must be between 1 and 365' });
        return;
      }
    }

    const stats = await progressService.getAllStats(userId, daysNum);

    res.json({
      message: 'All progress statistics retrieved successfully',
      stats,
      period_days: daysNum,
    });
  } catch (error: any) {
    console.error('Error fetching all stats:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch statistics' });
  }
}

/**
 * Get metric history with trend data
 * GET /api/progress/history/:metricType
 */
export async function getMetricHistory(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).userId;
    const { metricType } = req.params;
    const { days } = req.query;

    // Parse days parameter
    let daysNum = 90; // default
    if (days) {
      daysNum = parseInt(days as string, 10);
      if (isNaN(daysNum) || daysNum < 1 || daysNum > 365) {
        res.status(400).json({ error: 'Invalid days parameter. Must be between 1 and 365' });
        return;
      }
    }

    const history = await progressService.getMetricHistory(
      userId,
      metricType as progressService.MetricType,
      daysNum
    );

    res.json({
      message: 'Metric history retrieved successfully',
      ...history,
      period_days: daysNum,
    });
  } catch (error: any) {
    console.error('Error fetching metric history:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch metric history' });
  }
}
