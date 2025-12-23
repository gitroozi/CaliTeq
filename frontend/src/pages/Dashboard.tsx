import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Alert from '../components/ui/Alert';
import { useWorkoutStore } from '../store/workoutStore';
import { useUserStore } from '../store/userStore';
import { format, differenceInWeeks, isSameDay } from 'date-fns';

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    activePlan,
    todayWorkout,
    weekSessions,
    fetchActivePlan,
    fetchTodayWorkout,
    fetchWeekSessions,
    generatePlan,
    isLoading,
    error,
  } = useWorkoutStore();
  const { user, profile, fetchUser, fetchProfile } = useUserStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const [selectedWeek, setSelectedWeek] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchUser(),
          fetchProfile(),
          fetchActivePlan(),
          fetchTodayWorkout(),
        ]);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!activePlan) return;
    const weekToLoad = selectedWeek || 1;
    fetchWeekSessions(weekToLoad).catch((err) => {
      console.error('Failed to load week sessions:', err);
    });
  }, [activePlan, selectedWeek, fetchWeekSessions]);

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setGenerationError('');

    try {
      await generatePlan();
      // Refresh data
      await Promise.all([
        fetchActivePlan(),
        fetchTodayWorkout(),
      ]);
    } catch (err: any) {
      setGenerationError(err.message || 'Failed to generate workout plan');
    } finally {
      setIsGenerating(false);
    }
  };

  // Calculate current week if plan exists
  const getCurrentWeek = () => {
    if (!activePlan) return null;
    const planStart = new Date(activePlan.startDate);
    const today = new Date();
    const weekNumber = differenceInWeeks(today, planStart) + 1;
    return Math.max(1, Math.min(weekNumber, activePlan.weeksCount));
  };

  const currentWeek = getCurrentWeek();

  useEffect(() => {
    if (!activePlan || !currentWeek) return;
    setSelectedWeek(currentWeek);
  }, [activePlan, currentWeek]);
  const weekOptions = activePlan ? Array.from({ length: activePlan.weeksCount }, (_, idx) => idx + 1) : [];

  // Check if today's workout is actually today
  const isTodayWorkout = todayWorkout && isSameDay(new Date(todayWorkout.scheduledDate), new Date());

  if (isLoading && !activePlan) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </AppShell>
    );
  }

  // No active plan - show onboarding/generation UI
  if (!activePlan) {
    return (
      <AppShell>
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900">Welcome to CaliFlow!</h1>
            <p className="mt-4 text-lg text-slate-600">
              You don't have an active workout plan yet.
            </p>

            {generationError && (
              <div className="mt-6 max-w-md mx-auto">
                <Alert variant="error">{generationError}</Alert>
              </div>
            )}

            {!profile ? (
              <div className="mt-8 max-w-md mx-auto">
                <Card variant="bordered">
                  <CardBody className="text-center py-8">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Complete Your Profile First
                    </h3>
                    <p className="text-sm text-slate-600 mb-6">
                      We need some information about you to generate a personalized workout plan.
                    </p>
                    <Button onClick={() => navigate('/onboarding/step1')}>
                      Complete Onboarding
                    </Button>
                  </CardBody>
                </Card>
              </div>
            ) : (
              <div className="mt-8 max-w-md mx-auto">
                <Card variant="elevated">
                  <CardBody className="py-8">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Ready to start training?
                    </h3>
                    <p className="text-sm text-slate-600 mb-6">
                      Generate your personalized 12-week calisthenics program based on your profile
                      and goals.
                    </p>
                    <Button
                      onClick={handleGeneratePlan}
                      isLoading={isGenerating}
                      fullWidth
                    >
                      Generate My Workout Plan
                    </Button>
                  </CardBody>
                </Card>
              </div>
            )}
          </div>
        </div>
      </AppShell>
    );
  }

  // Has active plan - show dashboard
  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">
              Welcome back{user?.firstName ? `, ${user.firstName}` : ''}!
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {activePlan.name} - Week {currentWeek} of {activePlan.weeksCount}
            </p>
          </div>
          {isTodayWorkout && (
            <Button onClick={() => navigate('/workout/today')}>
              Start today's workout
            </Button>
          )}
        </div>

        {error && (
          <div className="mt-6">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Plan Snapshot */}
            <Card variant="bordered">
              <CardHeader>
                <h2 className="text-lg font-semibold text-slate-900">Plan Snapshot</h2>
              </CardHeader>
              <CardBody>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Current Week
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">
                      Week {currentWeek}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Training Days
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">
                      {activePlan.sessionsPerWeek} / week
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Plan Duration
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">
                      {activePlan.weeksCount} weeks
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">
                    Plan Period
                  </p>
                  <p className="text-sm text-slate-700">
                    {format(new Date(activePlan.startDate), 'MMM d, yyyy')} -{' '}
                    {format(new Date(activePlan.endDate), 'MMM d, yyyy')}
                  </p>
                </div>
              </CardBody>
            </Card>

            {/* Today's Workout */}
            {isTodayWorkout ? (
              <Card variant="elevated">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">Today's Workout</h2>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {todayWorkout.status === 'completed' ? 'Completed' : 'Scheduled'}
                    </span>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-slate-900">{todayWorkout.sessionType}</h3>
                      <p className="text-sm text-slate-600 mt-1">
                        Week {todayWorkout.weekNumber}, Session {todayWorkout.sessionNumber}
                      </p>
                    </div>

                    {todayWorkout.exercises && todayWorkout.exercises.length > 0 && (
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">
                          Exercises ({todayWorkout.exercises.length})
                        </p>
                        <div className="space-y-2">
                          {todayWorkout.exercises.slice(0, 3).map((ex, idx) => (
                            <div key={ex.id} className="flex items-center text-sm">
                              <span className="text-slate-400 mr-2">{idx + 1}.</span>
                              <span className="text-slate-700">
                                {ex.exercise?.name || 'Exercise'}
                              </span>
                              <span className="text-slate-500 ml-2">
                                {ex.targetSets}×{ex.targetReps}
                              </span>
                            </div>
                          ))}
                          {todayWorkout.exercises.length > 3 && (
                            <p className="text-xs text-slate-500">
                              +{todayWorkout.exercises.length - 3} more exercises
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {todayWorkout.status !== 'completed' && (
                      <Button
                        onClick={() => navigate('/workout/today')}
                        fullWidth
                        className="mt-4"
                      >
                        Start Workout
                      </Button>
                    )}
                  </div>
                </CardBody>
              </Card>
            ) : (
              <Card variant="bordered">
                <CardBody className="text-center py-8">
                  <p className="text-slate-600">No workout scheduled for today.</p>
                  <p className="text-sm text-slate-500 mt-2">
                    Enjoy your rest day or check out the exercise library!
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/exercises')}
                    className="mt-4"
                  >
                    Browse Exercises
                  </Button>
                </CardBody>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card variant="bordered">
              <CardHeader>
                <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-2">
                  <NavLink
                    to="/exercises"
                    className="block px-4 py-3 rounded-lg border border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                  >
                    <p className="font-medium text-slate-900">Browse Exercises</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Explore the full exercise library
                    </p>
                  </NavLink>
                  <NavLink
                    to="/progress"
                    className="block px-4 py-3 rounded-lg border border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                  >
                    <p className="font-medium text-slate-900">Track Progress</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Log body metrics and view stats
                    </p>
                  </NavLink>
                  <NavLink
                    to="/profile"
                    className="block px-4 py-3 rounded-lg border border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                  >
                    <p className="font-medium text-slate-900">Update Profile</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Adjust goals and preferences
                    </p>
                  </NavLink>
                </div>
              </CardBody>
            </Card>

            {/* Upcoming Sessions */}
            {activePlan && (
              <Card variant="bordered">
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-slate-900">Upcoming Sessions</h2>
                    <select
                      value={selectedWeek}
                      onChange={(e) => setSelectedWeek(Number(e.target.value))}
                      className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {weekOptions.map((week) => (
                        <option key={week} value={week}>
                          Week {week}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardHeader>
                <CardBody>
                  {weekSessions.length > 0 ? (
                    <div className="space-y-3">
                      {weekSessions.map((session) => (
                        <NavLink
                          key={session.id}
                          to={`/workout/${session.id}`}
                          className="block rounded-lg border border-slate-200 p-3 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-slate-900">
                                {session.sessionType || 'Workout Session'}
                              </p>
                              <p className="text-xs text-slate-600 mt-1">
                                {format(new Date(session.scheduledDate), 'EEE, MMM d')} • Session {session.sessionNumber}
                              </p>
                            </div>
                            <span className="text-xs font-medium text-primary-700">View</span>
                          </div>
                        </NavLink>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-600">
                      No sessions scheduled for this week yet.
                    </div>
                  )}
                </CardBody>
              </Card>
            )}

            {/* Tips */}
            <Card variant="bordered">
              <CardHeader>
                <h2 className="text-lg font-semibold text-slate-900">Training Tips</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-start gap-2">
                    <span className="text-primary-600 mt-0.5">•</span>
                    <p>Log your workouts to track progress and unlock new progressions</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary-600 mt-0.5">•</span>
                    <p>Focus on form quality over rep count - control is key</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary-600 mt-0.5">•</span>
                    <p>Rest days are crucial for recovery and adaptation</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary-600 mt-0.5">•</span>
                    <p>Deload weeks help prevent burnout and reduce injury risk</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
