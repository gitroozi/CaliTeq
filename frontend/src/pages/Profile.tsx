import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import Card, { CardHeader, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Alert from '../components/ui/Alert';
import { useUserStore } from '../store/userStore';
import { useAuthStore } from '../store/authStore';
import { format } from 'date-fns';
import type { Equipment, AssessmentScores, Gender, TrainingExperience, ActivityLevel } from '../types';

export default function Profile() {
  const navigate = useNavigate();
  const { user, profile, fetchUser, fetchProfile, updateProfile, isLoading } = useUserStore();
  const { logout } = useAuthStore();

  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingTraining, setIsEditingTraining] = useState(false);
  const [isEditingAvailability, setIsEditingAvailability] = useState(false);
  const [isEditingEquipment, setIsEditingEquipment] = useState(false);
  const [isEditingAssessment, setIsEditingAssessment] = useState(false);
  const [isEditingMedical, setIsEditingMedical] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [currentWeightKg, setCurrentWeightKg] = useState('');
  const [targetWeightKg, setTargetWeightKg] = useState('');

  const [trainingExperience, setTrainingExperience] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [goals, setGoals] = useState<string[]>([]);

  const [daysPerWeek, setDaysPerWeek] = useState('');
  const [minutesPerSession, setMinutesPerSession] = useState('');

  const [equipment, setEquipment] = useState<Equipment>({
    pullUpBar: false,
    dipBars: false,
    resistanceBands: false,
    elevatedSurface: false,
    other: [],
  });

  const [assessmentScores, setAssessmentScores] = useState<AssessmentScores>({
    pushLevel: 5,
    pullLevel: 5,
    squatLevel: 5,
    hingeLevel: 5,
    coreLevel: 5,
  });

  const [injuries, setInjuries] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('');
  const [exerciseClearance, setExerciseClearance] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setDateOfBirth(user.dateOfBirth || '');
      setGender(user.gender || '');
      setHeightCm(user.heightCm?.toString() || '');
      setCurrentWeightKg(user.currentWeightKg?.toString() || '');
      setTargetWeightKg(user.targetWeightKg?.toString() || '');
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      setTrainingExperience(profile.trainingExperience || '');
      setActivityLevel(profile.activityLevel || '');
      setGoals(profile.goals || []);
      setDaysPerWeek(profile.daysPerWeek?.toString() || '');
      setMinutesPerSession(profile.minutesPerSession?.toString() || '');
      setEquipment(profile.equipment);
      setAssessmentScores(profile.assessmentScores);
      setInjuries(profile.injuries?.join(', ') || '');
      setMedicalConditions(profile.medicalConditions?.join(', ') || '');
      setExerciseClearance(profile.exerciseClearance);
    }
  }, [profile]);

  const loadData = async () => {
    try {
      await Promise.all([fetchUser(), fetchProfile()]);
    } catch (err) {
      console.error('Failed to load profile data:', err);
    }
  };

  const handleSavePersonal = async () => {
    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      await updateProfile({
        dateOfBirth: dateOfBirth || undefined,
        gender: gender ? (gender as Gender) : undefined,
        heightCm: heightCm ? parseFloat(heightCm) : undefined,
        currentWeightKg: currentWeightKg ? parseFloat(currentWeightKg) : undefined,
        targetWeightKg: targetWeightKg ? parseFloat(targetWeightKg) : undefined,
      });
      setSuccessMessage('Personal information updated successfully');
      setIsEditingPersonal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update personal information');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveTraining = async () => {
    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      await updateProfile({
        trainingExperience: trainingExperience ? (trainingExperience as TrainingExperience) : undefined,
        activityLevel: activityLevel ? (activityLevel as ActivityLevel) : undefined,
        goals,
      });
      setSuccessMessage('Training profile updated successfully');
      setIsEditingTraining(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update training profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAvailability = async () => {
    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      await updateProfile({
        daysPerWeek: daysPerWeek ? parseInt(daysPerWeek) : undefined,
        minutesPerSession: minutesPerSession ? parseInt(minutesPerSession) : undefined,
      });
      setSuccessMessage('Availability updated successfully');
      setIsEditingAvailability(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update availability');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEquipment = async () => {
    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      await updateProfile({ equipment });
      setSuccessMessage('Equipment updated successfully');
      setIsEditingEquipment(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update equipment');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAssessment = async () => {
    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      await updateProfile({ assessmentScores });
      setSuccessMessage('Assessment scores updated successfully');
      setIsEditingAssessment(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update assessment scores');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveMedical = async () => {
    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      await updateProfile({
        injuries: injuries ? injuries.split(',').map((s) => s.trim()).filter(Boolean) : [],
        medicalConditions: medicalConditions
          ? medicalConditions.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        exerciseClearance,
      });
      setSuccessMessage('Medical information updated successfully');
      setIsEditingMedical(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update medical information');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const availableGoals = [
    { value: 'build_strength', label: 'Build Strength' },
    { value: 'lose_body_fat', label: 'Lose Body Fat' },
    { value: 'gain_muscle', label: 'Gain Muscle' },
    { value: 'improve_endurance', label: 'Improve Endurance' },
    { value: 'increase_flexibility', label: 'Increase Flexibility' },
    { value: 'learn_skills', label: 'Learn New Skills' },
    { value: 'maintain_fitness', label: 'Maintain Fitness' },
    { value: 'injury_rehab', label: 'Injury Rehabilitation' },
  ];

  if (isLoading && !user) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </AppShell>
    );
  }

  if (!profile) {
    return (
      <AppShell>
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <Alert variant="error">Profile not found</Alert>
          <Button onClick={() => navigate('/onboarding/step1')} className="mt-6">
            Complete Onboarding
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Profile Settings</h1>
            <p className="mt-2 text-sm text-slate-600">
              Manage your personal information and training preferences
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {error && (
          <div className="mb-6">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        {successMessage && (
          <div className="mb-6">
            <Alert variant="success">{successMessage}</Alert>
          </div>
        )}

        <div className="space-y-6">
          {/* Account Information */}
          <Card variant="bordered">
            <CardHeader>
              <h2 className="text-lg font-semibold text-slate-900">Account Information</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Email</span>
                  <span className="font-medium text-slate-900">{user?.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Member since</span>
                  <span className="font-medium text-slate-900">
                    {user && format(new Date(user.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Subscription</span>
                  <span className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-800">
                    {user?.subscriptionTier || 'Free'}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Personal Information */}
          <Card variant="bordered">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Personal Information</h2>
                {!isEditingPersonal && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingPersonal(true)}
                  >
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardBody>
              {isEditingPersonal ? (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        disabled
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Contact support to change your name
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        disabled
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Gender
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Prefer not to say</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={heightCm}
                        onChange={(e) => setHeightCm(e.target.value)}
                        placeholder="175"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Current Weight (kg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={currentWeightKg}
                        onChange={(e) => setCurrentWeightKg(e.target.value)}
                        placeholder="75"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Target Weight (kg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={targetWeightKg}
                        onChange={(e) => setTargetWeightKg(e.target.value)}
                        placeholder="70"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                    <Button
                      variant="ghost"
                      onClick={() => setIsEditingPersonal(false)}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSavePersonal} isLoading={isSaving}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Name</span>
                    <span className="font-medium text-slate-900">
                      {firstName} {lastName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Date of Birth</span>
                    <span className="font-medium text-slate-900">
                      {dateOfBirth ? format(new Date(dateOfBirth), 'MMM d, yyyy') : 'Not set'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Gender</span>
                    <span className="font-medium text-slate-900 capitalize">
                      {gender || 'Not set'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Height</span>
                    <span className="font-medium text-slate-900">
                      {heightCm ? `${heightCm} cm` : 'Not set'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Current Weight</span>
                    <span className="font-medium text-slate-900">
                      {currentWeightKg ? `${currentWeightKg} kg` : 'Not set'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Target Weight</span>
                    <span className="font-medium text-slate-900">
                      {targetWeightKg ? `${targetWeightKg} kg` : 'Not set'}
                    </span>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Training Profile */}
          <Card variant="bordered">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Training Profile</h2>
                {!isEditingTraining && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingTraining(true)}
                  >
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardBody>
              {isEditingTraining ? (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Training Experience
                      </label>
                      <select
                        value={trainingExperience}
                        onChange={(e) => setTrainingExperience(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select experience</option>
                        <option value="never">Never Trained</option>
                        <option value="beginner">Beginner (0-6 months)</option>
                        <option value="intermediate">Intermediate (6-24 months)</option>
                        <option value="advanced">Advanced (2+ years)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Activity Level
                      </label>
                      <select
                        value={activityLevel}
                        onChange={(e) => setActivityLevel(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select level</option>
                        <option value="sedentary">Sedentary</option>
                        <option value="lightly_active">Lightly Active</option>
                        <option value="moderately_active">Moderately Active</option>
                        <option value="very_active">Very Active</option>
                        <option value="extremely_active">Extremely Active</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Training Goals
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {availableGoals.map((goal) => (
                        <label
                          key={goal.value}
                          className={`flex items-center gap-3 rounded-lg border-2 p-3 cursor-pointer transition-colors ${
                            goals.includes(goal.value)
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-slate-200'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={goals.includes(goal.value)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setGoals([...goals, goal.value]);
                              } else {
                                setGoals(goals.filter((g) => g !== goal.value));
                              }
                            }}
                            className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                          />
                          <span className="text-sm text-slate-700 font-medium">
                            {goal.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                    <Button
                      variant="ghost"
                      onClick={() => setIsEditingTraining(false)}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveTraining} isLoading={isSaving}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Experience</span>
                    <span className="font-medium text-slate-900 capitalize">
                      {trainingExperience?.replace(/_/g, ' ') || 'Not set'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Activity Level</span>
                    <span className="font-medium text-slate-900 capitalize">
                      {activityLevel?.replace(/_/g, ' ') || 'Not set'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600 block mb-2">Goals</span>
                    <div className="flex flex-wrap gap-2">
                      {goals.length > 0 ? (
                        goals.map((goal) => (
                          <span
                            key={goal}
                            className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-800"
                          >
                            {availableGoals.find((g) => g.value === goal)?.label || goal}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500 italic">No goals set</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Availability */}
          <Card variant="bordered">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Training Availability</h2>
                {!isEditingAvailability && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingAvailability(true)}
                  >
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardBody>
              {isEditingAvailability ? (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Days per Week
                      </label>
                      <select
                        value={daysPerWeek}
                        onChange={(e) => setDaysPerWeek(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select days</option>
                        <option value="2">2 days</option>
                        <option value="3">3 days</option>
                        <option value="4">4 days</option>
                        <option value="5">5 days</option>
                        <option value="6">6 days</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Minutes per Session
                      </label>
                      <select
                        value={minutesPerSession}
                        onChange={(e) => setMinutesPerSession(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select duration</option>
                        <option value="30">30 minutes</option>
                        <option value="45">45 minutes</option>
                        <option value="60">60 minutes</option>
                        <option value="75">75 minutes</option>
                        <option value="90">90 minutes</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                    <Button
                      variant="ghost"
                      onClick={() => setIsEditingAvailability(false)}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveAvailability} isLoading={isSaving}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Days per Week</span>
                    <span className="font-medium text-slate-900">
                      {daysPerWeek ? `${daysPerWeek} days` : 'Not set'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Minutes per Session</span>
                    <span className="font-medium text-slate-900">
                      {minutesPerSession ? `${minutesPerSession} min` : 'Not set'}
                    </span>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Equipment */}
          <Card variant="bordered">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Available Equipment</h2>
                {!isEditingEquipment && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingEquipment(true)}
                  >
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardBody>
              {isEditingEquipment ? (
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label
                      className={`flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                        equipment.pullUpBar
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-slate-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={equipment.pullUpBar}
                        onChange={(e) =>
                          setEquipment({ ...equipment, pullUpBar: e.target.checked })
                        }
                        className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-slate-700 font-medium">Pull-up bar</span>
                    </label>

                    <label
                      className={`flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                        equipment.dipBars
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-slate-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={equipment.dipBars}
                        onChange={(e) =>
                          setEquipment({ ...equipment, dipBars: e.target.checked })
                        }
                        className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-slate-700 font-medium">
                        Dip bars or parallel bars
                      </span>
                    </label>

                    <label
                      className={`flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                        equipment.resistanceBands
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-slate-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={equipment.resistanceBands}
                        onChange={(e) =>
                          setEquipment({ ...equipment, resistanceBands: e.target.checked })
                        }
                        className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-slate-700 font-medium">
                        Resistance bands
                      </span>
                    </label>

                    <label
                      className={`flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                        equipment.elevatedSurface
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-slate-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={equipment.elevatedSurface}
                        onChange={(e) =>
                          setEquipment({ ...equipment, elevatedSurface: e.target.checked })
                        }
                        className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-slate-700 font-medium">
                        Elevated surface (box, bench, chair)
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                    <Button
                      variant="ghost"
                      onClick={() => setIsEditingEquipment(false)}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveEquipment} isLoading={isSaving}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {equipment.pullUpBar && (
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      Pull-up bar
                    </span>
                  )}
                  {equipment.dipBars && (
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      Dip bars
                    </span>
                  )}
                  {equipment.resistanceBands && (
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      Resistance bands
                    </span>
                  )}
                  {equipment.elevatedSurface && (
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      Elevated surface
                    </span>
                  )}
                  {!equipment.pullUpBar &&
                    !equipment.dipBars &&
                    !equipment.resistanceBands &&
                    !equipment.elevatedSurface && (
                      <span className="text-sm text-slate-500 italic">
                        No equipment (bodyweight only)
                      </span>
                    )}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Assessment Scores */}
          <Card variant="bordered">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Movement Assessment</h2>
                {!isEditingAssessment && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingAssessment(true)}
                  >
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardBody>
              {isEditingAssessment ? (
                <div className="space-y-4">
                  {[
                    { key: 'pushLevel' as keyof AssessmentScores, label: 'Horizontal Push' },
                    { key: 'pullLevel' as keyof AssessmentScores, label: 'Vertical Pull' },
                    { key: 'squatLevel' as keyof AssessmentScores, label: 'Squat' },
                    { key: 'hingeLevel' as keyof AssessmentScores, label: 'Hinge' },
                    { key: 'coreLevel' as keyof AssessmentScores, label: 'Core Stability' },
                  ].map((pattern) => (
                    <div key={pattern.key}>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-slate-700">
                          {pattern.label}
                        </label>
                        <span className="text-sm font-semibold text-slate-900">
                          {assessmentScores[pattern.key]}/10
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={assessmentScores[pattern.key]}
                        onChange={(e) =>
                          setAssessmentScores({
                            ...assessmentScores,
                            [pattern.key]: parseInt(e.target.value),
                          })
                        }
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                      />
                      <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>Novice</span>
                        <span>Intermediate</span>
                        <span>Advanced</span>
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                    <Button
                      variant="ghost"
                      onClick={() => setIsEditingAssessment(false)}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveAssessment} isLoading={isSaving}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Horizontal Push</span>
                    <span className="font-medium text-slate-900">
                      Level {assessmentScores.pushLevel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Vertical Pull</span>
                    <span className="font-medium text-slate-900">
                      Level {assessmentScores.pullLevel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Squat</span>
                    <span className="font-medium text-slate-900">
                      Level {assessmentScores.squatLevel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Hinge</span>
                    <span className="font-medium text-slate-900">
                      Level {assessmentScores.hingeLevel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Core Stability</span>
                    <span className="font-medium text-slate-900">
                      Level {assessmentScores.coreLevel}
                    </span>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Medical Information */}
          <Card variant="bordered">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Medical Information</h2>
                {!isEditingMedical && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingMedical(true)}
                  >
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardBody>
              {isEditingMedical ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Current Injuries (comma-separated)
                    </label>
                    <textarea
                      rows={2}
                      value={injuries}
                      onChange={(e) => setInjuries(e.target.value)}
                      placeholder="e.g., Left shoulder impingement, Right knee pain"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Medical Conditions (comma-separated)
                    </label>
                    <textarea
                      rows={2}
                      value={medicalConditions}
                      onChange={(e) => setMedicalConditions(e.target.value)}
                      placeholder="e.g., Asthma, High blood pressure"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exerciseClearance}
                      onChange={(e) => setExerciseClearance(e.target.checked)}
                      className="mt-0.5 h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-slate-700">
                      I have been cleared by a medical professional to engage in physical exercise
                    </span>
                  </label>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                    <Button
                      variant="ghost"
                      onClick={() => setIsEditingMedical(false)}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveMedical} isLoading={isSaving}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-slate-600 block mb-1">Injuries</span>
                    <span className="text-slate-900">
                      {injuries || <span className="italic text-slate-500">None reported</span>}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600 block mb-1">Medical Conditions</span>
                    <span className="text-slate-900">
                      {medicalConditions || (
                        <span className="italic text-slate-500">None reported</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {exerciseClearance ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                        ✓ Exercise clearance obtained
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                        ⚠ No exercise clearance
                      </span>
                    )}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
