import { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import MetricCard from '../components/MetricCard';
import AddMetricModal from '../components/AddMetricModal';
import MetricHistoryModal from '../components/MetricHistoryModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import type { ProgressStats, MetricType, CreateMetricData, WorkoutStats } from '../types';
import { progressApi, workoutLogApi } from '../services/api';

export default function Progress() {
  const [allStats, setAllStats] = useState<ProgressStats[]>([]);
  const [workoutStats, setWorkoutStats] = useState<WorkoutStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isLoadingWorkoutStats, setIsLoadingWorkoutStats] = useState(false);
  const [error, setError] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedMetricType, setSelectedMetricType] = useState<MetricType>('weight');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([loadProgressStats(), loadWorkoutStats()]);
  };

  const loadProgressStats = async () => {
    setIsLoadingStats(true);
    setError('');

    try {
      const stats = await progressApi.getAllStats(90); // Last 90 days
      setAllStats(stats);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load progress stats');
    } finally {
      setIsLoadingStats(false);
    }
  };

  const loadWorkoutStats = async () => {
    setIsLoadingWorkoutStats(true);

    try {
      const stats = await workoutLogApi.getStats(90); // Last 90 days
      setWorkoutStats(stats);
    } catch (err: any) {
      // Silently fail for workout stats
      console.error('Failed to load workout stats:', err);
    } finally {
      setIsLoadingWorkoutStats(false);
    }
  };

  const handleAddMetric = async (data: CreateMetricData) => {
    await progressApi.createMetric(data);
    await loadProgressStats();
  };

  const handleViewHistory = (metricType: MetricType) => {
    setSelectedMetricType(metricType);
    setIsHistoryModalOpen(true);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Progress Tracking</h1>
            <p className="mt-2 text-sm text-slate-600">
              Track body metrics, workout consistency, and overall progress
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Log Metric
          </Button>
        </div>

        {error && (
          <div className="mb-6">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        {/* Workout Stats Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Workout Summary</h2>

          {isLoadingWorkoutStats ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : workoutStats ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-500 uppercase tracking-wide">Total Workouts</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {workoutStats.totalWorkouts}
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-500 uppercase tracking-wide">Total Exercises</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {workoutStats.totalExercises}
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-500 uppercase tracking-wide">Total Time</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {Math.round(workoutStats.totalMinutes / 60)}
                  <span className="text-lg text-slate-500 ml-1">hrs</span>
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-500 uppercase tracking-wide">Avg Difficulty</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {workoutStats.avgDifficulty.toFixed(1)}
                  <span className="text-lg text-slate-500 ml-1">/10</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 rounded-lg border border-slate-200 bg-slate-50">
              <p className="text-sm text-slate-600">No workout data available yet</p>
            </div>
          )}
        </div>

        {/* Body Metrics Section */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Body Metrics</h2>

          {isLoadingStats ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : allStats.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {allStats.map((stats) => (
                <MetricCard
                  key={stats.metricType}
                  stats={stats}
                  onViewHistory={handleViewHistory}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-lg border-2 border-dashed border-slate-300">
              <svg
                className="mx-auto h-16 w-16 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">No metrics tracked yet</h3>
              <p className="mt-2 text-sm text-slate-600">
                Start tracking body metrics like weight, measurements, and body fat to monitor your progress
              </p>
              <Button onClick={() => setIsAddModalOpen(true)} className="mt-6">
                Log Your First Metric
              </Button>
            </div>
          )}
        </div>

        {/* Training Tips */}
        <div className="mt-12 rounded-lg border border-blue-200 bg-blue-50 p-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-3">📊 Progress Tracking Tips</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                Weigh yourself at the same time each day (ideally in the morning) for consistent
                measurements
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                Track body measurements weekly rather than daily to see meaningful changes
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                Monitor wellness metrics to identify patterns between recovery and performance
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                Focus on trends over time rather than day-to-day fluctuations
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Modals */}
      <AddMetricModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddMetric}
      />

      <MetricHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        metricType={selectedMetricType}
      />
    </AppShell>
  );
}
