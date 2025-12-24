/**
 * Admin API Service
 * API client for admin dashboard operations
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  Admin,
  AdminLoginRequest,
  AdminLoginResponse,
  AdminPasswordChangeRequest,
  AdminCreateRequest,
  User,
  UserDetails,
  UsersListResponse,
  UserStatsResponse,
  UserUpdateStatusRequest,
  UserUpdateEmailRequest,
  SubscriptionTier,
  SubscriptionStatsResponse,
  ChangeSubscriptionRequest,
  SubscriptionHistoryResponse,
  UserCredits,
  GrantCreditsRequest,
  RevokeCreditsRequest,
  CreditStatsResponse,
  CreditTransactionsResponse,
  AuditLogsResponse,
  AuditStatsResponse,
  ApiResponse,
  PaginationParams,
  UserFilters,
  AuditLogFilters,
} from '../types/admin';

// Create axios instance for admin API
const adminApi: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================================
// Request/Response Interceptors
// ============================================================================

// Request interceptor - attach admin token
adminApi.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('adminAccessToken');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token refresh
adminApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // If 401 and we haven't retried yet, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('adminRefreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post<ApiResponse<AdminLoginResponse>>(
          `${import.meta.env.VITE_API_URL || '/api'}/admin/auth/refresh`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens;

        localStorage.setItem('adminAccessToken', accessToken);
        localStorage.setItem('adminRefreshToken', newRefreshToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return adminApi(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        localStorage.removeItem('adminAccessToken');
        localStorage.removeItem('adminRefreshToken');
        localStorage.removeItem('admin');
        window.location.href = '/admin/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ============================================================================
// Authentication
// ============================================================================

export const adminAuthApi = {
  /**
   * Admin login
   */
  async login(credentials: AdminLoginRequest): Promise<AdminLoginResponse> {
    const response = await adminApi.post<ApiResponse<AdminLoginResponse>>(
      '/admin/auth/login',
      credentials
    );
    return response.data.data;
  },

  /**
   * Refresh admin access token
   */
  async refreshToken(refreshToken: string): Promise<AdminLoginResponse> {
    const response = await adminApi.post<ApiResponse<AdminLoginResponse>>(
      '/admin/auth/refresh',
      { refreshToken }
    );
    return response.data.data;
  },

  /**
   * Get current admin profile
   */
  async getMe(): Promise<Admin> {
    const response = await adminApi.get<ApiResponse<Admin>>('/admin/auth/me');
    return response.data.data;
  },

  /**
   * Change admin password
   */
  async changePassword(data: AdminPasswordChangeRequest): Promise<void> {
    await adminApi.put('/admin/auth/password', data);
  },

  /**
   * Create new admin (super admin only)
   */
  async createAdmin(data: AdminCreateRequest): Promise<Admin> {
    const response = await adminApi.post<ApiResponse<{ id: string } & Admin>>(
      '/admin/auth/create',
      data
    );
    return response.data.data;
  },

  /**
   * Deactivate admin (super admin only)
   */
  async deactivateAdmin(adminId: string, reason?: string): Promise<void> {
    await adminApi.put(`/admin/auth/${adminId}/deactivate`, { reason });
  },

  /**
   * Logout (client-side only - clear tokens)
   */
  logout(): void {
    localStorage.removeItem('adminAccessToken');
    localStorage.removeItem('adminRefreshToken');
    localStorage.removeItem('admin');
  },
};

// ============================================================================
// User Management
// ============================================================================

export const adminUsersApi = {
  /**
   * Get user statistics
   */
  async getStats(): Promise<UserStatsResponse> {
    const response = await adminApi.get<ApiResponse<UserStatsResponse>>(
      '/admin/users/stats'
    );
    return response.data.data;
  },

  /**
   * List all users with filters and pagination
   */
  async getUsers(filters?: UserFilters): Promise<UsersListResponse> {
    const params = new URLSearchParams();
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.tier) params.append('tier', filters.tier);
    if (filters?.verified !== undefined)
      params.append('verified', filters.verified.toString());

    const response = await adminApi.get<ApiResponse<UsersListResponse>>(
      `/admin/users?${params.toString()}`
    );
    return response.data.data;
  },

  /**
   * Get detailed user information
   */
  async getUserDetails(userId: string): Promise<UserDetails> {
    const response = await adminApi.get<ApiResponse<UserDetails>>(
      `/admin/users/${userId}`
    );
    return response.data.data;
  },

  /**
   * Search users by email
   */
  async searchUsers(email: string): Promise<User[]> {
    const response = await adminApi.get<ApiResponse<User[]>>(
      `/admin/users/search?email=${encodeURIComponent(email)}`
    );
    return response.data.data;
  },

  /**
   * Update user status (activate/deactivate)
   */
  async updateUserStatus(
    userId: string,
    data: UserUpdateStatusRequest
  ): Promise<User> {
    const response = await adminApi.put<ApiResponse<User>>(
      `/admin/users/${userId}/status`,
      data
    );
    return response.data.data;
  },

  /**
   * Update user email
   */
  async updateUserEmail(
    userId: string,
    data: UserUpdateEmailRequest
  ): Promise<User> {
    const response = await adminApi.put<ApiResponse<User>>(
      `/admin/users/${userId}/email`,
      data
    );
    return response.data.data;
  },
};

// ============================================================================
// Subscription Management
// ============================================================================

export const adminSubscriptionsApi = {
  /**
   * Get all subscription tiers
   */
  async getTiers(): Promise<SubscriptionTier[]> {
    const response = await adminApi.get<ApiResponse<SubscriptionTier[]>>(
      '/admin/subscriptions/tiers'
    );
    return response.data.data;
  },

  /**
   * Get subscription statistics
   */
  async getStats(): Promise<SubscriptionStatsResponse> {
    const response = await adminApi.get<ApiResponse<SubscriptionStatsResponse>>(
      '/admin/subscriptions/stats'
    );
    return response.data.data;
  },

  /**
   * Change user subscription tier
   */
  async changeUserSubscription(
    userId: string,
    data: ChangeSubscriptionRequest
  ): Promise<any> {
    const response = await adminApi.put(
      `/admin/subscriptions/users/${userId}/subscription`,
      data
    );
    return response.data.data;
  },

  /**
   * Cancel user subscription
   */
  async cancelUserSubscription(userId: string, reason?: string): Promise<any> {
    const response = await adminApi.post(
      `/admin/subscriptions/users/${userId}/subscription/cancel`,
      { reason }
    );
    return response.data.data;
  },

  /**
   * Reactivate user subscription
   */
  async reactivateUserSubscription(userId: string, reason?: string): Promise<any> {
    const response = await adminApi.post(
      `/admin/subscriptions/users/${userId}/subscription/reactivate`,
      { reason }
    );
    return response.data.data;
  },

  /**
   * Get user subscription history
   */
  async getUserSubscriptionHistory(
    userId: string
  ): Promise<SubscriptionHistoryResponse[]> {
    const response = await adminApi.get<ApiResponse<SubscriptionHistoryResponse[]>>(
      `/admin/subscriptions/users/${userId}/subscription/history`
    );
    return response.data.data;
  },
};

// ============================================================================
// Credit Management
// ============================================================================

export const adminCreditsApi = {
  /**
   * Get user credit balance
   */
  async getUserCredits(userId: string): Promise<UserCredits> {
    const response = await adminApi.get<ApiResponse<UserCredits>>(
      `/admin/credits/users/${userId}/credits`
    );
    return response.data.data;
  },

  /**
   * Grant credits to user
   */
  async grantCredits(userId: string, data: GrantCreditsRequest): Promise<any> {
    const response = await adminApi.post(
      `/admin/credits/users/${userId}/credits/grant`,
      data
    );
    return response.data.data;
  },

  /**
   * Revoke credits from user
   */
  async revokeCredits(userId: string, data: RevokeCreditsRequest): Promise<any> {
    const response = await adminApi.post(
      `/admin/credits/users/${userId}/credits/revoke`,
      data
    );
    return response.data.data;
  },

  /**
   * Get credit transaction history
   */
  async getTransactions(
    userId: string,
    params?: PaginationParams
  ): Promise<CreditTransactionsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const response = await adminApi.get<ApiResponse<CreditTransactionsResponse>>(
      `/admin/credits/users/${userId}/credits/transactions?${queryParams.toString()}`
    );
    return response.data.data;
  },

  /**
   * Get credit statistics
   */
  async getStats(): Promise<CreditStatsResponse> {
    const response = await adminApi.get<ApiResponse<CreditStatsResponse>>(
      '/admin/credits/stats'
    );
    return response.data.data;
  },
};

// ============================================================================
// Audit Logging
// ============================================================================

export const adminAuditApi = {
  /**
   * Get audit logs with filters
   */
  async getLogs(filters?: AuditLogFilters): Promise<AuditLogsResponse> {
    const params = new URLSearchParams();
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());
    if (filters?.adminId) params.append('adminId', filters.adminId);
    if (filters?.action) params.append('action', filters.action);
    if (filters?.targetType) params.append('targetType', filters.targetType);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const response = await adminApi.get<ApiResponse<AuditLogsResponse>>(
      `/admin/audit/logs?${params.toString()}`
    );
    return response.data.data;
  },

  /**
   * Get user-specific audit logs
   */
  async getUserLogs(
    userId: string,
    params?: PaginationParams
  ): Promise<AuditLogsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const response = await adminApi.get<ApiResponse<AuditLogsResponse>>(
      `/admin/audit/logs/user/${userId}?${queryParams.toString()}`
    );
    return response.data.data;
  },

  /**
   * Get impersonation logs
   */
  async getImpersonationLogs(params?: PaginationParams): Promise<AuditLogsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const response = await adminApi.get<ApiResponse<AuditLogsResponse>>(
      `/admin/audit/logs/impersonation?${queryParams.toString()}`
    );
    return response.data.data;
  },

  /**
   * Get audit statistics
   */
  async getStats(): Promise<AuditStatsResponse> {
    const response = await adminApi.get<ApiResponse<AuditStatsResponse>>(
      '/admin/audit/stats'
    );
    return response.data.data;
  },
};

// ============================================================================
// Error Helper
// ============================================================================

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error?: string; message?: string }>;
    return (
      axiosError.response?.data?.error ||
      axiosError.response?.data?.message ||
      axiosError.message ||
      'An error occurred'
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}

export default adminApi;
