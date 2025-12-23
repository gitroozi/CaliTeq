import { Request, Response, NextFunction } from 'express'
import { verifyAdminToken, AdminTokenPayload } from '../utils/admin-jwt.js'
import prisma from '../utils/db.js'

// Extend Express Request type to include admin
declare global {
  namespace Express {
    interface Request {
      admin?: {
        id: string
        email: string
        isSuperAdmin: boolean
      }
    }
  }
}

/**
 * Admin authentication middleware
 * Verifies admin JWT token and attaches admin info to request
 */
export const authenticateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided',
      })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Verify token
    let payload: AdminTokenPayload
    try {
      payload = verifyAdminToken(token)
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
      })
    }

    // Verify admin still exists and is active
    const admin = await prisma.admin.findUnique({
      where: { id: payload.adminId },
    })

    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Admin not found',
      })
    }

    if (!admin.is_active) {
      return res.status(403).json({
        success: false,
        error: 'Admin account is deactivated',
      })
    }

    // Attach admin info to request
    req.admin = {
      id: admin.id,
      email: admin.email,
      isSuperAdmin: admin.is_super_admin,
    }

    next()
  } catch (error) {
    console.error('Admin auth middleware error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    })
  }
}

/**
 * Super admin authorization middleware
 * Requires admin to be a super admin
 */
export const requireSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.admin) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
    })
  }

  if (!req.admin.isSuperAdmin) {
    return res.status(403).json({
      success: false,
      error: 'Super admin access required',
    })
  }

  next()
}

/**
 * Optional admin authentication
 * Attaches admin info if token is present, but doesn't require it
 */
export const optionalAdminAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next()
    }

    const token = authHeader.substring(7)

    try {
      const payload = verifyAdminToken(token)

      const admin = await prisma.admin.findUnique({
        where: { id: payload.adminId },
      })

      if (admin && admin.is_active) {
        req.admin = {
          id: admin.id,
          email: admin.email,
          isSuperAdmin: admin.is_super_admin,
        }
      }
    } catch (error) {
      // Ignore token errors for optional auth
    }

    next()
  } catch (error) {
    console.error('Optional admin auth middleware error:', error)
    next()
  }
}
