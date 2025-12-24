/**
 * Admin Auth Store
 * Zustand store for admin authentication state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { adminAuthApi, getErrorMessage } from '../services/adminApi';
import type { Admin, AdminLoginRequest } from '../types/admin';

interface AdminAuthState {
  // State
  admin: Admin | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: AdminLoginRequest) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  clearError: () => void;
  checkAuth: () => Promise<boolean>;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      admin: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      /**
       * Admin login
       */
      login: async (credentials: AdminLoginRequest) => {
        set({ isLoading: true, error: null });

        try {
          const response = await adminAuthApi.login(credentials);

          // Store tokens in localStorage for axios interceptor
          localStorage.setItem('adminAccessToken', response.tokens.accessToken);
          localStorage.setItem('adminRefreshToken', response.tokens.refreshToken);

          set({
            admin: response.admin,
            accessToken: response.tokens.accessToken,
            refreshToken: response.tokens.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = getErrorMessage(error);
          set({
            admin: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      /**
       * Admin logout
       */
      logout: () => {
        // Clear tokens from localStorage
        adminAuthApi.logout();

        set({
          admin: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      /**
       * Refresh authentication
       */
      refreshAuth: async () => {
        const { refreshToken } = get();

        if (!refreshToken) {
          set({
            admin: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            error: 'No refresh token available',
          });
          return;
        }

        try {
          const response = await adminAuthApi.refreshToken(refreshToken);

          // Update tokens in localStorage
          localStorage.setItem('adminAccessToken', response.tokens.accessToken);
          localStorage.setItem('adminRefreshToken', response.tokens.refreshToken);

          set({
            admin: response.admin,
            accessToken: response.tokens.accessToken,
            refreshToken: response.tokens.refreshToken,
            isAuthenticated: true,
            error: null,
          });
        } catch (error) {
          const errorMessage = getErrorMessage(error);
          set({
            admin: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            error: errorMessage,
          });

          // Clear tokens from localStorage
          adminAuthApi.logout();
        }
      },

      /**
       * Clear error message
       */
      clearError: () => {
        set({ error: null });
      },

      /**
       * Check if admin is authenticated
       * Useful for protecting routes
       */
      checkAuth: async (): Promise<boolean> => {
        const { accessToken, refreshToken } = get();

        if (!accessToken || !refreshToken) {
          return false;
        }

        try {
          // Try to get current admin profile
          const admin = await adminAuthApi.getMe();
          set({
            admin,
            isAuthenticated: true,
          });
          return true;
        } catch (error) {
          // If access token is invalid, try to refresh
          try {
            await get().refreshAuth();
            return get().isAuthenticated;
          } catch (refreshError) {
            get().logout();
            return false;
          }
        }
      },
    }),
    {
      name: 'admin-auth-storage',
      partialize: (state) => ({
        admin: state.admin,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

/**
 * Hook to get admin info
 */
export const useAdmin = () => useAdminAuthStore((state) => state.admin);

/**
 * Hook to check if admin is authenticated
 */
export const useIsAdminAuthenticated = () =>
  useAdminAuthStore((state) => state.isAuthenticated);

/**
 * Hook to check if admin is super admin
 */
export const useIsSuperAdmin = () =>
  useAdminAuthStore((state) => state.admin?.isSuperAdmin || false);
