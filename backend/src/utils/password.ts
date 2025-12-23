import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

/**
 * Hash a password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Compare a plain password with a hashed password
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)
}

/**
 * Validate password strength
 * Requirements: min 8 chars, at least 1 number, 1 letter
 */
export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return {
      valid: false,
      message: 'Password must be at least 8 characters long',
    }
  }

  if (!/[A-Za-z]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one letter',
    }
  }

  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one number',
    }
  }

  return { valid: true }
}
