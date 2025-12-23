import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { hashPassword, comparePassword, validatePassword } from '../utils/password.js'
import { generateTokenPair, verifyRefreshToken } from '../utils/jwt.js'
import { validateEmail, sanitizeEmail } from '../utils/validation.js'

const prisma = new PrismaClient()

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      })
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      })
    }

    // Validate password strength
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message,
      })
    }

    // Sanitize email
    const sanitizedEmail = sanitizeEmail(email)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    })

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      })
    }

    // Hash password
    const password_hash = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: sanitizedEmail,
        password_hash,
        first_name: firstName || null,
        last_name: lastName || null,
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        created_at: true,
      },
    })

    // Generate tokens
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
    })

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        ...tokens,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration',
    })
  }
}

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      })
    }

    // Sanitize email
    const sanitizedEmail = sanitizeEmail(email)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact support.',
      })
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password_hash)

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { last_login_at: new Date() },
    })

    // Generate tokens
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
    })

    // Return user without password hash
    const { password_hash, ...userWithoutPassword } = user

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        ...tokens,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error during login',
    })
  }
}

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      })
    }

    // Verify refresh token
    let payload
    try {
      payload = verifyRefreshToken(refreshToken)
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token',
      })
    }

    // Check if user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    })

    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'User not found or account deactivated',
      })
    }

    // Generate new token pair
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
    })

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: tokens,
    })
  } catch (error) {
    console.error('Token refresh error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error during token refresh',
    })
  }
}

/**
 * Get current user info
 * GET /api/auth/me
 */
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // User ID is attached by auth middleware
    const userId = (req as any).userId

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        date_of_birth: true,
        gender: true,
        height_cm: true,
        current_weight_kg: true,
        target_weight_kg: true,
        subscription_tier: true,
        created_at: true,
        updated_at: true,
      },
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    res.status(200).json({
      success: true,
      data: { user },
    })
  } catch (error) {
    console.error('Get current user error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}
