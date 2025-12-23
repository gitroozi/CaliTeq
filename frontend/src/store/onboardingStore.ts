import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Gender,
  TrainingExperience,
  ActivityLevel,
  Equipment,
  AssessmentScores,
  CreateProfileData,
} from '../types';

interface OnboardingData {
  // Step 1: Personal details
  dateOfBirth: string;
  gender: Gender | null;
  heightCm: number | null;
  currentWeightKg: number | null;
  targetWeightKg: number | null;
  trainingExperience: TrainingExperience | null;
  activityLevel: ActivityLevel | null;

  // Step 2: Goals
  goals: string[];

  // Step 3: Medical
  injuries: string[];
  medicalConditions: string[];
  exerciseClearance: boolean;

  // Step 4: Equipment & Availability
  equipment: Equipment;
  daysPerWeek: number | null;
  minutesPerSession: number | null;

  // Step 5: Assessment
  assessmentScores: AssessmentScores;
}

interface OnboardingState {
  data: OnboardingData;
  currentStep: number;

  // Actions
  updatePersonalDetails: (data: Partial<OnboardingData>) => void;
  updateGoals: (goals: string[]) => void;
  updateMedical: (data: { injuries: string[]; medicalConditions: string[]; exerciseClearance: boolean }) => void;
  updateEquipmentAndAvailability: (data: { equipment: Equipment; daysPerWeek: number; minutesPerSession: number }) => void;
  updateAssessment: (scores: AssessmentScores) => void;
  setCurrentStep: (step: number) => void;
  reset: () => void;
  getProfileData: () => CreateProfileData | null;
}

const initialData: OnboardingData = {
  dateOfBirth: '',
  gender: null,
  heightCm: null,
  currentWeightKg: null,
  targetWeightKg: null,
  trainingExperience: null,
  activityLevel: null,
  goals: [],
  injuries: [],
  medicalConditions: [],
  exerciseClearance: false,
  equipment: {
    pullUpBar: false,
    dipBars: false,
    resistanceBands: false,
    elevatedSurface: true,
    other: [],
  },
  daysPerWeek: null,
  minutesPerSession: null,
  assessmentScores: {
    pushLevel: 1,
    pullLevel: 1,
    squatLevel: 1,
    hingeLevel: 1,
    coreLevel: 1,
  },
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      data: initialData,
      currentStep: 1,

      updatePersonalDetails: (data) =>
        set((state) => ({
          data: { ...state.data, ...data },
        })),

      updateGoals: (goals) =>
        set((state) => ({
          data: { ...state.data, goals },
        })),

      updateMedical: (data) =>
        set((state) => ({
          data: {
            ...state.data,
            injuries: data.injuries,
            medicalConditions: data.medicalConditions,
            exerciseClearance: data.exerciseClearance,
          },
        })),

      updateEquipmentAndAvailability: (data) =>
        set((state) => ({
          data: {
            ...state.data,
            equipment: data.equipment,
            daysPerWeek: data.daysPerWeek,
            minutesPerSession: data.minutesPerSession,
          },
        })),

      updateAssessment: (scores) =>
        set((state) => ({
          data: { ...state.data, assessmentScores: scores },
        })),

      setCurrentStep: (step) => set({ currentStep: step }),

      reset: () => set({ data: initialData, currentStep: 1 }),

      getProfileData: () => {
        const { data } = get();
        const authState = useAuthStore.getState();
        const { user } = authState;

        console.log('Auth store state:', authState);
        console.log('User from auth store:', user);

        if (!user) {
          console.error('Onboarding validation failed: User not found');
          console.error('Auth state:', authState);
          return null;
        }

        // Validate required fields with detailed logging
        const missingFields: string[] = [];
        if (!data.dateOfBirth) missingFields.push('dateOfBirth');
        if (!data.gender) missingFields.push('gender');
        if (!data.heightCm) missingFields.push('heightCm');
        if (!data.currentWeightKg) missingFields.push('currentWeightKg');
        if (!data.trainingExperience) missingFields.push('trainingExperience');
        if (!data.activityLevel) missingFields.push('activityLevel');
        if (!data.daysPerWeek) missingFields.push('daysPerWeek');
        if (!data.minutesPerSession) missingFields.push('minutesPerSession');
        if (data.goals.length === 0) missingFields.push('goals (must select at least one)');

        if (missingFields.length > 0) {
          console.error('Onboarding validation failed. Missing fields:', missingFields);
          console.log('Current onboarding data:', data);
          return null;
        }

        return {
          firstName: (user as any).first_name || user.firstName || '',
          lastName: (user as any).last_name || user.lastName || '',
          dateOfBirth: data.dateOfBirth,
          gender: data.gender!, // Validated above
          heightCm: data.heightCm!, // Validated above
          currentWeightKg: data.currentWeightKg!, // Validated above
          targetWeightKg: data.targetWeightKg || undefined,
          trainingExperience: data.trainingExperience!, // Validated above
          activityLevel: data.activityLevel!, // Validated above
          goals: data.goals,
          daysPerWeek: data.daysPerWeek!, // Validated above
          minutesPerSession: data.minutesPerSession!, // Validated above
          injuries: data.injuries,
          medicalConditions: data.medicalConditions,
          exerciseClearance: data.exerciseClearance,
          equipment: data.equipment,
          assessmentScores: data.assessmentScores,
        };
      },
    }),
    {
      name: 'onboarding-storage',
    }
  )
);

// Import useAuthStore to avoid circular dependency
import { useAuthStore } from './authStore';
