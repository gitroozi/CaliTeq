import { useState } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import type { MetricType, CreateMetricData, MetricData } from '../types';

interface AddMetricModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMetricData) => Promise<void>;
}

const metricTypes: { value: MetricType; label: string }[] = [
  { value: 'weight', label: 'Weight' },
  { value: 'waist', label: 'Waist Measurement' },
  { value: 'chest', label: 'Chest Measurement' },
  { value: 'arms', label: 'Arms Measurement' },
  { value: 'thighs', label: 'Thighs Measurement' },
  { value: 'body_fat', label: 'Body Fat %' },
  { value: 'wellness', label: 'Wellness Check-in' },
];

export default function AddMetricModal({ isOpen, onClose, onSubmit }: AddMetricModalProps) {
  const [metricType, setMetricType] = useState<MetricType>('weight');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Weight
  const [weight, setWeight] = useState('');

  // Body measurements
  const [measurement, setMeasurement] = useState('');

  // Body fat
  const [bodyFat, setBodyFat] = useState('');
  const [measurementMethod, setMeasurementMethod] = useState('');

  // Wellness
  const [sleepHours, setSleepHours] = useState('');
  const [stressLevel, setStressLevel] = useState('5');
  const [sorenessLevel, setSorenessLevel] = useState('5');
  const [energyLevel, setEnergyLevel] = useState('5');
  const [mood, setMood] = useState('5');

  // Common
  const [notes, setNotes] = useState('');
  const [recordedAt, setRecordedAt] = useState(new Date().toISOString().split('T')[0]);

  const resetForm = () => {
    setWeight('');
    setMeasurement('');
    setBodyFat('');
    setMeasurementMethod('');
    setSleepHours('');
    setStressLevel('5');
    setSorenessLevel('5');
    setEnergyLevel('5');
    setMood('5');
    setNotes('');
    setRecordedAt(new Date().toISOString().split('T')[0]);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let metricData: MetricData;

    try {
      switch (metricType) {
        case 'weight':
          if (!weight) throw new Error('Please enter weight');
          metricData = { weight_kg: parseFloat(weight) };
          break;

        case 'waist':
        case 'chest':
        case 'arms':
        case 'thighs':
          if (!measurement) throw new Error('Please enter measurement');
          metricData = {
            measurement_cm: parseFloat(measurement),
            location: metricType,
          };
          break;

        case 'body_fat':
          if (!bodyFat) throw new Error('Please enter body fat percentage');
          metricData = {
            body_fat_percentage: parseFloat(bodyFat),
            measurement_method: measurementMethod || undefined,
          };
          break;

        case 'wellness':
          metricData = {
            sleep_hours: sleepHours ? parseFloat(sleepHours) : undefined,
            stress_level: parseInt(stressLevel),
            soreness_level: parseInt(sorenessLevel),
            energy_level: parseInt(energyLevel),
            mood: parseInt(mood),
          };
          break;

        default:
          throw new Error('Invalid metric type');
      }

      const data: CreateMetricData = {
        metricType,
        data: metricData,
        recordedAt: new Date(recordedAt).toISOString(),
        notes: notes || undefined,
      };

      setIsSubmitting(true);
      await onSubmit(data);
      resetForm();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add metric');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Progress Metric"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Metric Type Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Metric Type <span className="text-red-500">*</span>
          </label>
          <select
            value={metricType}
            onChange={(e) => setMetricType(e.target.value as MetricType)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {metricTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Weight Form */}
        {metricType === 'weight' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Weight (kg) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g., 75.5"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
        )}

        {/* Body Measurements Form */}
        {['waist', 'chest', 'arms', 'thighs'].includes(metricType) && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Measurement (cm) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.1"
              value={measurement}
              onChange={(e) => setMeasurement(e.target.value)}
              placeholder="e.g., 85.0"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
        )}

        {/* Body Fat Form */}
        {metricType === 'body_fat' && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Body Fat Percentage <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                placeholder="e.g., 18.5"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Measurement Method
              </label>
              <select
                value={measurementMethod}
                onChange={(e) => setMeasurementMethod(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select method (optional)</option>
                <option value="caliper">Caliper</option>
                <option value="bioelectrical">Bioelectrical Impedance</option>
                <option value="dexa">DEXA Scan</option>
                <option value="visual">Visual Estimate</option>
              </select>
            </div>
          </>
        )}

        {/* Wellness Form */}
        {metricType === 'wellness' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Sleep Hours
              </label>
              <input
                type="number"
                step="0.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
                placeholder="e.g., 7.5"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">Stress Level</label>
                <span className="text-sm font-semibold text-slate-900">{stressLevel}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={stressLevel}
                onChange={(e) => setStressLevel(e.target.value)}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Low stress</span>
                <span>High stress</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">Muscle Soreness</label>
                <span className="text-sm font-semibold text-slate-900">{sorenessLevel}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={sorenessLevel}
                onChange={(e) => setSorenessLevel(e.target.value)}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>No soreness</span>
                <span>Very sore</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">Energy Level</label>
                <span className="text-sm font-semibold text-slate-900">{energyLevel}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(e.target.value)}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Exhausted</span>
                <span>Energized</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">Mood</label>
                <span className="text-sm font-semibold text-slate-900">{mood}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Low mood</span>
                <span>Great mood</span>
              </div>
            </div>
          </div>
        )}

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Date Recorded <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={recordedAt}
            onChange={(e) => setRecordedAt(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Notes (optional)
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any observations or context..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Add Metric
          </Button>
        </div>
      </form>
    </Modal>
  );
}
