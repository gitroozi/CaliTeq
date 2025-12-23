import { useEffect, useState } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import LoadingSpinner from './ui/LoadingSpinner';
import type { Exercise } from '../types';
import { exerciseApi } from '../services/api';

interface ExerciseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseId: string;
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

export default function ExerciseDetailModal({
  isOpen,
  onClose,
  exerciseId,
}: ExerciseDetailModalProps) {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [progressionChain, setProgressionChain] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && exerciseId) {
      loadExercise();
      loadProgressionChain();
    }
  }, [isOpen, exerciseId]);

  const loadExercise = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await exerciseApi.getExercise(exerciseId);
      setExercise(data);
    } catch (err: any) {
      setError('Failed to load exercise details');
    } finally {
      setIsLoading(false);
    }
  };

  const loadProgressionChain = async () => {
    try {
      const chain = await exerciseApi.getProgressionChain(exerciseId);
      setProgressionChain(chain);
    } catch (err) {
      // Silently fail for progression chain
    }
  };

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </Modal>
    );
  }

  if (error || !exercise) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Error">
        <div className="text-center py-8">
          <p className="text-slate-600">{error || 'Exercise not found'}</p>
          <Button onClick={onClose} className="mt-4">
            Close
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={exercise.name}
      footer={
        <div className="flex items-center justify-end">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Video/Thumbnail */}
        {exercise.videoUrl ? (
          <div className="aspect-video rounded-lg overflow-hidden bg-slate-100">
            <video
              src={exercise.videoUrl}
              controls
              className="w-full h-full"
              poster={exercise.thumbnailUrl || undefined}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        ) : exercise.thumbnailUrl ? (
          <div className="aspect-video rounded-lg overflow-hidden bg-slate-100">
            <img
              src={exercise.thumbnailUrl}
              alt={exercise.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : null}

        {/* Multiple Video URLs */}
        {exercise.videoUrls && exercise.videoUrls.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {exercise.videoUrls.map((url, idx) => (
              <div key={idx} className="aspect-video rounded-lg overflow-hidden bg-slate-100">
                <video src={url} controls className="w-full h-full">
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
          </div>
        )}

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-800">
            {exercise.movementPattern?.displayName || 'Exercise'}
          </span>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
            Level {exercise.difficulty} - {difficultyLabels[exercise.difficulty]}
          </span>
          {(!exercise.equipmentRequired || exercise.equipmentRequired.length === 0) && (
            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
              No equipment needed
            </span>
          )}
        </div>

        {/* Description */}
        {exercise.description && (
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Description</h3>
            <p className="text-sm text-slate-700 leading-relaxed">{exercise.description}</p>
          </div>
        )}

        {/* Setup Instructions */}
        {exercise.setupInstructions && (
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Setup</h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {exercise.setupInstructions}
            </p>
          </div>
        )}

        {/* Execution Instructions */}
        {exercise.executionInstructions && (
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">How to Perform</h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {exercise.executionInstructions}
            </p>
          </div>
        )}

        {/* Coaching Cues */}
        {exercise.coachingCues && exercise.coachingCues.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Coaching Cues</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
              {exercise.coachingCues.map((cue, idx) => (
                <li key={idx}>{cue}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Common Mistakes */}
        {exercise.commonMistakes && exercise.commonMistakes.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Common Mistakes</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
              {exercise.commonMistakes.map((mistake, idx) => (
                <li key={idx}>{mistake}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Target Muscles */}
        {exercise.targetMuscles && exercise.targetMuscles.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Target Muscles</h3>
            <div className="flex flex-wrap gap-2">
              {exercise.targetMuscles.map((muscle, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Equipment Required */}
        {exercise.equipmentRequired && exercise.equipmentRequired.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Equipment Needed</h3>
            <div className="flex flex-wrap gap-2">
              {exercise.equipmentRequired.map((equipment, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                >
                  {equipment}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Contraindications */}
        {exercise.contraindications && exercise.contraindications.length > 0 && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4">
            <h3 className="text-sm font-semibold text-red-900 mb-2">⚠️ Contraindications</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-red-800">
              {exercise.contraindications.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Progression Chain */}
        {progressionChain.length > 1 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Progression Path</h3>
            <div className="space-y-2">
              {progressionChain.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 rounded-lg border p-3 ${
                    item.id === exercise.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                    {item.difficulty}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{item.name}</p>
                    {item.id === exercise.id && (
                      <p className="text-xs text-primary-600">← Current exercise</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
