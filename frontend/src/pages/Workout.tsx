import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import AppShell from '../components/AppShell';
import ExerciseSetLogger from '../components/ExerciseSetLogger';
import WorkoutSummaryForm from '../components/WorkoutSummaryForm';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import { useWorkoutStore } from '../store/workoutStore';
import { workoutLogApi } from '../services/api';
import type { WorkoutSessionExercise, SetLog, CreateWorkoutLogData } from '../types';
import { format } from 'date-fns';

interface ExerciseLogState {
  exerciseId: string;
  sets: Omit<SetLog, 'setNumber'>[];
}

export default function Workout() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { currentSession, todayWorkout, fetchSession, fetchTodayWorkout, isLoading, error } = useWorkoutStore();

  const [workoutStartTime] = useState(new Date());
  const [exerciseLogs, setExerciseLogs] = useState<Record<string, ExerciseLogState>>({});
  const [showSummaryForm, setShowSummaryForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const isTodayRoute = location.pathname === '/workout/today' || id === 'today';

  // Determine which workout session to use
  const workoutSession = isTodayRoute ? todayWorkout : currentSession;

  useEffect(() => {
    const loadWorkout = async () => {
      if (isTodayRoute) {
        await fetchTodayWorkout();
      } else if (id) {
        await fetchSession(id);
      }
    };

    loadWorkout();
  }, [id, isTodayRoute, fetchSession, fetchTodayWorkout]);

  // Initialize exercise logs when workout session loads
  useEffect(() => {
    if (workoutSession?.exercises) {
      const initialLogs: Record<string, ExerciseLogState> = {};
      workoutSession.exercises.forEach((exercise) => {
        if (exercise.exercise?.id) {
          initialLogs[exercise.exercise.id] = {
            exerciseId: exercise.exercise.id,
            sets: [],
          };
        }
      });
      setExerciseLogs(initialLogs);
    }
  }, [workoutSession]);

  const handleExerciseSetsLogged = (exerciseId: string, sets: Omit<SetLog, 'setNumber'>[]) => {
    setExerciseLogs((prev) => ({
      ...prev,
      [exerciseId]: {
        exerciseId,
        sets,
      },
    }));
  };

  const handleFinishWorkout = () => {
    // Check if at least one exercise has been logged
    const hasLoggedExercises = Object.values(exerciseLogs).some(
      (log) => log.sets.length > 0 && log.sets.some((set) => set.reps > 0)
    );

    if (!hasLoggedExercises) {
      setSubmitError('Please log at least one set before completing the workout.');
      return;
    }

    setShowSummaryForm(true);
  };

  const handleSubmitWorkout = async (summary: {
    difficultyRating: number;
    energyLevel: number;
    enjoymentRating: number;
    painReports: any[];
    notes: string;
  }) => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Prepare workout log data
      const exercises = Object.values(exerciseLogs)
        .filter((log) => log.sets.length > 0)
        .map((log) => ({
          exerciseId: log.exerciseId,
          sets: log.sets.map((set, idx) => ({
            setNumber: idx + 1,
            reps: set.reps,
            rpe: set.rpe,
            restSeconds: set.restSeconds,
            notes: set.notes,
          })) as SetLog[],
        }));

      const workoutLogData: CreateWorkoutLogData = {
        workoutSessionId: workoutSession?.id,
        startedAt: workoutStartTime.toISOString(),
        completedAt: new Date().toISOString(),
        overallDifficulty: summary.difficultyRating,
        energyLevel: summary.energyLevel,
        enjoyment: summary.enjoymentRating,
        notes: summary.notes,
        painReports: summary.painReports.length > 0 ? summary.painReports : undefined,
        exercises,
      };

      // Submit to API
      await workoutLogApi.createLog(workoutLogData);

      // Navigate back to dashboard with success message
      navigate('/dashboard', { state: { workoutCompleted: true } });
    } catch (err: any) {
      setSubmitError(err.response?.data?.error || 'Failed to save workout. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleCancelSummary = () => {
    setShowSummaryForm(false);
    setSubmitError('');
  };

  // Calculate progress
  const totalExercises = workoutSession?.exercises?.length || 0;
  const loggedExercises = Object.values(exerciseLogs).filter(
    (log) => log.sets.length > 0 && log.sets.some((set) => set.reps > 0)
  ).length;

  if (isLoading && !workoutSession) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </AppShell>
    );
  }

  if (error || !workoutSession) {
    return (
      <AppShell>
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <Alert variant="error">
            {error || 'Workout session not found'}
          </Alert>
          <Button onClick={() => navigate('/dashboard')} className="mt-6">
            Back to Dashboard
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-semibold text-slate-900">
                {workoutSession.sessionType || 'Workout Session'}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <span>Week {workoutSession.weekNumber}, Session {workoutSession.sessionNumber}</span>
                <span>•</span>
                <span>{format(new Date(workoutSession.scheduledDate), 'EEEE, MMM d')}</span>
                {totalExercises > 0 && (
                  <>
                    <span>•</span>
                    <span>{totalExercises} exercises</span>
                  </>
                )}
              </div>
            </div>

            {/* Progress Badge */}
            {totalExercises > 0 && (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-800">
                  {loggedExercises}/{totalExercises} exercises logged
                </span>
              </div>
            )}
          </div>

          {workoutSession.notes && (
            <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 p-4">
              <p className="text-sm font-medium text-blue-900 mb-1">Session Notes:</p>
              <p className="text-sm text-blue-800">{workoutSession.notes}</p>
            </div>
          )}
        </div>

        {submitError && (
          <div className="mb-6">
            <Alert variant="error">{submitError}</Alert>
          </div>
        )}

        {/* Exercise List or Summary Form */}
        {!showSummaryForm ? (
          <>
            {/* Exercises */}
            <div className="space-y-6">
              {workoutSession.exercises && workoutSession.exercises.length > 0 ? (
                workoutSession.exercises.map((exercise: WorkoutSessionExercise) => {
                  if (!exercise.exercise?.id) return null;

                  return (
                    <ExerciseSetLogger
                      key={exercise.id}
                      exercise={exercise}
                      onSetsLogged={(sets) =>
                        handleExerciseSetsLogged(exercise.exercise!.id, sets)
                      }
                      initialSets={exerciseLogs[exercise.exercise.id]?.sets}
                    />
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-600">No exercises in this workout session.</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {totalExercises > 0 && (
              <div className="mt-8 flex items-center justify-between gap-4 pt-6 border-t border-slate-200">
                <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                  Cancel workout
                </Button>
                <Button onClick={handleFinishWorkout}>
                  Complete workout
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <WorkoutSummaryForm
              onSubmit={handleSubmitWorkout}
              onCancel={handleCancelSummary}
              isSubmitting={isSubmitting}
            />
          </div>
        )}
      </div>
    </AppShell>
  );
}
