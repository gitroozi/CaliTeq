import { create } from 'zustand';
import type { User, UserProfile, CreateProfileData } from '../types';
import { authApi, profileApi } from '../services/api';

interface UserState {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchUser: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  createProfile: (data: CreateProfileData) => Promise<void>;
  updateProfile: (data: Partial<CreateProfileData>) => Promise<void>;
  checkProfileComplete: () => Promise<boolean>;
  clearError: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  profile: null,
  isLoading: false,
  error: null,

  fetchUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await authApi.getCurrentUser();
      set({ user, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch user';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const profile = await profileApi.getProfile();
      set({ profile, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch profile';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  createProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await profileApi.createProfile(data);
      // Also fetch updated user data
      const user = await authApi.getCurrentUser();
      set({ profile, user, isLoading: false });
    } catch (error: any) {
      console.error('UserStore - Profile creation failed:', error);
      console.error('UserStore - Error response:', error.response?.data);
      if (error.response?.data?.details) {
        console.error('UserStore - Validation details:', error.response.data.details);
      }
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to create profile';
      set({ error: errorMessage, isLoading: false });
      throw error; // Throw original error to preserve response
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await profileApi.updateProfile(data);
      // Also fetch updated user data
      const user = await authApi.getCurrentUser();
      set({ profile, user, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to update profile';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  checkProfileComplete: async () => {
    try {
      return await profileApi.isProfileComplete();
    } catch (error) {
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
