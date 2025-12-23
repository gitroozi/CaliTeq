import { useState } from 'react';
import Button from './ui/Button';

interface PainReport {
  bodyPart: string;
  severity: number;
  description: string;
}

interface WorkoutSummary {
  difficultyRating: number;
  energyLevel: number;
  enjoymentRating: number;
  painReports: PainReport[];
  notes: string;
}

interface WorkoutSummaryFormProps {
  onSubmit: (summary: WorkoutSummary) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const bodyParts = [
  'Shoulders',
  'Upper back',
  'Lower back',
  'Chest',
  'Arms',
  'Wrists',
  'Hips',
  'Knees',
  'Ankles',
  'Other',
];

export default function WorkoutSummaryForm({
  onSubmit,
  onCancel,
  isSubmitting,
}: WorkoutSummaryFormProps) {
  const [difficultyRating, setDifficultyRating] = useState(5);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [enjoymentRating, setEnjoymentRating] = useState(7);
  const [painReports, setPainReports] = useState<PainReport[]>([]);
  const [notes, setNotes] = useState('');
  const [showPainForm, setShowPainForm] = useState(false);

  const [newPain, setNewPain] = useState<PainReport>({
    bodyPart: 'Shoulders',
    severity: 3,
    description: '',
  });

  const handleAddPain = () => {
    if (newPain.bodyPart && newPain.severity > 0) {
      setPainReports([...painReports, newPain]);
      setNewPain({
        bodyPart: 'Shoulders',
        severity: 3,
        description: '',
      });
      setShowPainForm(false);
    }
  };

  const handleRemovePain = (index: number) => {
    setPainReports(painReports.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      difficultyRating,
      energyLevel,
      enjoymentRating,
      painReports,
      notes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          How was your workout?
        </h2>
        <p className="text-sm text-slate-600">
          Please rate your overall workout experience and add any notes.
        </p>
      </div>

      {/* Rating Sliders */}
      <div className="space-y-5">
        {/* Difficulty */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-slate-700">
              Difficulty <span className="text-red-500">*</span>
            </label>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
              {difficultyRating}/10
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={difficultyRating}
            onChange={(e) => setDifficultyRating(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>Too easy</span>
            <span>Perfect</span>
            <span>Too hard</span>
          </div>
        </div>

        {/* Energy Level */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-slate-700">
              Energy Level <span className="text-red-500">*</span>
            </label>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
              {energyLevel}/10
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={energyLevel}
            onChange={(e) => setEnergyLevel(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>Exhausted</span>
            <span>Normal</span>
            <span>Energized</span>
          </div>
        </div>

        {/* Enjoyment */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-slate-700">
              Enjoyment <span className="text-red-500">*</span>
            </label>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
              {enjoymentRating}/10
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={enjoymentRating}
            onChange={(e) => setEnjoymentRating(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>Hated it</span>
            <span>Okay</span>
            <span>Loved it</span>
          </div>
        </div>
      </div>

      {/* Pain Reports */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-slate-700">
            Pain or Discomfort (optional)
          </label>
          {!showPainForm && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowPainForm(true)}
            >
              + Report pain
            </Button>
          )}
        </div>

        {/* Existing Pain Reports */}
        {painReports.length > 0 && (
          <div className="space-y-2 mb-3">
            {painReports.map((pain, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900">
                      {pain.bodyPart}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        pain.severity >= 7
                          ? 'bg-red-100 text-red-700'
                          : pain.severity >= 4
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {pain.severity}/10
                    </span>
                  </div>
                  {pain.description && (
                    <p className="text-sm text-slate-600 mt-1">{pain.description}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemovePain(idx)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pain Entry Form */}
        {showPainForm && (
          <div className="rounded-lg border border-slate-300 bg-slate-50 p-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Body part
                </label>
                <select
                  value={newPain.bodyPart}
                  onChange={(e) =>
                    setNewPain({ ...newPain, bodyPart: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                >
                  {bodyParts.map((part) => (
                    <option key={part} value={part}>
                      {part}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Severity (1-10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newPain.severity}
                  onChange={(e) =>
                    setNewPain({ ...newPain, severity: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Description (optional)
              </label>
              <textarea
                rows={2}
                placeholder="Describe the pain or what might have caused it..."
                value={newPain.description}
                onChange={(e) =>
                  setNewPain({ ...newPain, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm resize-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddPain}
              >
                Add pain report
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPainForm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* General Notes */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Additional Notes (optional)
        </label>
        <textarea
          rows={4}
          placeholder="How did you feel? Any observations? What went well or could be improved?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Complete Workout
        </Button>
      </div>
    </form>
  );
}
