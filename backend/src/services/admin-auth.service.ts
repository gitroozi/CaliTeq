import bcrypt from 'bcrypt'
import { generateAdminTokenPair, verifyAdminRefreshToken } from '../utils/admin-jwt.js'
import { AuditService } from './audit.service.js'
import prisma from '../utils/db.js'

export interface AdminLoginData {
  email: string
  password: string
  ipAddress?: string
  userAgent?: string
}

/**
 * Admin Authentication Service
 * Handles admin login, token refresh, and account management
 */
export class AdminAuthService {
  /**
   * Admin login
   */
  static async login(data: AdminLoginData) {
    const { email, password, ipAddress, userAgent } = data

    // Find admin by email
    const admin = await prisma.admin.findUnique({
      where: { email },
    })

    if (!admin) {
      throw new Error('Invalid email or password')
    }

    // Check if admin is active
    if (!admin.is_active) {
      throw new Error('Admin account is deactivated')
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash)
    if (!isPasswordValid) {
      throw new Error('Invalid email or password')
    }

    // Update last login
    await prisma.admin.update({
      where: { id: admin.id },
      data: { last_login_at: new Date() },
    })

    // Generate tokens
    const tokens = generateAdminTokenPair(admin)

    // Log login action
    await AuditService.logAction({
      adminId: admin.id,
      action: 'admin.login',
      targetType: 'admin',
      targetId: admin.id,
      ipAddress,
      userAgent,
    })

    return {
      admin: {
        id: admin.id,
        email: admin.email,
        firstName: admin.first_name,
        lastName: admin.last_name,
        isSuperAdmin: admin.is_super_admin,
      },
      tokens,
    }
  }

  /**
   * Refresh admin access token
   */
  static async refreshToken(refreshToken: string, ipAddress?: string, userAgent?: string) {
    try {
      // Verify refresh token
      const payload = verifyAdminRefreshToken(refreshToken)

      // Find admin
      const admin = await prisma.admin.findUnique({
        where: { id: payload.adminId },
      })

      if (!admin) {
        throw new Error('Admin not found')
      }

      if (!admin.is_active) {
        throw new Error('Admin account is deactivated')
      }

      // Generate new token pair
      const tokens = generateAdminTokenPair(admin)

      // Log token refresh
      await AuditService.logAction({
        adminId: admin.id,
        action: 'admin.token_refresh',
        targetType: 'admin',
        targetId: admin.id,
        ipAddress,
        userAgent,
      })

      return {
        admin: {
          id: admin.id,
          email: admin.email,
          firstName: admin.first_name,
          lastName: admin.last_name,
          isSuperAdmin: admin.is_super_admin,
        },
        tokens,
      }
    } catch (error) {
      throw new Error('Invalid or expired refresh token')
    }
  }

  /**
   * Get admin profile
   */
  static async getAdminProfile(adminId: string) {
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        is_super_admin: true,
        is_active: true,
        created_at: true,
        last_login_at: true,
      },
    })

    if (!admin) {
      throw new Error('Admin not found')
    }

    return {
      id: admin.id,
      email: admin.email,
      firstName: admin.first_name,
      lastName: admin.last_name,
      isSuperAdmin: admin.is_super_admin,
      isActive: admin.is_active,
      createdAt: admin.created_at,
      lastLoginAt: admin.last_login_at,
    }
  }

  /**
   * Change admin password
   */
  static async changePassword(
    adminId: string,
    currentPassword: string,
    newPassword: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    // Find admin
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    })

    if (!admin) {
      throw new Error('Admin not found')
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, admin.password_hash)
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect')
    }

    // Validate new password
    if (newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters long')
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10)

    // Update password
    await prisma.admin.update({
      where: { id: adminId },
      data: { password_hash: newPasswordHash },
    })

    // Log password change
    await AuditService.logAction({
      adminId: admin.id,
      action: 'admin.password_change',
      targetType: 'admin',
      targetId: admin.id,
      ipAddress,
      userAgent,
    })

    return { success: true }
  }

  /**
   * Create new admin (super admin only)
   * Note: This should only be called by super admins
   */
  static async createAdmin(
    data: {
      email: string
      password: string
      firstName: string
      lastName: string
      isSuperAdmin?: boolean
    },
    createdByAdminId: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    // Verify the creating admin is a super admin
    const creatingAdmin = await prisma.admin.findUnique({
      where: { id: createdByAdminId },
    })

    if (!creatingAdmin || !creatingAdmin.is_super_admin) {
      throw new Error('Only super admins can create new admin accounts')
    }

    // Check if email already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: data.email },
    })

    if (existingAdmin) {
      throw new Error('Admin with this email already exists')
    }

    // Validate password
    if (data.password.length < 8) {
      throw new Error('Password must be at least 8 characters long')
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10)

    // Create admin
    const newAdmin = await prisma.admin.create({
      data: {
        email: data.email,
        password_hash: passwordHash,
        first_name: data.firstName,
        last_name: data.lastName,
        is_super_admin: data.isSuperAdmin || false,
        is_active: true,
      },
    })

    // Log admin creation
    await AuditService.logAction({
      adminId: createdByAdminId,
      action: 'admin.create',
      targetType: 'admin',
      targetId: newAdmin.id,
      changes: {
        email: newAdmin.email,
        firstName: newAdmin.first_name,
        lastName: newAdmin.last_name,
        isSuperAdmin: newAdmin.is_super_admin,
      },
      ipAddress,
      userAgent,
    })

    return {
      id: newAdmin.id,
      email: newAdmin.email,
      firstName: newAdmin.first_name,
      lastName: newAdmin.last_name,
      isSuperAdmin: newAdmin.is_super_admin,
      isActive: newAdmin.is_active,
    }
  }

  /**
   * Deactivate admin account (super admin only)
   */
  static async deactivateAdmin(
    adminIdToDeactivate: string,
    deactivatedByAdminId: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    // Verify the deactivating admin is a super admin
    const deactivatingAdmin = await prisma.admin.findUnique({
      where: { id: deactivatedByAdminId },
    })

    if (!deactivatingAdmin || !deactivatingAdmin.is_super_admin) {
      throw new Error('Only super admins can deactivate admin accounts')
    }

    // Cannot deactivate yourself
    if (adminIdToDeactivate === deactivatedByAdminId) {
      throw new Error('Cannot deactivate your own account')
    }

    // Find admin to deactivate
    const adminToDeactivate = await prisma.admin.findUnique({
      where: { id: adminIdToDeactivate },
    })

    if (!adminToDeactivate) {
      throw new Error('Admin not found')
    }

    // Update admin
    const updatedAdmin = await prisma.admin.update({
      where: { id: adminIdToDeactivate },
      data: { is_active: false },
    })

    // Log deactivation
    await AuditService.logAction({
      adminId: deactivatedByAdminId,
      action: 'admin.deactivate',
      targetType: 'admin',
      targetId: adminIdToDeactivate,
      changes: {
        before: { is_active: true },
        after: { is_active: false },
      },
      ipAddress,
      userAgent,
    })

    return {
      id: updatedAdmin.id,
      email: updatedAdmin.email,
      isActive: updatedAdmin.is_active,
    }
  }
}
