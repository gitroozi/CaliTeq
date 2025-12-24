import { Request } from 'express';

/**
 * Extended Express Request with authentication data
 * Explicitly includes commonly used Request properties for TypeScript compatibility
 */
export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
  body: any;
  params: any;
  query: any;
}

/**
 * Extended Express Request for admin authentication
 * Explicitly includes commonly used Request properties for TypeScript compatibility
 */
export interface AdminRequest extends Request {
  adminId?: string;
  adminEmail?: string;
  isSuperAdmin?: boolean;
  isImpersonating?: boolean;
  originalAdminId?: string;
  body: any;
  params: any;
  query: any;
}
