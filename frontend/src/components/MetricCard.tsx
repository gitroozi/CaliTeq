import type { ProgressStats, MetricType } from '../types';
import { format } from 'date-fns';

interface MetricCardProps {
  stats: ProgressStats;
  onViewHistory: (metricType: MetricType) => void;
}

const metricLabels: Record<MetricType, string> = {
  weight: 'Weight',
  waist: 'Waist',
  chest: 'Chest',
  arms: 'Arms',
  thighs: 'Thighs',
  body_fat: 'Body Fat',
  rep_max: 'Rep Max',
  wellness: 'Wellness',
};

const metricUnits: Record<MetricType, string> = {
  weight: 'kg',
  waist: 'cm',
  chest: 'cm',
  arms: 'cm',
  thighs: 'cm',
  body_fat: '%',
  rep_max: 'reps',
  wellness: '/10',
};

const getValueFromData = (data: any, metricType: MetricType): number => {
  switch (metricType) {
    case 'weight':
      return data.weight_kg;
    case 'waist':
    case 'chest':
    case 'arms':
    case 'thighs':
      return data.measurement_cm;
    case 'body_fat':
      return data.body_fat_percentage;
    case 'rep_max':
      return data.reps;
    case 'wellness':
      // Average of wellness metrics
      const metrics = [
        data.sleep_hours,
        data.stress_level,
        data.soreness_level,
        data.energy_level,
        data.mood,
      ].filter((v) => v !== undefined && v !== null);
      return metrics.length > 0
        ? metrics.reduce((a, b) => a + b, 0) / metrics.length
        : 0;
    default:
      return 0;
  }
};

export default function MetricCard({ stats, onViewHistory }: MetricCardProps) {
  const latestValue = getValueFromData(stats.latestValue, stats.metricType);
  const hasChange = stats.change !== null && stats.change !== undefined;
  const isPositive = hasChange && stats.change! > 0;
  const isNegative = hasChange && stats.change! < 0;

  // For certain metrics, positive change might be "bad" (e.g., weight loss goals, body fat)
  // This is a simple heuristic - ideally would come from user goals
  const isImprovement =
    stats.metricType === 'body_fat' || stats.metricType === 'waist'
      ? isNegative
      : isPositive;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">
            {metricLabels[stats.metricType]}
          </h3>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {latestValue.toFixed(1)}
            <span className="text-lg text-slate-500 ml-1">
              {metricUnits[stats.metricType]}
            </span>
          </p>
        </div>

        {/* Change Badge */}
        {hasChange && (
          <div
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
              isImprovement
                ? 'bg-green-100 text-green-800'
                : isNegative
                ? 'bg-red-100 text-red-800'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {isPositive && '+'}
            {stats.change!.toFixed(1)} {metricUnits[stats.metricType]}
            {stats.changePercentage !== undefined && (
              <span className="ml-1">({stats.changePercentage > 0 && '+'}{stats.changePercentage.toFixed(1)}%)</span>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-center justify-between text-slate-600">
          <span>Entries</span>
          <span className="font-medium text-slate-900">{stats.totalEntries}</span>
        </div>

        {stats.lastRecorded && (
          <div className="flex items-center justify-between text-slate-600">
            <span>Last recorded</span>
            <span className="font-medium text-slate-900">
              {format(new Date(stats.lastRecorded), 'MMM d, yyyy')}
            </span>
          </div>
        )}

        {stats.firstRecorded && stats.lastRecorded && (
          <div className="flex items-center justify-between text-slate-600">
            <span>Tracking since</span>
            <span className="font-medium text-slate-900">
              {format(new Date(stats.firstRecorded), 'MMM d, yyyy')}
            </span>
          </div>
        )}
      </div>

      {/* Action */}
      <button
        onClick={() => onViewHistory(stats.metricType)}
        className="mt-4 w-full px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
      >
        View history
      </button>
    </div>
  );
}
