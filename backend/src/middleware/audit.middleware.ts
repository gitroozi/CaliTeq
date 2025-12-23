import { Request, Response, NextFunction } from 'express'
import { AuditService } from '../services/audit.service.js'

/**
 * Extract IP address from request
 */
function getIpAddress(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'] as string
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return req.socket.remoteAddress || 'unknown'
}

/**
 * Extract user agent from request
 */
function getUserAgent(req: Request): string {
  return req.headers['user-agent'] || 'unknown'
}

/**
 * Audit logging middleware
 * Automatically logs admin actions based on route patterns
 */
export const auditLog = (action: string, targetType: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Store original json method
    const originalJson = res.json.bind(res)

    // Override json method to capture response
    res.json = function (data: any) {
      // Only log if admin is authenticated and request was successful
      if (req.admin && res.statusCode >= 200 && res.statusCode < 300) {
        // Extract target ID from request
        let targetId = req.params.id || req.params.userId || req.body.userId || 'unknown'

        // Extract changes from request body (for POST/PUT/PATCH requests)
        let changes: Record<string, any> | undefined
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
          changes = {
            method: req.method,
            body: req.body,
            params: req.params,
            query: req.query,
          }
        }

        // Log the action (fire and forget - don't block response)
        AuditService.logAction({
          adminId: req.admin.id,
          action,
          targetType,
          targetId,
          changes,
          ipAddress: getIpAddress(req),
          userAgent: getUserAgent(req),
        }).catch((error) => {
          console.error('Failed to log audit action:', error)
        })
      }

      return originalJson(data)
    }

    next()
  }
}

/**
 * Create audit middleware factory for common patterns
 */
export const createAuditMiddleware = (
  actionPrefix: string,
  targetType: string,
  options: {
    includeQuery?: boolean
    includeBody?: boolean
  } = {}
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const method = req.method.toLowerCase()
    let action = `${actionPrefix}.${method}`

    // Map HTTP methods to CRUD actions
    switch (method) {
      case 'get':
        action = req.params.id ? `${actionPrefix}.view` : `${actionPrefix}.list`
        break
      case 'post':
        action = `${actionPrefix}.create`
        break
      case 'put':
      case 'patch':
        action = `${actionPrefix}.update`
        break
      case 'delete':
        action = `${actionPrefix}.delete`
        break
    }

    return auditLog(action, targetType)(req, res, next)
  }
}

/**
 * Middleware to track request context for audit logs
 * Attaches IP and user agent to request for easy access
 */
export const trackRequestContext = (req: Request, res: Response, next: NextFunction) => {
  // Attach helpers to request for easy access in controllers
  ;(req as any).auditContext = {
    ipAddress: getIpAddress(req),
    userAgent: getUserAgent(req),
  }

  next()
}

/**
 * Manual audit log helper for complex operations
 * Use this in controllers when you need custom audit logging
 */
export const logAdminAction = async (
  req: Request,
  action: string,
  targetType: string,
  targetId: string,
  changes?: Record<string, any>
) => {
  if (!req.admin) {
    console.warn('Attempted to log admin action without admin authentication')
    return
  }

  try {
    await AuditService.logAction({
      adminId: req.admin.id,
      action,
      targetType,
      targetId,
      changes,
      ipAddress: getIpAddress(req),
      userAgent: getUserAgent(req),
    })
  } catch (error) {
    console.error('Failed to log admin action:', error)
  }
}
