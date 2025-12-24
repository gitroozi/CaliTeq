/**
 * Admin Types
 * Type definitions for admin dashboard functionality
 */

// ============================================================================
// Admin Authentication
// ============================================================================

export interface Admin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isSuperAdmin: boolean;
  isActive: boolean;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  admin: Admin;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface AdminTokenRefreshRequest {
  refreshToken: string;
}

export interface AdminPasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AdminCreateRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'super_admin';
}

// ============================================================================
// User Management
// ============================================================================

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
  subscription?: UserSubscription;
  credits?: UserCredits;
}

export interface UserProfile {
  dateOfBirth?: string;
  gender?: string;
  heightCm?: number;
  currentWeightKg?: number;
  targetWeightKg?: number;
  trainingExperience?: string;
  activityLevel?: string;
  goals?: string[];
  daysPerWeek?: number;
  minutesPerSession?: number;
}

export interface UserDetails extends User {
  profile?: UserProfile;
  subscription?: UserSubscription;
  credits?: UserCredits;
  workoutPlans?: number;
  workoutLogs?: number;
}

export interface UsersListResponse {
  users: User[];
  total: number;
  limit: number;
  offset: number;
}

export interface UserStatsResponse {
  total_users: number;
  active_users: number;
  inactive_users: number;
  verified_users: number;
  unverified_users: number;
  new_users_today: number;
  new_users_this_week: number;
  new_users_this_month: number;
}

export interface UserUpdateStatusRequest {
  isActive: boolean;
  reason?: string;
}

export interface UserUpdateEmailRequest {
  newEmail: string;
  reason?: string;
}

// ============================================================================
// Subscription Management
// ============================================================================

export interface SubscriptionTier {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  priceMonthly: number;
  priceYearly?: number;
  creditsPerMonth: number;
  features?: string[];
  isActive: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  tierId: string;
  tier: SubscriptionTier;
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate?: string;
  cancelledAt?: string;
  createdAt: string;
}

export interface SubscriptionStatsResponse {
  total_subscriptions: number;
  active_subscriptions: number;
  cancelled_subscriptions: number;
  cancelled_this_month?: number;
  new_this_month?: number;
  tier_breakdown: {
    tier: string;
    displayName: string;
    count: number;
  }[];
}

export interface ChangeSubscriptionRequest {
  tierName: string;
  reason?: string;
}

export interface SubscriptionHistoryResponse {
  id: string;
  userId: string;
  tierId: string;
  tier: SubscriptionTier;
  status: string;
  startDate: string;
  endDate?: string;
  cancelledAt?: string;
}

// ============================================================================
// Credit Management
// ============================================================================

export interface UserCredits {
  id: string;
  userId: string;
  balance: number;
  lifetimeEarned: number;
  lifetimeSpent: number;
  lastUpdated: string;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  type: 'grant' | 'purchase' | 'usage' | 'refund' | 'revoke' | 'subscription_renewal';
  amount: number;
  balance_after: number;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  createdBy?: string;
}

export interface GrantCreditsRequest {
  amount: number;
  reason: string;
}

export interface RevokeCreditsRequest {
  amount: number;
  reason: string;
}

export interface CreditStatsResponse {
  totalGranted: number;
  totalSpent: number;
  totalRevoked: number;
  averageBalance: number;
  usersWithCredits: number;
}

export interface CreditTransactionsResponse {
  transactions: CreditTransaction[];
  total: number;
  limit: number;
  offset: number;
}

// ============================================================================
// Audit Logging
// ============================================================================

export interface AuditLog {
  id: string;
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  changes?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  impersonatedUserId?: string;
  createdAt: string;
  admin?: {
    email: string;
    first_name: string;
    last_name: string;
  };
}

export interface AuditLogsResponse {
  logs: AuditLog[];
  total: number;
  limit: number;
  offset: number;
}

export interface AuditStatsResponse {
  totalActions: number;
  adminCount: number;
  actionBreakdown: Record<string, number>;
  recentActions: AuditLog[];
  total_logs?: number;
  logs_today?: number;
  logs_this_week?: number;
  logs_this_month?: number;
}

// ============================================================================
// Dashboard Stats
// ============================================================================

export interface DashboardStats {
  users: {
    total: number;
    active: number;
    newThisWeek: number;
    newThisMonth: number;
  };
  subscriptions: {
    total: number;
    active: number;
    byTier: Record<string, number>;
  };
  credits: {
    totalGranted: number;
    totalSpent: number;
    averageBalance: number;
  };
  activity: {
    totalWorkoutPlans: number;
    totalWorkoutLogs: number;
    activeUsersToday: number;
  };
}

// ============================================================================
// Common API Response Types
// ============================================================================

export interface ApiResponse<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  message?: string;
}

export type ApiResult<T> = ApiResponse<T> | ApiError;

// ============================================================================
// Filter and Pagination
// ============================================================================

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface UserFilters extends PaginationParams {
  search?: string;
  status?: 'active' | 'inactive';
  tier?: string;
  verified?: boolean;
}

export interface AuditLogFilters extends PaginationParams {
  adminId?: string;
  action?: string;
  targetType?: string;
  startDate?: string;
  endDate?: string;
}
