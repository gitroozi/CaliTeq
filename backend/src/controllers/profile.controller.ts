import { Response } from 'express';
import { AuthRequest } from '../types/express';
import profileService, { CreateProfileData, UpdateProfileData } from '../services/profile.service';

// =====================================================
// PROFILE CONTROLLER
// =====================================================

/**
 * Get current user's profile
 * GET /api/users/profile
 */
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    const profile = await profileService.getProfile(userId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch profile',
    });
  }
};

/**
 * Create or update user profile
 * POST /api/users/profile
 */
export const createProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    const profileData: CreateProfileData = req.body;

    // Basic validation
    const errors = validateProfileData(profileData);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors,
      });
    }

    const profile = await profileService.createOrUpdateProfile(userId, profileData);

    return res.status(201).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error('Create profile error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create profile',
    });
  }
};

/**
 * Update user profile
 * PUT /api/users/profile
 */
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    const profileData: UpdateProfileData = req.body;

    // Basic validation (less strict for updates)
    const errors = validateProfileData(profileData, true);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors,
      });
    }

    const profile = await profileService.updateProfile(userId, profileData);

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update profile',
    });
  }
};

/**
 * Check if profile is complete
 * GET /api/users/profile/complete
 */
export const checkProfileComplete = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    const isComplete = await profileService.isProfileComplete(userId);

    return res.status(200).json({
      success: true,
      data: {
        isComplete,
      },
    });
  } catch (error) {
    console.error('Check profile complete error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to check profile status',
    });
  }
};

/**
 * Delete user profile
 * DELETE /api/users/profile
 */
export const deleteProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    await profileService.deleteProfile(userId);

    return res.status(200).json({
      success: true,
      message: 'Profile deleted successfully',
    });
  } catch (error) {
    console.error('Delete profile error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete profile',
    });
  }
};

// =====================================================
// VALIDATION HELPERS
// =====================================================

function validateProfileData(data: CreateProfileData | UpdateProfileData, isUpdate = false): string[] {
  const errors: string[] = [];

  // Age validation (if dateOfBirth provided)
  if (data.dateOfBirth) {
    const dob = new Date(data.dateOfBirth);
    const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

    if (isNaN(age) || age < 13 || age > 100) {
      errors.push('Age must be between 13 and 100 years');
    }
  }

  // Gender validation
  if (data.gender) {
    const validGenders = ['male', 'female', 'other', 'prefer_not_to_say'];
    if (!validGenders.includes(data.gender.toLowerCase())) {
      errors.push('Invalid gender value');
    }
  }

  // Height validation
  if (data.heightCm !== undefined) {
    if (data.heightCm < 100 || data.heightCm > 250) {
      errors.push('Height must be between 100 and 250 cm');
    }
  }

  // Weight validation
  if (data.currentWeightKg !== undefined) {
    if (data.currentWeightKg < 30 || data.currentWeightKg > 300) {
      errors.push('Current weight must be between 30 and 300 kg');
    }
  }

  if (data.targetWeightKg !== undefined) {
    if (data.targetWeightKg < 30 || data.targetWeightKg > 300) {
      errors.push('Target weight must be between 30 and 300 kg');
    }
  }

  // Training experience validation
  if (data.trainingExperience) {
    const validExperience = ['never', 'beginner', 'intermediate', 'advanced'];
    if (!validExperience.includes(data.trainingExperience)) {
      errors.push('Invalid training experience level');
    }
  }

  // Activity level validation
  if (data.activityLevel) {
    const validActivityLevels = [
      'sedentary',
      'lightly_active',
      'moderately_active',
      'very_active',
      'extremely_active',
    ];
    if (!validActivityLevels.includes(data.activityLevel)) {
      errors.push('Invalid activity level');
    }
  }

  // Days per week validation
  if (data.daysPerWeek !== undefined) {
    if (data.daysPerWeek < 1 || data.daysPerWeek > 7) {
      errors.push('Days per week must be between 1 and 7');
    }
  }

  // Minutes per session validation
  if (data.minutesPerSession !== undefined) {
    if (data.minutesPerSession < 10 || data.minutesPerSession > 180) {
      errors.push('Minutes per session must be between 10 and 180');
    }
  }

  // Goals validation
  if (data.goals) {
    if (!Array.isArray(data.goals)) {
      errors.push('Goals must be an array');
    } else {
      const validGoals = [
        'fat_loss',
        'muscle_gain',
        'strength',
        'endurance',
        'flexibility',
        'general_fitness',
        'athletic_performance',
      ];
      const invalidGoals = data.goals.filter((goal) => !validGoals.includes(goal));
      if (invalidGoals.length > 0) {
        errors.push(`Invalid goals: ${invalidGoals.join(', ')}`);
      }
    }
  }

  // Assessment scores validation
  if (data.assessmentScores) {
    const scores = data.assessmentScores;
    const scoreFields = ['pushLevel', 'pullLevel', 'squatLevel', 'hingeLevel', 'coreLevel'];

    scoreFields.forEach((field) => {
      const value = scores[field as keyof typeof scores];
      if (value !== undefined && (value < 1 || value > 10)) {
        errors.push(`${field} must be between 1 and 10`);
      }
    });
  }

  // Equipment validation
  if (data.equipment) {
    const allowedKeys = ['pullUpBar', 'dipBars', 'resistanceBands', 'elevatedSurface', 'other'];
    const invalidKeys = Object.keys(data.equipment).filter((key) => !allowedKeys.includes(key));

    if (invalidKeys.length > 0) {
      errors.push(`Invalid equipment fields: ${invalidKeys.join(', ')}`);
    }

    // Validate 'other' is an array if provided
    if (data.equipment.other && !Array.isArray(data.equipment.other)) {
      errors.push('Equipment.other must be an array');
    }
  }

  // Injuries validation
  if (data.injuries) {
    if (!Array.isArray(data.injuries)) {
      errors.push('Injuries must be an array');
    } else {
      data.injuries.forEach((injury, index) => {
        if (!injury.type || typeof injury.type !== 'string') {
          errors.push(`Injury ${index + 1}: type is required`);
        }
        if (!injury.severity || typeof injury.severity !== 'string') {
          errors.push(`Injury ${index + 1}: severity is required`);
        }
      });
    }
  }

  // Medical conditions validation
  if (data.medicalConditions) {
    if (!Array.isArray(data.medicalConditions)) {
      errors.push('Medical conditions must be an array');
    }
  }

  return errors;
}
