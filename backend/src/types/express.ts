import { Request } from 'express';

/**
 * Extended Express Request with authentication data
 */
export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

/**
 * Extended Express Request for admin authentication
 */
export interface AdminRequest extends Request {
  adminId?: string;
  adminEmail?: string;
  isImpersonating?: boolean;
  originalAdminId?: string;
}
