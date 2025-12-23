import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// =====================================================
// TYPES & INTERFACES
// =====================================================

export interface CreateProfileData {
  // Basic info (stored in User table)
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string; // ISO date string
  gender?: string;
  heightCm?: number;
  currentWeightKg?: number;
  targetWeightKg?: number;

  // Extended profile (stored in UserProfile table)
  trainingExperience?: 'never' | 'beginner' | 'intermediate' | 'advanced';
  activityLevel?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  goals?: string[]; // e.g., ['fat_loss', 'muscle_gain', 'strength', 'endurance']
  daysPerWeek?: number;
  minutesPerSession?: number;
  injuries?: Array<{
    type: string;
    severity: string;
    description?: string;
  }>;
  medicalConditions?: string[];
  exerciseClearance?: boolean;
  equipment?: {
    pullUpBar?: boolean;
    dipBars?: boolean;
    resistanceBands?: boolean;
    elevatedSurface?: boolean;
    other?: string[];
  };
  assessmentScores?: {
    pushLevel?: number; // 1-10
    pullLevel?: number;
    squatLevel?: number;
    hingeLevel?: number;
    coreLevel?: number;
  };
}

export interface UpdateProfileData extends Partial<CreateProfileData> {}

export interface ProfileResponse {
  id: string;
  userId: string;

  // Basic info
  firstName?: string | null;
  lastName?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  heightCm?: number | null;
  currentWeightKg?: number | null;
  targetWeightKg?: number | null;

  // Extended profile
  trainingExperience?: string | null;
  activityLevel?: string | null;
  goals: any;
  daysPerWeek?: number | null;
  minutesPerSession?: number | null;
  injuries: any;
  medicalConditions: string[];
  exerciseClearance: boolean;
  equipment: any;
  assessmentScores: any;

  createdAt: Date;
  updatedAt: Date;
}

// =====================================================
// PROFILE SERVICE
// =====================================================

export class ProfileService {
  /**
   * Get user profile by user ID
   */
  async getProfile(userId: string): Promise<ProfileResponse | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
      },
    });

    if (!user) {
      return null;
    }

    // If user exists but profile doesn't, return user data with empty profile
    if (!user.profile) {
      return {
        id: '', // No profile ID yet
        userId: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        dateOfBirth: user.date_of_birth?.toISOString().split('T')[0] || null,
        gender: user.gender,
        heightCm: user.height_cm ? Number(user.height_cm) : null,
        currentWeightKg: user.current_weight_kg ? Number(user.current_weight_kg) : null,
        targetWeightKg: user.target_weight_kg ? Number(user.target_weight_kg) : null,
        trainingExperience: null,
        activityLevel: null,
        goals: [],
        daysPerWeek: null,
        minutesPerSession: null,
        injuries: [],
        medicalConditions: [],
        exerciseClearance: false,
        equipment: {
          pullUpBar: false,
          dipBars: false,
          resistanceBands: false,
          elevatedSurface: true,
          other: [],
        },
        assessmentScores: {
          pushLevel: 1,
          pullLevel: 1,
          squatLevel: 1,
          hingeLevel: 1,
          coreLevel: 1,
        },
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      };
    }

    return {
      id: user.profile.id,
      userId: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      dateOfBirth: user.date_of_birth?.toISOString().split('T')[0] || null,
      gender: user.gender,
      heightCm: user.height_cm ? Number(user.height_cm) : null,
      currentWeightKg: user.current_weight_kg ? Number(user.current_weight_kg) : null,
      targetWeightKg: user.target_weight_kg ? Number(user.target_weight_kg) : null,
      trainingExperience: user.profile.training_experience,
      activityLevel: user.profile.activity_level,
      goals: user.profile.goals,
      daysPerWeek: user.profile.days_per_week,
      minutesPerSession: user.profile.minutes_per_session,
      injuries: user.profile.injuries,
      medicalConditions: user.profile.medical_conditions,
      exerciseClearance: user.profile.exercise_clearance,
      equipment: user.profile.equipment,
      assessmentScores: user.profile.assessment_scores,
      createdAt: user.profile.created_at,
      updatedAt: user.profile.updated_at,
    };
  }

  /**
   * Create or update user profile
   */
  async createOrUpdateProfile(
    userId: string,
    data: CreateProfileData
  ): Promise<ProfileResponse> {
    // Update User table fields
    const userUpdateData: Prisma.UserUpdateInput = {};

    if (data.firstName !== undefined) userUpdateData.first_name = data.firstName;
    if (data.lastName !== undefined) userUpdateData.last_name = data.lastName;
    if (data.dateOfBirth !== undefined) {
      userUpdateData.date_of_birth = data.dateOfBirth ? new Date(data.dateOfBirth) : null;
    }
    if (data.gender !== undefined) userUpdateData.gender = data.gender;
    if (data.heightCm !== undefined) userUpdateData.height_cm = data.heightCm;
    if (data.currentWeightKg !== undefined) userUpdateData.current_weight_kg = data.currentWeightKg;
    if (data.targetWeightKg !== undefined) userUpdateData.target_weight_kg = data.targetWeightKg;

    // Update UserProfile table fields
    const profileData: any = {};

    if (data.trainingExperience !== undefined) profileData.training_experience = data.trainingExperience;
    if (data.activityLevel !== undefined) profileData.activity_level = data.activityLevel;
    if (data.goals !== undefined) profileData.goals = data.goals;
    if (data.daysPerWeek !== undefined) profileData.days_per_week = data.daysPerWeek;
    if (data.minutesPerSession !== undefined) profileData.minutes_per_session = data.minutesPerSession;
    if (data.injuries !== undefined) profileData.injuries = data.injuries;
    if (data.medicalConditions !== undefined) profileData.medical_conditions = data.medicalConditions;
    if (data.exerciseClearance !== undefined) profileData.exercise_clearance = data.exerciseClearance;
    if (data.equipment !== undefined) profileData.equipment = data.equipment;
    if (data.assessmentScores !== undefined) profileData.assessment_scores = data.assessmentScores;

    // Use transaction to update both tables
    const result = await prisma.$transaction(async (tx) => {
      // Update User table if there's data
      if (Object.keys(userUpdateData).length > 0) {
        await tx.user.update({
          where: { id: userId },
          data: userUpdateData,
        });
      }

      // Upsert UserProfile
      const profile = await tx.userProfile.upsert({
        where: { user_id: userId },
        create: {
          user_id: userId,
          ...profileData,
        },
        update: profileData,
      });

      // Fetch complete user with profile
      const user = await tx.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
        },
      });

      return user;
    });

    if (!result || !result.profile) {
      throw new Error('Failed to create/update profile');
    }

    return {
      id: result.profile.id,
      userId: result.id,
      firstName: result.first_name,
      lastName: result.last_name,
      dateOfBirth: result.date_of_birth?.toISOString().split('T')[0] || null,
      gender: result.gender,
      heightCm: result.height_cm ? Number(result.height_cm) : null,
      currentWeightKg: result.current_weight_kg ? Number(result.current_weight_kg) : null,
      targetWeightKg: result.target_weight_kg ? Number(result.target_weight_kg) : null,
      trainingExperience: result.profile.training_experience,
      activityLevel: result.profile.activity_level,
      goals: result.profile.goals,
      daysPerWeek: result.profile.days_per_week,
      minutesPerSession: result.profile.minutes_per_session,
      injuries: result.profile.injuries,
      medicalConditions: result.profile.medical_conditions,
      exerciseClearance: result.profile.exercise_clearance,
      equipment: result.profile.equipment,
      assessmentScores: result.profile.assessment_scores,
      createdAt: result.profile.created_at,
      updatedAt: result.profile.updated_at,
    };
  }

  /**
   * Update existing profile
   */
  async updateProfile(
    userId: string,
    data: UpdateProfileData
  ): Promise<ProfileResponse> {
    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Use the same method as create
    return this.createOrUpdateProfile(userId, data);
  }

  /**
   * Check if user has completed their profile
   */
  async isProfileComplete(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      return false;
    }

    // Check required fields
    const hasBasicInfo = !!(
      user.first_name &&
      user.date_of_birth &&
      user.gender &&
      user.height_cm &&
      user.current_weight_kg
    );

    const hasTrainingInfo = !!(
      user.profile.training_experience &&
      user.profile.activity_level &&
      user.profile.days_per_week &&
      user.profile.minutes_per_session
    );

    const hasGoals = Array.isArray(user.profile.goals) && user.profile.goals.length > 0;

    return hasBasicInfo && hasTrainingInfo && hasGoals;
  }

  /**
   * Delete user profile (cascade will handle UserProfile)
   */
  async deleteProfile(userId: string): Promise<void> {
    await prisma.userProfile.delete({
      where: { user_id: userId },
    });
  }
}

export default new ProfileService();
