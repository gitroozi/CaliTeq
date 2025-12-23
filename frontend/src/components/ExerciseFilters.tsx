import { useState, useEffect } from 'react';
import Button from './ui/Button';
import Modal from './ui/Modal';
import type { ExerciseFilters as Filters, MovementPattern } from '../types';
import { exerciseApi } from '../services/api';

interface ExerciseFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: Filters;
  onApplyFilters: (filters: Filters) => void;
}

export default function ExerciseFilters({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
}: ExerciseFiltersProps) {
  const [movementPatterns, setMovementPatterns] = useState<MovementPattern[]>([]);
  const [localFilters, setLocalFilters] = useState<Filters>(filters);

  useEffect(() => {
    loadMovementPatterns();
  }, []);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const loadMovementPatterns = async () => {
    try {
      const patterns = await exerciseApi.getMovementPatterns();
      setMovementPatterns(patterns);
    } catch (err) {
      console.error('Failed to load movement patterns');
    }
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: Filters = {};
    setLocalFilters(resetFilters);
    onApplyFilters(resetFilters);
    onClose();
  };

  const hasActiveFilters = Boolean(
    localFilters.pattern ||
    localFilters.difficulty ||
    localFilters.minDifficulty ||
    localFilters.maxDifficulty ||
    localFilters.equipment?.length ||
    localFilters.noEquipment
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Filter Exercises"
      size="md"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" onClick={handleReset} disabled={!hasActiveFilters}>
            Reset filters
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleApply}>Apply filters</Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Movement Pattern */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Movement Pattern
          </label>
          <select
            value={localFilters.pattern || ''}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, pattern: e.target.value || undefined })
            }
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All patterns</option>
            {movementPatterns.map((pattern) => (
              <option key={pattern.id} value={pattern.name}>
                {pattern.displayName}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Range */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Difficulty Level
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-600 mb-1">Min</label>
              <select
                value={localFilters.minDifficulty || ''}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    minDifficulty: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              >
                <option value="">Any</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                  <option key={level} value={level}>
                    Level {level}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">Max</label>
              <select
                value={localFilters.maxDifficulty || ''}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    maxDifficulty: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              >
                <option value="">Any</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                  <option key={level} value={level}>
                    Level {level}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Equipment */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Equipment
          </label>

          {/* No Equipment Toggle */}
          <label className="flex items-center gap-3 mb-3 cursor-pointer">
            <input
              type="checkbox"
              checked={localFilters.noEquipment || false}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  noEquipment: e.target.checked || undefined,
                  equipment: e.target.checked ? undefined : localFilters.equipment,
                })
              }
              className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-slate-700">No equipment needed</span>
          </label>

          {/* Specific Equipment (disabled if no equipment is checked) */}
          {!localFilters.noEquipment && (
            <div className="space-y-2 pl-6">
              {['Pull-up bar', 'Dip bars', 'Resistance bands', 'Elevated surface', 'Rings'].map(
                (equipment) => (
                  <label key={equipment} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.equipment?.includes(equipment) || false}
                      onChange={(e) => {
                        const currentEquipment = localFilters.equipment || [];
                        const newEquipment = e.target.checked
                          ? [...currentEquipment, equipment]
                          : currentEquipment.filter((eq) => eq !== equipment);
                        setLocalFilters({
                          ...localFilters,
                          equipment: newEquipment.length > 0 ? newEquipment : undefined,
                        });
                      }}
                      className="h-4 w-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-slate-700">{equipment}</span>
                  </label>
                )
              )}
            </div>
          )}
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="rounded-lg bg-primary-50 border border-primary-200 p-3">
            <p className="text-xs font-medium text-primary-900 mb-2">Active Filters:</p>
            <div className="flex flex-wrap gap-2">
              {localFilters.pattern && (
                <span className="inline-flex items-center rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-primary-800">
                  Pattern: {localFilters.pattern}
                </span>
              )}
              {localFilters.minDifficulty && (
                <span className="inline-flex items-center rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-primary-800">
                  Min Level: {localFilters.minDifficulty}
                </span>
              )}
              {localFilters.maxDifficulty && (
                <span className="inline-flex items-center rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-primary-800">
                  Max Level: {localFilters.maxDifficulty}
                </span>
              )}
              {localFilters.noEquipment && (
                <span className="inline-flex items-center rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-primary-800">
                  No equipment
                </span>
              )}
              {localFilters.equipment?.map((eq) => (
                <span
                  key={eq}
                  className="inline-flex items-center rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-primary-800"
                >
                  {eq}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
