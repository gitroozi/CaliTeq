import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Metric type definitions
export type MetricType = 'weight' | 'waist' | 'chest' | 'arms' | 'thighs' | 'body_fat' | 'rep_max' | 'wellness';

// Data structures for different metric types
export interface WeightMetricData {
  weight_kg: number;
}

export interface BodyMeasurementData {
  measurement_cm: number;
  location?: string; // e.g., "left", "right", "around navel"
}

export interface BodyFatData {
  body_fat_percentage: number;
  measurement_method?: string; // e.g., "calipers", "bioimpedance", "dexa"
}

export interface RepMaxData {
  exercise_id: string;
  exercise_name: string;
  reps: number;
  weight_kg?: number;
  estimated_1rm?: number;
}

export interface WellnessData {
  sleep_hours?: number;
  stress_level?: number; // 1-10
  soreness_level?: number; // 1-10
  energy_level?: number; // 1-10
  mood?: number; // 1-10
}

export type MetricData = WeightMetricData | BodyMeasurementData | BodyFatData | RepMaxData | WellnessData;

export interface CreateMetricInput {
  metric_type: MetricType;
  data: MetricData;
  recorded_at?: Date;
  notes?: string;
}

export interface ProgressMetric {
  id: string;
  user_id: string;
  metric_type: string;
  data: any;
  recorded_at: Date;
  notes: string | null;
  created_at: Date;
}

export interface MetricFilters {
  metric_type?: MetricType;
  from_date?: Date;
  to_date?: Date;
  limit?: number;
  offset?: number;
}

export interface ProgressStats {
  metric_type: string;
  total_entries: number;
  first_recorded: Date | null;
  last_recorded: Date | null;
  latest_value: any;
  earliest_value: any;
  change: any;
  change_percentage?: number;
}

/**
 * Create a new progress metric entry
 */
export async function createMetric(userId: string, input: CreateMetricInput): Promise<ProgressMetric> {
  // Validate metric data based on type
  validateMetricData(input.metric_type, input.data);

  const metric = await prisma.progressMetric.create({
    data: {
      user_id: userId,
      metric_type: input.metric_type,
      data: input.data as any,
      recorded_at: input.recorded_at || new Date(),
      notes: input.notes,
    },
  });

  return metric as ProgressMetric;
}

/**
 * Get progress metrics with filters and pagination
 */
export async function getMetrics(userId: string, filters: MetricFilters = {}): Promise<{
  metrics: ProgressMetric[];
  total: number;
  limit: number;
  offset: number;
}> {
  const limit = Math.min(filters.limit || 100, 200);
  const offset = filters.offset || 0;

  // Build where clause
  const where: any = {
    user_id: userId,
  };

  if (filters.metric_type) {
    where.metric_type = filters.metric_type;
  }

  if (filters.from_date || filters.to_date) {
    where.recorded_at = {};
    if (filters.from_date) {
      where.recorded_at.gte = filters.from_date;
    }
    if (filters.to_date) {
      where.recorded_at.lte = filters.to_date;
    }
  }

  const [metrics, total] = await Promise.all([
    prisma.progressMetric.findMany({
      where,
      orderBy: { recorded_at: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.progressMetric.count({ where }),
  ]);

  return {
    metrics: metrics as ProgressMetric[],
    total,
    limit,
    offset,
  };
}

/**
 * Get a specific metric by ID
 */
export async function getMetricById(userId: string, metricId: string): Promise<ProgressMetric | null> {
  const metric = await prisma.progressMetric.findFirst({
    where: {
      id: metricId,
      user_id: userId,
    },
  });

  return metric as ProgressMetric | null;
}

/**
 * Delete a progress metric
 */
export async function deleteMetric(userId: string, metricId: string): Promise<void> {
  const metric = await prisma.progressMetric.findFirst({
    where: {
      id: metricId,
      user_id: userId,
    },
  });

  if (!metric) {
    throw new Error('Metric not found');
  }

  await prisma.progressMetric.delete({
    where: { id: metricId },
  });
}

/**
 * Get statistics for a specific metric type
 */
export async function getMetricStats(userId: string, metricType: MetricType, days: number = 30): Promise<ProgressStats | null> {
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);

  const metrics = await prisma.progressMetric.findMany({
    where: {
      user_id: userId,
      metric_type: metricType,
      recorded_at: {
        gte: fromDate,
      },
    },
    orderBy: { recorded_at: 'asc' },
  });

  if (metrics.length === 0) {
    return null;
  }

  const firstMetric = metrics[0];
  const lastMetric = metrics[metrics.length - 1];

  const stats: ProgressStats = {
    metric_type: metricType,
    total_entries: metrics.length,
    first_recorded: firstMetric.recorded_at,
    last_recorded: lastMetric.recorded_at,
    earliest_value: firstMetric.data,
    latest_value: lastMetric.data,
    change: null,
  };

  // Calculate change for numeric metrics
  if (metricType === 'weight') {
    const earliestWeight = (firstMetric.data as WeightMetricData).weight_kg;
    const latestWeight = (lastMetric.data as WeightMetricData).weight_kg;
    stats.change = latestWeight - earliestWeight;
    stats.change_percentage = ((stats.change / earliestWeight) * 100);
  } else if (metricType === 'body_fat') {
    const earliestBF = (firstMetric.data as BodyFatData).body_fat_percentage;
    const latestBF = (lastMetric.data as BodyFatData).body_fat_percentage;
    stats.change = latestBF - earliestBF;
    stats.change_percentage = ((stats.change / earliestBF) * 100);
  } else if (['waist', 'chest', 'arms', 'thighs'].includes(metricType)) {
    const earliestMeasurement = (firstMetric.data as BodyMeasurementData).measurement_cm;
    const latestMeasurement = (lastMetric.data as BodyMeasurementData).measurement_cm;
    stats.change = latestMeasurement - earliestMeasurement;
    stats.change_percentage = ((stats.change / earliestMeasurement) * 100);
  }

  return stats;
}

/**
 * Get all stats summary for the user
 */
export async function getAllStats(userId: string, days: number = 30): Promise<ProgressStats[]> {
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);

  // Get all unique metric types for this user
  const uniqueTypes = await prisma.progressMetric.findMany({
    where: {
      user_id: userId,
      recorded_at: {
        gte: fromDate,
      },
    },
    distinct: ['metric_type'],
    select: {
      metric_type: true,
    },
  });

  const statsPromises = uniqueTypes.map(({ metric_type }) =>
    getMetricStats(userId, metric_type as MetricType, days)
  );

  const allStats = await Promise.all(statsPromises);

  return allStats.filter((stat): stat is ProgressStats => stat !== null);
}

/**
 * Get metric history with trend data
 */
export async function getMetricHistory(userId: string, metricType: MetricType, days: number = 90): Promise<{
  metric_type: string;
  data_points: Array<{
    date: Date;
    value: number;
    notes?: string;
  }>;
  trend: 'increasing' | 'decreasing' | 'stable' | 'insufficient_data';
  average: number | null;
}> {
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);

  const metrics = await prisma.progressMetric.findMany({
    where: {
      user_id: userId,
      metric_type: metricType,
      recorded_at: {
        gte: fromDate,
      },
    },
    orderBy: { recorded_at: 'asc' },
  });

  if (metrics.length === 0) {
    return {
      metric_type: metricType,
      data_points: [],
      trend: 'insufficient_data',
      average: null,
    };
  }

  // Extract numeric values based on metric type
  const dataPoints = metrics.map((metric) => {
    let value = 0;
    const data = metric.data as any;

    if (metricType === 'weight') {
      value = data.weight_kg;
    } else if (metricType === 'body_fat') {
      value = data.body_fat_percentage;
    } else if (['waist', 'chest', 'arms', 'thighs'].includes(metricType)) {
      value = data.measurement_cm;
    }

    return {
      date: metric.recorded_at,
      value,
      notes: metric.notes || undefined,
    };
  });

  // Calculate average
  const sum = dataPoints.reduce((acc, dp) => acc + dp.value, 0);
  const average = sum / dataPoints.length;

  // Determine trend (simple linear regression or first vs last comparison)
  let trend: 'increasing' | 'decreasing' | 'stable' | 'insufficient_data' = 'insufficient_data';

  if (dataPoints.length >= 3) {
    const firstThird = dataPoints.slice(0, Math.floor(dataPoints.length / 3));
    const lastThird = dataPoints.slice(-Math.floor(dataPoints.length / 3));

    const firstAvg = firstThird.reduce((acc, dp) => acc + dp.value, 0) / firstThird.length;
    const lastAvg = lastThird.reduce((acc, dp) => acc + dp.value, 0) / lastThird.length;

    const change = lastAvg - firstAvg;
    const changePercent = Math.abs((change / firstAvg) * 100);

    if (changePercent < 2) {
      trend = 'stable';
    } else if (change > 0) {
      trend = 'increasing';
    } else {
      trend = 'decreasing';
    }
  }

  return {
    metric_type: metricType,
    data_points: dataPoints,
    trend,
    average,
  };
}

/**
 * Validate metric data based on type
 */
function validateMetricData(metricType: MetricType, data: any): void {
  switch (metricType) {
    case 'weight':
      if (typeof data.weight_kg !== 'number' || data.weight_kg < 20 || data.weight_kg > 500) {
        throw new Error('Invalid weight value. Must be between 20 and 500 kg.');
      }
      break;

    case 'waist':
    case 'chest':
    case 'arms':
    case 'thighs':
      if (typeof data.measurement_cm !== 'number' || data.measurement_cm < 10 || data.measurement_cm > 300) {
        throw new Error('Invalid measurement value. Must be between 10 and 300 cm.');
      }
      break;

    case 'body_fat':
      if (typeof data.body_fat_percentage !== 'number' || data.body_fat_percentage < 3 || data.body_fat_percentage > 60) {
        throw new Error('Invalid body fat percentage. Must be between 3 and 60%.');
      }
      break;

    case 'rep_max':
      if (!data.exercise_id || typeof data.reps !== 'number' || data.reps < 1) {
        throw new Error('Invalid rep max data. Must include exercise_id and positive reps.');
      }
      break;

    case 'wellness':
      // Validate wellness fields if present
      if (data.sleep_hours !== undefined && (data.sleep_hours < 0 || data.sleep_hours > 24)) {
        throw new Error('Invalid sleep hours. Must be between 0 and 24.');
      }
      if (data.stress_level !== undefined && (data.stress_level < 1 || data.stress_level > 10)) {
        throw new Error('Invalid stress level. Must be between 1 and 10.');
      }
      if (data.soreness_level !== undefined && (data.soreness_level < 1 || data.soreness_level > 10)) {
        throw new Error('Invalid soreness level. Must be between 1 and 10.');
      }
      if (data.energy_level !== undefined && (data.energy_level < 1 || data.energy_level > 10)) {
        throw new Error('Invalid energy level. Must be between 1 and 10.');
      }
      if (data.mood !== undefined && (data.mood < 1 || data.mood > 10)) {
        throw new Error('Invalid mood level. Must be between 1 and 10.');
      }
      break;

    default:
      throw new Error(`Unsupported metric type: ${metricType}`);
  }
}
