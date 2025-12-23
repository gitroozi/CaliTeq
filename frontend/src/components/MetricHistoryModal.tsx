import { useEffect, useState } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import LoadingSpinner from './ui/LoadingSpinner';
import MetricChart from './MetricChart';
import type { MetricType, MetricHistory } from '../types';
import { progressApi } from '../services/api';
import { format } from 'date-fns';

interface MetricHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  metricType: MetricType;
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

export default function MetricHistoryModal({
  isOpen,
  onClose,
  metricType,
}: MetricHistoryModalProps) {
  const [history, setHistory] = useState<MetricHistory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [days, setDays] = useState(90);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen, metricType, days]);

  const loadHistory = async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await progressApi.getMetricHistory(metricType, days);
      setHistory(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load metric history');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${metricLabels[metricType]} History`}
      size="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Show:</span>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
              <option value={180}>Last 6 months</option>
              <option value={365}>Last year</option>
            </select>
          </div>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {!isLoading && !error && history && (
        <div className="space-y-6">
          {/* Chart */}
          {history.dataPoints.length > 0 ? (
            <MetricChart history={history} unit={metricUnits[metricType]} />
          ) : (
            <div className="text-center py-12">
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
              <h3 className="mt-4 text-lg font-semibold text-slate-900">No data yet</h3>
              <p className="mt-2 text-sm text-slate-600">
                Start tracking this metric to see your progress over time
              </p>
            </div>
          )}

          {/* Data Points Table */}
          {history.dataPoints.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">
                Recent Entries ({history.dataPoints.length})
              </h3>
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <div className="max-h-64 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-slate-700">Date</th>
                        <th className="px-4 py-2 text-left font-medium text-slate-700">Value</th>
                        <th className="px-4 py-2 text-left font-medium text-slate-700">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {history.dataPoints.map((point, index) => (
                        <tr key={index} className="hover:bg-slate-50">
                          <td className="px-4 py-2 text-slate-900">
                            {format(new Date(point.date), 'MMM d, yyyy')}
                          </td>
                          <td className="px-4 py-2 font-medium text-slate-900">
                            {point.value.toFixed(1)} {metricUnits[metricType]}
                          </td>
                          <td className="px-4 py-2 text-slate-600">
                            {point.notes || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
