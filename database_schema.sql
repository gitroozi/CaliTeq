-- =====================================================
-- CALISTHENICS WORKOUT APP - DATABASE SCHEMA
-- =====================================================
-- Database: PostgreSQL 15+
-- ORM: Prisma (Node.js) or SQLAlchemy (Python)
-- Features: JSONB for flexible data, UUID primary keys, timestamps, indexes
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS & AUTHENTICATION
-- =====================================================

-- Users table (core authentication and profile)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,

    -- Profile information
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    gender VARCHAR(50), -- 'male', 'female', 'other', 'prefer_not_to_say'

    -- Physical metrics (current)
    height_cm DECIMAL(5,2), -- e.g., 178.5
    current_weight_kg DECIMAL(5,2), -- e.g., 89.5
    target_weight_kg DECIMAL(5,2), -- optional

    -- Account status
    email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    subscription_tier VARCHAR(50) DEFAULT 'free', -- 'free', 'premium'
    subscription_expires_at TIMESTAMP,

    -- Preferences (stored as JSONB for flexibility)
    preferences JSONB DEFAULT '{
        "units": "metric",
        "notifications": true,
        "theme": "light",
        "language": "en"
    }'::jsonb,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,

    -- Soft delete
    deleted_at TIMESTAMP
);

-- Indexes for users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription_tier ON users(subscription_tier);
CREATE INDEX idx_users_created_at ON users(created_at);

-- User profiles (extended information)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Training background
    training_experience VARCHAR(50), -- 'never', 'beginner', 'intermediate', 'advanced'
    activity_level VARCHAR(50), -- 'sedentary', 'lightly_active', 'moderately_active', 'very_active'

    -- Goals (array of goal types, ordered by priority)
    goals JSONB DEFAULT '[]'::jsonb,
    -- Example: [{"type": "fat_loss", "priority": 1}, {"type": "strength", "priority": 2}]

    -- Availability
    days_per_week INTEGER CHECK (days_per_week BETWEEN 1 AND 7),
    minutes_per_session INTEGER CHECK (minutes_per_session BETWEEN 15 AND 180),

    -- Medical information
    injuries JSONB DEFAULT '[]'::jsonb,
    -- Example: [{"bodyPart": "cervical spine", "description": "C4-C5 disc issue", "contraindications": ["headstands"]}]

    medical_conditions TEXT[],
    exercise_clearance BOOLEAN DEFAULT FALSE,

    -- Equipment availability
    equipment JSONB DEFAULT '{
        "pullUpBar": false,
        "dipBars": false,
        "resistanceBands": false,
        "elevatedSurface": true,
        "other": []
    }'::jsonb,

    -- Movement assessment scores (1-10 scale)
    assessment_scores JSONB DEFAULT '{
        "pushLevel": 1,
        "pullLevel": 1,
        "squatLevel": 1,
        "hingeLevel": 1,
        "coreLevel": 1
    }'::jsonb,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- =====================================================
-- EXERCISE LIBRARY
-- =====================================================

-- Exercise categories (movement patterns)
CREATE TABLE movement_patterns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL, -- e.g., "horizontal_push"
    display_name VARCHAR(100) NOT NULL, -- e.g., "Horizontal Push"
    category VARCHAR(50) NOT NULL, -- 'primary', 'secondary', 'skill_based', 'auxiliary'
    description TEXT,
    sort_order INTEGER,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exercises table (comprehensive library)
CREATE TABLE exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL, -- URL-friendly, e.g., "standard-push-ups"

    -- Classification
    movement_pattern_id UUID NOT NULL REFERENCES movement_patterns(id),
    difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 10), -- 1 = easiest, 10 = hardest

    -- Content
    description TEXT, -- Markdown format
    video_url VARCHAR(500), -- Primary video URL (YouTube, Vimeo, or S3)
    thumbnail_url VARCHAR(500),
    video_urls JSONB DEFAULT '[]'::jsonb, -- Additional angles: [{"angle": "side", "url": "..."}]

    -- Detailed instructions
    setup_instructions TEXT,
    execution_instructions TEXT,
    common_mistakes TEXT[], -- Array of common errors
    coaching_cues TEXT[], -- Array of coaching points
    target_muscles TEXT[], -- e.g., ["pectoralis", "triceps", "anterior deltoid"]

    -- Progression pathway
    regression_id UUID REFERENCES exercises(id), -- Easier variation
    progression_id UUID REFERENCES exercises(id), -- Harder variation
    alternative_ids UUID[], -- Alternative exercises at same difficulty

    -- Requirements
    equipment_required TEXT[], -- e.g., ["pull_up_bar", "dip_bars"]
    contraindications TEXT[], -- When to avoid, e.g., ["cervical_disc_issues"]

    -- Modifications (JSONB for flexible structure)
    modifications JSONB DEFAULT '[]'::jsonb,
    -- Example: [{"condition": "cervical issues", "modification": "Keep neutral neck"}]

    -- Metadata
    tags TEXT[], -- e.g., ["compound", "bodyweight", "chest"]
    estimated_time_to_master_weeks INTEGER, -- Average time to master this level

    -- Status
    is_published BOOLEAN DEFAULT TRUE,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for exercises
CREATE INDEX idx_exercises_movement_pattern ON exercises(movement_pattern_id);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty);
CREATE INDEX idx_exercises_slug ON exercises(slug);
CREATE INDEX idx_exercises_tags ON exercises USING GIN(tags);
CREATE INDEX idx_exercises_equipment ON exercises USING GIN(equipment_required);

-- Exercise progression relationships (for easier querying)
CREATE TABLE exercise_progressions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    to_exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    progression_type VARCHAR(50) NOT NULL, -- 'regression', 'progression', 'alternative'

    UNIQUE(from_exercise_id, to_exercise_id, progression_type)
);

CREATE INDEX idx_exercise_progressions_from ON exercise_progressions(from_exercise_id);
CREATE INDEX idx_exercise_progressions_to ON exercise_progressions(to_exercise_id);

-- =====================================================
-- WORKOUT PLANS & SESSIONS
-- =====================================================

-- Workout plans (12-week programs)
CREATE TABLE workout_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Plan metadata
    name VARCHAR(255) NOT NULL, -- e.g., "12-Week Strength Foundation"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL, -- Typically start_date + 12 weeks

    -- Structure
    duration_weeks INTEGER DEFAULT 12,
    frequency INTEGER CHECK (frequency BETWEEN 2 AND 7), -- Sessions per week
    split_type VARCHAR(50), -- 'full_body', 'upper_lower', 'push_pull_legs'

    -- Periodization (JSONB for flexible mesocycle definition)
    mesocycles JSONB NOT NULL,
    -- Example: [{"name": "Anatomical Adaptation", "startWeek": 1, "endWeek": 3, "focus": "...", "repRange": "12-15", "sets": 3}]

    deload_weeks INTEGER[], -- e.g., [4, 8, 12]

    -- AI context
    generation_prompt TEXT, -- Original user context/input
    ai_explanation TEXT, -- Why this plan was generated

    -- Status
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'completed', 'paused', 'cancelled'

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for workout plans
CREATE INDEX idx_workout_plans_user_id ON workout_plans(user_id);
CREATE INDEX idx_workout_plans_status ON workout_plans(status);
CREATE INDEX idx_workout_plans_start_date ON workout_plans(start_date);

-- Workout sessions (individual workouts within a plan)
CREATE TABLE workout_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workout_plan_id UUID NOT NULL REFERENCES workout_plans(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Schedule
    week_number INTEGER NOT NULL CHECK (week_number BETWEEN 1 AND 52),
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 7), -- 1 = Monday
    session_number INTEGER NOT NULL, -- Which session this week (1-5)
    scheduled_date DATE NOT NULL,

    -- Workout details
    name VARCHAR(255) NOT NULL, -- e.g., "Week 1 - Full Body A"
    is_deload BOOLEAN DEFAULT FALSE,

    -- Warm-up (JSONB array)
    warmup JSONB DEFAULT '[]'::jsonb,
    -- Example: [{"name": "Joint rotations", "duration": "3 minutes"}]

    -- Cool-down (JSONB array)
    cooldown JSONB DEFAULT '[]'::jsonb,

    -- Status
    status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'in_progress', 'completed', 'skipped'
    completed_at TIMESTAMP,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for workout sessions
CREATE INDEX idx_workout_sessions_plan_id ON workout_sessions(workout_plan_id);
CREATE INDEX idx_workout_sessions_user_id ON workout_sessions(user_id);
CREATE INDEX idx_workout_sessions_scheduled_date ON workout_sessions(scheduled_date);
CREATE INDEX idx_workout_sessions_status ON workout_sessions(status);

-- Workout session exercises (the exercises within a session)
CREATE TABLE workout_session_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workout_session_id UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id),

    -- Order and prescription
    exercise_order INTEGER NOT NULL, -- 1, 2, 3, etc.
    sets INTEGER NOT NULL CHECK (sets > 0),
    reps VARCHAR(50) NOT NULL, -- "8-12" or "AMRAP" or "30s hold"
    rest_seconds INTEGER,
    tempo VARCHAR(20), -- e.g., "3-1-1-0" (eccentric-pause-concentric-pause)

    -- AI-generated notes
    coaching_notes TEXT,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for workout session exercises
CREATE INDEX idx_wse_session_id ON workout_session_exercises(workout_session_id);
CREATE INDEX idx_wse_exercise_id ON workout_session_exercises(exercise_id);
CREATE INDEX idx_wse_order ON workout_session_exercises(workout_session_id, exercise_order);

-- =====================================================
-- WORKOUT LOGS & PROGRESS
-- =====================================================

-- Workout logs (completed workouts)
CREATE TABLE workout_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    workout_session_id UUID REFERENCES workout_sessions(id) ON DELETE SET NULL, -- Can be null for custom workouts

    -- Session timing
    started_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP NOT NULL,
    duration_minutes INTEGER GENERATED ALWAYS AS (
        EXTRACT(EPOCH FROM (completed_at - started_at)) / 60
    ) STORED,

    -- Subjective feedback (1-10 scale)
    overall_difficulty INTEGER CHECK (overall_difficulty BETWEEN 1 AND 10),
    energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
    enjoyment INTEGER CHECK (enjoyment BETWEEN 1 AND 10),
    notes TEXT,

    -- Pain/issues (JSONB array)
    pain_reports JSONB DEFAULT '[]'::jsonb,
    -- Example: [{"bodyPart": "right shoulder", "severity": 5, "description": "Sharp pain during pull-ups"}]

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for workout logs
CREATE INDEX idx_workout_logs_user_id ON workout_logs(user_id);
CREATE INDEX idx_workout_logs_session_id ON workout_logs(workout_session_id);
CREATE INDEX idx_workout_logs_started_at ON workout_logs(started_at);

-- Exercise logs (performance data for each exercise in a workout)
CREATE TABLE exercise_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workout_log_id UUID NOT NULL REFERENCES workout_logs(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id),

    -- Set-by-set performance (JSONB array)
    sets JSONB NOT NULL,
    -- Example: [
    --   {"setNumber": 1, "repsCompleted": 12, "targetReps": "10-12", "rpe": 8, "notes": ""},
    --   {"setNumber": 2, "repsCompleted": 10, "targetReps": "10-12", "rpe": 9, "notes": "Struggled"}
    -- ]

    -- Aggregate stats (computed from sets)
    total_reps INTEGER,
    max_reps INTEGER, -- Best set
    avg_rpe DECIMAL(3,1), -- Average RPE across sets

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for exercise logs
CREATE INDEX idx_exercise_logs_workout_log_id ON exercise_logs(workout_log_id);
CREATE INDEX idx_exercise_logs_exercise_id ON exercise_logs(exercise_id);

-- Progress metrics (body measurements, wellness, etc.)
CREATE TABLE progress_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Timestamp
    recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Metric type
    metric_type VARCHAR(50) NOT NULL, -- 'weight', 'waist', 'body_fat', 'rep_max', 'photo', 'wellness'

    -- Data (JSONB for polymorphic storage)
    data JSONB NOT NULL,
    -- Examples:
    -- Weight: {"weight": 89.5}
    -- Waist: {"waistCircumference": 95.5}
    -- Body fat: {"bodyFatPercentage": 22.5}
    -- Rep max: {"exerciseId": "uuid", "reps": 15}
    -- Photo: {"photoUrl": "s3://...", "photoType": "front"}
    -- Wellness: {"sleepQuality": 8, "energyLevel": 7, "soreness": 4, "mood": 8, "restingHeartRate": 62}

    -- Notes
    notes TEXT,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for progress metrics
CREATE INDEX idx_progress_metrics_user_id ON progress_metrics(user_id);
CREATE INDEX idx_progress_metrics_type ON progress_metrics(metric_type);
CREATE INDEX idx_progress_metrics_recorded_at ON progress_metrics(recorded_at);
CREATE INDEX idx_progress_metrics_user_type_date ON progress_metrics(user_id, metric_type, recorded_at);

-- Progress photos (dedicated table for better querying)
CREATE TABLE progress_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Photo details
    photo_url VARCHAR(500) NOT NULL, -- S3 or Cloudinary URL
    photo_type VARCHAR(50) NOT NULL, -- 'front', 'side', 'back'
    thumbnail_url VARCHAR(500),

    -- Encryption (if storing encrypted photos)
    is_encrypted BOOLEAN DEFAULT FALSE,
    encryption_key_id VARCHAR(255), -- Reference to encryption key

    -- Associated weight (at time of photo)
    weight_kg DECIMAL(5,2),

    -- Visibility
    is_public BOOLEAN DEFAULT FALSE,

    -- Timestamps
    taken_at TIMESTAMP NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Soft delete
    deleted_at TIMESTAMP
);

-- Indexes for progress photos
CREATE INDEX idx_progress_photos_user_id ON progress_photos(user_id);
CREATE INDEX idx_progress_photos_taken_at ON progress_photos(taken_at);
CREATE INDEX idx_progress_photos_type ON progress_photos(photo_type);

-- =====================================================
-- NUTRITION
-- =====================================================

-- Nutrition plans
CREATE TABLE nutrition_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Calculations
    tdee INTEGER NOT NULL, -- Total Daily Energy Expenditure (kcal)
    target_calories INTEGER NOT NULL, -- TDEE +/- deficit/surplus
    deficit_surplus INTEGER NOT NULL, -- Negative for deficit, positive for surplus

    -- Macros (grams)
    protein_grams INTEGER NOT NULL,
    fat_grams INTEGER NOT NULL,
    carbs_grams INTEGER NOT NULL,

    -- Meal structure
    meals_per_day INTEGER DEFAULT 3,
    protein_per_meal INTEGER, -- Average grams

    -- Recommendations (text fields)
    pre_sleep_protein VARCHAR(255), -- e.g., "30-40g casein"
    pre_workout_carbs VARCHAR(255),
    post_workout_protein VARCHAR(255),

    -- Supplements (JSONB array)
    supplements JSONB DEFAULT '[]'::jsonb,
    -- Example: [{"name": "Creatine", "dosage": "5g", "timing": "Daily", "tier": 1}]

    -- Hydration
    daily_water_liters DECIMAL(3,1),

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_nutrition_plans_user_id ON nutrition_plans(user_id);

-- Meal plans (optional, for users who want structured meal planning)
CREATE TABLE meal_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nutrition_plan_id UUID NOT NULL REFERENCES nutrition_plans(id) ON DELETE CASCADE,

    -- Plan details
    name VARCHAR(255) NOT NULL, -- e.g., "Week 1 Meal Plan"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,

    -- Meals (JSONB array of daily meal structures)
    meals JSONB NOT NULL,
    -- Example: {
    --   "monday": [
    --     {"meal": "breakfast", "foods": [...], "calories": 450, "protein": 35, "fat": 15, "carbs": 40},
    --     {"meal": "lunch", ...}
    --   ],
    --   "tuesday": [...]
    -- }

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_meal_plans_user_id ON meal_plans(user_id);
CREATE INDEX idx_meal_plans_nutrition_plan ON meal_plans(nutrition_plan_id);

-- =====================================================
-- AI INTERACTIONS
-- =====================================================

-- AI chat history (for AI coach conversations)
CREATE TABLE ai_chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Message content
    role VARCHAR(50) NOT NULL, -- 'user' or 'assistant'
    content TEXT NOT NULL,

    -- Context (what was the user asking about?)
    context_type VARCHAR(50), -- 'workout', 'exercise', 'nutrition', 'general'
    context_id UUID, -- Reference to workout, exercise, etc.

    -- AI model used
    model VARCHAR(100), -- e.g., "gpt-4", "claude-sonnet-3.5"
    tokens_used INTEGER,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for AI chat
CREATE INDEX idx_ai_chat_user_id ON ai_chat_messages(user_id);
CREATE INDEX idx_ai_chat_created_at ON ai_chat_messages(created_at);

-- AI-generated content cache (to avoid regenerating same content)
CREATE TABLE ai_content_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Cache key (hash of input)
    cache_key VARCHAR(255) UNIQUE NOT NULL,

    -- Content
    content_type VARCHAR(50) NOT NULL, -- 'workout_explanation', 'exercise_cue', etc.
    content TEXT NOT NULL,

    -- Metadata
    model VARCHAR(100),
    tokens_used INTEGER,

    -- Expiration
    expires_at TIMESTAMP,

    -- Usage tracking
    hit_count INTEGER DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_cache_key ON ai_content_cache(cache_key);
CREATE INDEX idx_ai_cache_expires ON ai_content_cache(expires_at);

-- =====================================================
-- CHECK-INS & ASSESSMENTS
-- =====================================================

-- User check-ins (periodic assessments)
CREATE TABLE check_ins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    workout_plan_id UUID REFERENCES workout_plans(id) ON DELETE SET NULL,

    -- Check-in timing
    check_in_date DATE NOT NULL,
    week_number INTEGER, -- Which week of the program

    -- Survey responses (JSONB for flexibility)
    responses JSONB NOT NULL,
    -- Example: {
    --   "overallFeeling": 8,
    --   "recoveryQuality": 7,
    --   "motivationLevel": 9,
    --   "newPainOrInjury": false,
    --   "goalsSame": true,
    --   "feedbackText": "Feeling great, workouts are challenging but doable"
    -- }

    -- AI analysis and recommendations
    ai_analysis TEXT,
    recommendations JSONB, -- Structured recommendations from AI

    -- Actions taken
    plan_adjusted BOOLEAN DEFAULT FALSE,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for check-ins
CREATE INDEX idx_check_ins_user_id ON check_ins(user_id);
CREATE INDEX idx_check_ins_date ON check_ins(check_in_date);

-- =====================================================
-- SUBSCRIPTIONS & PAYMENTS
-- =====================================================

-- Subscriptions (Stripe integration)
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Stripe details
    stripe_customer_id VARCHAR(255) UNIQUE,
    stripe_subscription_id VARCHAR(255) UNIQUE,

    -- Subscription details
    tier VARCHAR(50) NOT NULL, -- 'free', 'premium'
    status VARCHAR(50) NOT NULL, -- 'active', 'cancelled', 'past_due', 'trialing'

    -- Billing
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,

    -- Pricing
    price_amount INTEGER, -- Amount in cents
    currency VARCHAR(10) DEFAULT 'USD',

    -- Trial
    trial_start TIMESTAMP,
    trial_end TIMESTAMP,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Payment history
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,

    -- Stripe details
    stripe_payment_intent_id VARCHAR(255) UNIQUE,
    stripe_charge_id VARCHAR(255),

    -- Payment details
    amount INTEGER NOT NULL, -- Amount in cents
    currency VARCHAR(10) DEFAULT 'USD',
    status VARCHAR(50) NOT NULL, -- 'succeeded', 'failed', 'pending', 'refunded'

    -- Metadata
    description TEXT,
    receipt_url VARCHAR(500),

    -- Timestamps
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_stripe_intent ON payments(stripe_payment_intent_id);

-- =====================================================
-- ACHIEVEMENTS & GAMIFICATION
-- =====================================================

-- Achievements definition
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Achievement details
    name VARCHAR(255) UNIQUE NOT NULL, -- e.g., "first_pull_up"
    display_name VARCHAR(255) NOT NULL, -- e.g., "First Pull-up"
    description TEXT,
    icon_url VARCHAR(500),

    -- Category
    category VARCHAR(50), -- 'milestone', 'consistency', 'strength', 'skill'

    -- Criteria (JSONB for flexible conditions)
    criteria JSONB NOT NULL,
    -- Example: {"type": "rep_max", "exerciseId": "uuid", "minReps": 1}
    -- Example: {"type": "workout_count", "count": 100}
    -- Example: {"type": "streak", "days": 30}

    -- Rarity
    rarity VARCHAR(50), -- 'common', 'uncommon', 'rare', 'epic', 'legendary'
    points INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User achievements (unlocked achievements)
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,

    -- Progress
    progress DECIMAL(5,2) DEFAULT 0, -- Percentage (0-100)

    -- Unlock
    unlocked BOOLEAN DEFAULT FALSE,
    unlocked_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_unlocked ON user_achievements(user_id, unlocked);

-- =====================================================
-- SOCIAL FEATURES (Future Phase)
-- =====================================================

-- User follows (social connections)
CREATE TABLE user_follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);

CREATE INDEX idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX idx_user_follows_following ON user_follows(following_id);

-- Workout shares (shared workouts)
CREATE TABLE workout_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    workout_log_id UUID NOT NULL REFERENCES workout_logs(id) ON DELETE CASCADE,

    -- Share details
    share_type VARCHAR(50) DEFAULT 'public', -- 'public', 'friends', 'private'
    caption TEXT,

    -- Engagement
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_workout_shares_user_id ON workout_shares(user_id);

-- =====================================================
-- SYSTEM TABLES
-- =====================================================

-- Migrations tracking (for schema versioning)
CREATE TABLE schema_migrations (
    version VARCHAR(255) PRIMARY KEY,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit log (for important events)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,

    -- Event details
    event_type VARCHAR(100) NOT NULL, -- 'user_created', 'subscription_changed', 'workout_completed', etc.
    entity_type VARCHAR(100), -- 'user', 'workout', 'subscription'
    entity_id UUID,

    -- Changes (before/after)
    old_values JSONB,
    new_values JSONB,

    -- Context
    ip_address INET,
    user_agent TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_event_type ON audit_logs(event_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercises_updated_at BEFORE UPDATE ON exercises
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_plans_updated_at BEFORE UPDATE ON workout_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_sessions_updated_at BEFORE UPDATE ON workout_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nutrition_plans_updated_at BEFORE UPDATE ON nutrition_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate user streak
CREATE OR REPLACE FUNCTION calculate_user_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    current_streak INTEGER := 0;
    last_workout_date DATE;
    check_date DATE;
BEGIN
    -- Get most recent workout date
    SELECT DATE(completed_at) INTO last_workout_date
    FROM workout_logs
    WHERE user_id = p_user_id AND completed_at IS NOT NULL
    ORDER BY completed_at DESC
    LIMIT 1;

    IF last_workout_date IS NULL THEN
        RETURN 0;
    END IF;

    -- If last workout was not yesterday or today, streak is broken
    IF last_workout_date < CURRENT_DATE - INTERVAL '1 day' THEN
        RETURN 0;
    END IF;

    -- Count consecutive days
    check_date := last_workout_date;
    WHILE EXISTS (
        SELECT 1 FROM workout_logs
        WHERE user_id = p_user_id
        AND DATE(completed_at) = check_date
    ) LOOP
        current_streak := current_streak + 1;
        check_date := check_date - INTERVAL '1 day';
    END LOOP;

    RETURN current_streak;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VIEWS (for common queries)
-- =====================================================

-- User stats view (aggregated user statistics)
CREATE VIEW user_stats AS
SELECT
    u.id AS user_id,
    u.email,
    u.first_name,
    u.last_name,
    u.subscription_tier,

    -- Workout stats
    COUNT(DISTINCT wl.id) AS total_workouts_completed,
    COUNT(DISTINCT DATE(wl.completed_at)) AS total_workout_days,
    MAX(wl.completed_at) AS last_workout_date,
    calculate_user_streak(u.id) AS current_streak,

    -- Progress
    (SELECT current_weight_kg FROM users WHERE id = u.id) AS current_weight,
    (SELECT target_weight_kg FROM users WHERE id = u.id) AS target_weight,

    -- Subscription
    u.created_at AS member_since

FROM users u
LEFT JOIN workout_logs wl ON wl.user_id = u.id
WHERE u.deleted_at IS NULL
GROUP BY u.id;

-- Exercise performance view (track rep maxes over time)
CREATE VIEW exercise_rep_maxes AS
SELECT
    el.exercise_id,
    e.name AS exercise_name,
    wl.user_id,
    el.max_reps,
    DATE(wl.completed_at) AS workout_date,
    ROW_NUMBER() OVER (PARTITION BY wl.user_id, el.exercise_id ORDER BY wl.completed_at DESC) AS rank
FROM exercise_logs el
JOIN workout_logs wl ON wl.id = el.workout_log_id
JOIN exercises e ON e.id = el.exercise_id
WHERE wl.completed_at IS NOT NULL;

-- Recent activity feed view
CREATE VIEW recent_activity_feed AS
SELECT
    u.id AS user_id,
    u.first_name,
    u.last_name,
    'workout_completed' AS activity_type,
    wl.id AS activity_id,
    ws.name AS activity_description,
    wl.completed_at AS activity_timestamp
FROM workout_logs wl
JOIN users u ON u.id = wl.user_id
LEFT JOIN workout_sessions ws ON ws.id = wl.workout_session_id
WHERE wl.completed_at IS NOT NULL

UNION ALL

SELECT
    u.id AS user_id,
    u.first_name,
    u.last_name,
    'achievement_unlocked' AS activity_type,
    ua.id AS activity_id,
    a.display_name AS activity_description,
    ua.unlocked_at AS activity_timestamp
FROM user_achievements ua
JOIN users u ON u.id = ua.user_id
JOIN achievements a ON a.id = ua.achievement_id
WHERE ua.unlocked = TRUE

ORDER BY activity_timestamp DESC;

-- =====================================================
-- EXAMPLE QUERIES
-- =====================================================

-- Example 1: Get user's current workout plan with today's session
/*
SELECT
    wp.name AS plan_name,
    ws.name AS today_workout,
    ws.scheduled_date,
    ws.status,
    JSONB_AGG(
        JSONB_BUILD_OBJECT(
            'exercise', e.name,
            'sets', wse.sets,
            'reps', wse.reps,
            'order', wse.exercise_order
        ) ORDER BY wse.exercise_order
    ) AS exercises
FROM workout_plans wp
JOIN workout_sessions ws ON ws.workout_plan_id = wp.id
JOIN workout_session_exercises wse ON wse.workout_session_id = ws.id
JOIN exercises e ON e.id = wse.exercise_id
WHERE wp.user_id = 'USER_UUID_HERE'
    AND wp.status = 'active'
    AND ws.scheduled_date = CURRENT_DATE
GROUP BY wp.id, ws.id;
*/

-- Example 2: Get user's strength progression for pull-ups over last 3 months
/*
SELECT
    DATE(wl.completed_at) AS workout_date,
    el.max_reps AS best_set_reps,
    el.total_reps,
    el.avg_rpe
FROM exercise_logs el
JOIN workout_logs wl ON wl.id = el.workout_log_id
JOIN exercises e ON e.id = el.exercise_id
WHERE wl.user_id = 'USER_UUID_HERE'
    AND e.slug = 'pull-ups'
    AND wl.completed_at >= CURRENT_DATE - INTERVAL '3 months'
ORDER BY wl.completed_at ASC;
*/

-- Example 3: Get user's adherence rate (last 4 weeks)
/*
SELECT
    COUNT(CASE WHEN ws.status = 'completed' THEN 1 END)::FLOAT /
    NULLIF(COUNT(*), 0) * 100 AS adherence_percentage,
    COUNT(CASE WHEN ws.status = 'completed' THEN 1 END) AS completed,
    COUNT(CASE WHEN ws.status = 'scheduled' THEN 1 END) AS scheduled,
    COUNT(CASE WHEN ws.status = 'skipped' THEN 1 END) AS skipped
FROM workout_sessions ws
WHERE ws.user_id = 'USER_UUID_HERE'
    AND ws.scheduled_date >= CURRENT_DATE - INTERVAL '4 weeks'
    AND ws.scheduled_date <= CURRENT_DATE;
*/

-- Example 4: Get exercises by movement pattern and difficulty
/*
SELECT
    e.name,
    e.difficulty,
    mp.display_name AS pattern,
    e.equipment_required,
    e.video_url
FROM exercises e
JOIN movement_patterns mp ON mp.id = e.movement_pattern_id
WHERE mp.name = 'horizontal_push'
    AND e.difficulty BETWEEN 4 AND 6
    AND e.is_published = TRUE
ORDER BY e.difficulty ASC;
*/

-- Example 5: Get user's weight trend over last 90 days
/*
SELECT
    DATE(recorded_at) AS date,
    (data->>'weight')::DECIMAL AS weight_kg
FROM progress_metrics
WHERE user_id = 'USER_UUID_HERE'
    AND metric_type = 'weight'
    AND recorded_at >= CURRENT_DATE - INTERVAL '90 days'
ORDER BY recorded_at ASC;
*/

-- =====================================================
-- SAMPLE DATA INSERTS (for testing)
-- =====================================================

-- Insert movement patterns
INSERT INTO movement_patterns (name, display_name, category, sort_order) VALUES
    ('horizontal_push', 'Horizontal Push', 'primary', 1),
    ('vertical_push', 'Vertical Push', 'primary', 2),
    ('horizontal_pull', 'Horizontal Pull', 'primary', 3),
    ('vertical_pull', 'Vertical Pull', 'primary', 4),
    ('squat', 'Squat', 'primary', 5),
    ('hinge', 'Hinge', 'primary', 6),
    ('core_stability', 'Core Stability', 'primary', 7),
    ('anti_rotation', 'Anti-Rotation', 'secondary', 8),
    ('rotation', 'Rotation', 'secondary', 9),
    ('plyometrics', 'Plyometrics', 'secondary', 10);

-- Sample exercise (Standard Push-ups)
/*
INSERT INTO exercises (
    name, slug, movement_pattern_id, difficulty,
    description, equipment_required, target_muscles,
    coaching_cues, common_mistakes,
    estimated_time_to_master_weeks
) VALUES (
    'Standard Push-ups',
    'standard-push-ups',
    (SELECT id FROM movement_patterns WHERE name = 'horizontal_push'),
    5,
    'The fundamental horizontal pushing exercise. Lower your body until chest nearly touches the ground, then push back up.',
    ARRAY[]::TEXT[],
    ARRAY['pectoralis major', 'triceps', 'anterior deltoid'],
    ARRAY['Keep body straight from head to heels', 'Elbows at 45-degree angle', 'Full range of motion'],
    ARRAY['Sagging hips', 'Flared elbows', 'Incomplete range of motion'],
    12
);
*/

-- Sample achievement
INSERT INTO achievements (name, display_name, description, category, rarity, points, criteria) VALUES
    (
        'first_pull_up',
        'First Pull-up',
        'Complete your first full pull-up!',
        'milestone',
        'uncommon',
        50,
        '{"type": "rep_max", "exerciseSlug": "pull-ups", "minReps": 1}'::jsonb
    ),
    (
        'consistent_week',
        'Consistent Week',
        'Complete all scheduled workouts for a week',
        'consistency',
        'common',
        25,
        '{"type": "weekly_adherence", "percentage": 100}'::jsonb
    );

-- =====================================================
-- NOTES FOR IMPLEMENTATION
-- =====================================================

/*
PERFORMANCE CONSIDERATIONS:
1. Add indexes as query patterns emerge
2. Consider partitioning workout_logs and exercise_logs by date (for very large datasets)
3. Use materialized views for expensive analytics queries
4. Implement read replicas for analytics/reporting

SECURITY:
1. Row-level security (RLS) policies for multi-tenant data isolation
2. Encrypt progress photos at rest
3. Anonymize/pseudonymize data for analytics
4. Regular backups with encryption

SCALABILITY:
1. Consider separating read-heavy tables (analytics) from write-heavy (workout logs)
2. Implement caching layer (Redis) for frequently accessed data
3. Use JSONB indexes for complex queries on JSON columns
4. Monitor slow queries and add indexes as needed

DATA MIGRATION:
1. Use Prisma migrations or Alembic (Python) for schema changes
2. Version all schema changes
3. Test migrations on staging environment
4. Implement rollback procedures

ORM USAGE:
- Prisma (Node.js): Excellent TypeScript support, migrations, type safety
- SQLAlchemy (Python): Mature, flexible, good for complex queries
- Consider raw SQL for complex analytics queries even with ORM

NEXT STEPS:
1. Implement this schema in development environment
2. Seed with sample data from exercise_progression_trees.md
3. Build API layer on top (REST or GraphQL)
4. Implement authentication and authorization
5. Add monitoring and logging
*/
