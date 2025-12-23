import jwt, { type SignOptions } from 'jsonwebtoken'

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'admin-secret'
const ADMIN_JWT_REFRESH_SECRET = process.env.ADMIN_JWT_REFRESH_SECRET || 'admin-refresh-secret'
const ADMIN_JWT_EXPIRES_IN = process.env.ADMIN_JWT_EXPIRES_IN || '5m'
const ADMIN_JWT_REFRESH_EXPIRES_IN = process.env.ADMIN_JWT_REFRESH_EXPIRES_IN || '1d'

export interface AdminTokenPayload {
  adminId: string
  email: string
  isSuperAdmin: boolean
}

export interface AdminRefreshTokenPayload {
  adminId: string
  email: string
}

/**
 * Generate admin access token (short-lived: 5 minutes)
 */
export function generateAdminToken(payload: AdminTokenPayload): string {
  const options: SignOptions = {
    expiresIn: ADMIN_JWT_EXPIRES_IN as SignOptions['expiresIn'],
  }
  return jwt.sign(payload, ADMIN_JWT_SECRET, options)
}

/**
 * Generate admin refresh token (medium-lived: 1 day)
 */
export function generateAdminRefreshToken(payload: AdminRefreshTokenPayload): string {
  const options: SignOptions = {
    expiresIn: ADMIN_JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
  }
  return jwt.sign(payload, ADMIN_JWT_REFRESH_SECRET, options)
}

/**
 * Verify admin access token
 */
export function verifyAdminToken(token: string): AdminTokenPayload {
  try {
    const decoded = jwt.verify(token, ADMIN_JWT_SECRET) as AdminTokenPayload
    return decoded
  } catch (error) {
    throw new Error('Invalid or expired admin token')
  }
}

/**
 * Verify admin refresh token
 */
export function verifyAdminRefreshToken(token: string): AdminRefreshTokenPayload {
  try {
    const decoded = jwt.verify(token, ADMIN_JWT_REFRESH_SECRET) as AdminRefreshTokenPayload
    return decoded
  } catch (error) {
    throw new Error('Invalid or expired admin refresh token')
  }
}

/**
 * Generate both admin access and refresh tokens
 */
export function generateAdminTokenPair(admin: {
  id: string
  email: string
  is_super_admin: boolean
}): {
  accessToken: string
  refreshToken: string
} {
  const tokenPayload: AdminTokenPayload = {
    adminId: admin.id,
    email: admin.email,
    isSuperAdmin: admin.is_super_admin,
  }

  const refreshPayload: AdminRefreshTokenPayload = {
    adminId: admin.id,
    email: admin.email,
  }

  return {
    accessToken: generateAdminToken(tokenPayload),
    refreshToken: generateAdminRefreshToken(refreshPayload),
  }
}
