import { create } from 'zustand';
import type { WorkoutPlan, WorkoutSession } from '../types';
import { workoutApi } from '../services/api';

interface WorkoutState {
  activePlan: WorkoutPlan | null;
  todayWorkout: WorkoutSession | null;
  weekSessions: WorkoutSession[];
  currentSession: WorkoutSession | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchActivePlan: () => Promise<void>;
  fetchTodayWorkout: () => Promise<void>;
  fetchWeekSessions: (weekNumber: number) => Promise<void>;
  fetchSession: (sessionId: string) => Promise<void>;
  generatePlan: () => Promise<void>;
  deactivatePlan: (planId: string) => Promise<void>;
  clearError: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  activePlan: null,
  todayWorkout: null,
  weekSessions: [],
  currentSession: null,
  isLoading: false,
  error: null,

  fetchActivePlan: async () => {
    set({ isLoading: true, error: null });
    try {
      const activePlan = await workoutApi.getActivePlan();
      set({ activePlan, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch active plan';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchTodayWorkout: async () => {
    set({ isLoading: true, error: null });
    try {
      const todayWorkout = await workoutApi.getTodayWorkout();
      set({ todayWorkout, isLoading: false });
    } catch (error: any) {
      // Don't set error for 404 - that just means no workout scheduled for today
      if (error.response?.status === 404) {
        set({ todayWorkout: null, isLoading: false });
        return;
      }
      const errorMessage = error.response?.data?.error || 'Failed to fetch today\'s workout';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchWeekSessions: async (weekNumber) => {
    set({ isLoading: true, error: null });
    try {
      const weekSessions = await workoutApi.getWeekSessions(weekNumber);
      set({ weekSessions, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch week sessions';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  fetchSession: async (sessionId) => {
    set({ isLoading: true, error: null });
    try {
      const currentSession = await workoutApi.getSession(sessionId);
      set({ currentSession, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch session';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  generatePlan: async () => {
    set({ isLoading: true, error: null });
    try {
      const activePlan = await workoutApi.generatePlan();
      set({ activePlan, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to generate plan';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  deactivatePlan: async (planId) => {
    set({ isLoading: true, error: null });
    try {
      await workoutApi.deactivatePlan(planId);
      set({ activePlan: null, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to deactivate plan';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  clearError: () => set({ error: null }),
}));
