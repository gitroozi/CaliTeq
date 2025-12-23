/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Sanitize email (lowercase, trim)
 */
export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim()
}
