import type { Exercise } from '../types';
import Button from './ui/Button';

interface ExerciseCardProps {
  exercise: Exercise;
  onViewDetails: (exercise: Exercise) => void;
}

const difficultyLabels: Record<number, string> = {
  1: 'Novice',
  2: 'Beginner',
  3: 'Early Intermediate',
  4: 'Intermediate',
  5: 'Advanced Intermediate',
  6: 'Advanced',
  7: 'Elite',
  8: 'Master',
  9: 'Expert',
  10: 'World Class',
};

const getDifficultyColor = (difficulty: number): string => {
  if (difficulty <= 2) return 'bg-green-100 text-green-800';
  if (difficulty <= 4) return 'bg-blue-100 text-blue-800';
  if (difficulty <= 6) return 'bg-yellow-100 text-yellow-800';
  if (difficulty <= 8) return 'bg-orange-100 text-orange-800';
  return 'bg-red-100 text-red-800';
};

export default function ExerciseCard({ exercise, onViewDetails }: ExerciseCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 hover:border-primary-300 hover:shadow-sm transition-all">
      {/* Thumbnail */}
      {exercise.thumbnailUrl && (
        <div className="aspect-video rounded-lg bg-slate-100 mb-4 overflow-hidden">
          <img
            src={exercise.thumbnailUrl}
            alt={exercise.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Movement Pattern */}
      <p className="text-xs uppercase tracking-wide text-slate-500 font-medium">
        {exercise.movementPattern?.displayName || 'Exercise'}
      </p>

      {/* Exercise Name */}
      <h3 className="mt-2 text-lg font-semibold text-slate-900">
        {exercise.name}
      </h3>

      {/* Description Preview */}
      {exercise.description && (
        <p className="mt-2 text-sm text-slate-600 line-clamp-2">
          {exercise.description}
        </p>
      )}

      {/* Tags Row */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {/* Difficulty Badge */}
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getDifficultyColor(
            exercise.difficulty
          )}`}
        >
          Level {exercise.difficulty} - {difficultyLabels[exercise.difficulty] || 'Unknown'}
        </span>

        {/* Equipment Tags */}
        {exercise.equipmentRequired && exercise.equipmentRequired.length > 0 && (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
            {exercise.equipmentRequired.length === 1
              ? exercise.equipmentRequired[0]
              : `${exercise.equipmentRequired.length} items`}
          </span>
        )}

        {/* No Equipment Badge */}
        {(!exercise.equipmentRequired || exercise.equipmentRequired.length === 0) && (
          <span className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800">
            No equipment
          </span>
        )}
      </div>

      {/* Target Muscles (if available) */}
      {exercise.targetMuscles && exercise.targetMuscles.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-slate-500">
            Targets:{' '}
            <span className="text-slate-700">
              {exercise.targetMuscles.slice(0, 3).join(', ')}
              {exercise.targetMuscles.length > 3 && ` +${exercise.targetMuscles.length - 3} more`}
            </span>
          </p>
        </div>
      )}

      {/* Action Button */}
      <Button
        variant="outline"
        size="sm"
        fullWidth
        onClick={() => onViewDetails(exercise)}
        className="mt-4"
      >
        View details
      </Button>
    </div>
  );
}
