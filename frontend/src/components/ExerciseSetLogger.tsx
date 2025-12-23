import { useState } from 'react';
import Button from './ui/Button';
import type { WorkoutSessionExercise, SetLog } from '../types';

interface SetWithNumber extends SetLog {
  setNumber: number;
}

interface ExerciseSetLoggerProps {
  exercise: WorkoutSessionExercise;
  onSetsLogged: (sets: Omit<SetLog, 'setNumber'>[]) => void;
  initialSets?: Omit<SetLog, 'setNumber'>[];
}

export default function ExerciseSetLogger({
  exercise,
  onSetsLogged,
  initialSets = []
}: ExerciseSetLoggerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sets, setSets] = useState<SetWithNumber[]>(() => {
    if (initialSets.length > 0) {
      return initialSets.map((set, idx) => ({
        ...set,
        setNumber: idx + 1,
      }));
    }
    // Initialize with target number of sets
    // Parse targetReps to get a number (e.g., "8-10" -> 8)
    const defaultReps = parseInt(exercise.targetReps.split('-')[0]) || 8;
    return Array.from({ length: exercise.targetSets }, (_, i) => ({
      setNumber: i + 1,
      reps: defaultReps,
      rpe: 7,
      restSeconds: exercise.restSeconds || 90,
      notes: '',
    }));
  });

  const handleSetChange = (setIndex: number, field: keyof SetWithNumber, value: string | number) => {
    const newSets = [...sets];
    newSets[setIndex] = {
      ...newSets[setIndex],
      [field]: field === 'notes' ? value : Number(value),
    };
    setSets(newSets);

    // Notify parent of changes
    const setsWithoutSetNumber = newSets.map(({ setNumber, ...rest }) => rest);
    onSetsLogged(setsWithoutSetNumber);
  };

  const addSet = () => {
    const defaultReps = parseInt(exercise.targetReps.split('-')[0]) || 8;
    const newSet: SetWithNumber = {
      setNumber: sets.length + 1,
      reps: defaultReps,
      rpe: 7,
      restSeconds: exercise.restSeconds || 90,
      notes: '',
    };
    const newSets = [...sets, newSet];
    setSets(newSets);

    const setsWithoutSetNumber = newSets.map(({ setNumber, ...rest }) => rest);
    onSetsLogged(setsWithoutSetNumber);
  };

  const removeSet = (setIndex: number) => {
    if (sets.length <= 1) return; // Keep at least one set

    const newSets = sets
      .filter((_, idx) => idx !== setIndex)
      .map((set, idx) => ({ ...set, setNumber: idx + 1 }));
    setSets(newSets);

    const setsWithoutSetNumber = newSets.map(({ setNumber, ...rest }) => rest);
    onSetsLogged(setsWithoutSetNumber);
  };

  const isSetComplete = (set: SetWithNumber) => set.reps > 0 && (set.rpe ?? 0) > 0;
  const completedSets = sets.filter(isSetComplete).length;
  const allSetsComplete = completedSets === sets.length;

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="p-4">
        {/* Exercise Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {exercise.exercise?.movementPattern?.displayName || 'Exercise'}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">
              {exercise.exercise?.name || 'Unknown Exercise'}
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Target: {exercise.targetSets} × {exercise.targetReps} reps
              {exercise.targetRpe && ` @ RPE ${exercise.targetRpe}`}
            </p>
          </div>

          {/* Progress Badge */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                allSetsComplete
                  ? 'bg-green-100 text-green-800'
                  : completedSets > 0
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {completedSets}/{sets.length} sets
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </div>

        {/* Collapsed View - Quick Summary */}
        {!isExpanded && sets.length > 0 && (
          <div className="mt-3 grid gap-2 rounded-lg bg-slate-50 p-3">
            {sets.slice(0, 3).map((set, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Set {set.setNumber}</span>
                <div className="flex items-center gap-3">
                  {isSetComplete(set) ? (
                    <>
                      <span className="text-slate-900 font-medium">{set.reps} reps</span>
                      <span className="text-slate-600">RPE {set.rpe}</span>
                    </>
                  ) : (
                    <span className="text-slate-400 italic">Not logged</span>
                  )}
                </div>
              </div>
            ))}
            {sets.length > 3 && (
              <p className="text-xs text-slate-500 text-center">
                +{sets.length - 3} more sets
              </p>
            )}
          </div>
        )}
      </div>

      {/* Expanded View - Detailed Set Logging */}
      {isExpanded && (
        <div className="border-t border-slate-200 p-4">
          <div className="space-y-4">
            {sets.map((set, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-slate-900">Set {set.setNumber}</h4>
                  {sets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSet(idx)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Reps */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Reps <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={set.reps}
                      onChange={(e) => handleSetChange(idx, 'reps', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    />
                  </div>

                  {/* RPE */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      RPE (1-10) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      step="0.5"
                      value={set.rpe}
                      onChange={(e) => handleSetChange(idx, 'rpe', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Rest Time */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Rest (seconds)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="15"
                      value={set.restSeconds}
                      onChange={(e) => handleSetChange(idx, 'restSeconds', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Quick Notes */}
                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Notes
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., felt strong"
                      value={set.notes}
                      onChange={(e) => handleSetChange(idx, 'notes', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Set Button */}
          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSet}
              fullWidth
            >
              + Add another set
            </Button>
          </div>

          {/* Exercise Notes */}
          {exercise.notes && (
            <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 p-3">
              <p className="text-xs font-medium text-blue-900 mb-1">Exercise Notes:</p>
              <p className="text-sm text-blue-800">{exercise.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
