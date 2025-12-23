import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/jwt.js'

/**
 * Authentication middleware
 * Verifies JWT token and attaches user info to request
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No authorization token provided',
      })
    }

    // Extract token (format: "Bearer <token>")
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization format',
      })
    }

    // Verify token
    const payload = verifyAccessToken(token)

    // Attach user info to request
    ;(req as any).userId = payload.userId
    ;(req as any).userEmail = payload.email

    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    })
  }
}

/**
 * Optional authentication middleware
 * Attaches user info if token is valid, but doesn't require it
 */
export const optionalAuthenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return next()
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader

    if (!token) {
      return next()
    }

    const payload = verifyAccessToken(token)
    ;(req as any).userId = payload.userId
    ;(req as any).userEmail = payload.email

    next()
  } catch (error) {
    // Token invalid, but that's ok for optional auth
    next()
  }
}
