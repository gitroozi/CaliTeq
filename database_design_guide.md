# Database Design Guide - Calisthenics Workout App

**Companion to:** `database_schema.sql`

This document explains the database architecture, relationships, and implementation strategies for the CaliFlow app.

---

## Table of Contents

1. [Schema Overview](#schema-overview)
2. [Entity Relationship Diagram](#erd)
3. [Core Data Flows](#data-flows)
4. [Design Decisions](#design-decisions)
5. [Query Patterns](#query-patterns)
6. [Performance Optimization](#performance)
7. [Data Integrity Rules](#integrity)
8. [Migration Strategy](#migrations)

---

## Schema Overview {#schema-overview}

### Database Statistics

- **Total Tables:** 31
- **Total Indexes:** 50+
- **Primary Key Type:** UUID (security, distributed systems)
- **Timestamp Strategy:** Automatic `created_at`, `updated_at` with triggers
- **Soft Deletes:** Implemented on critical tables (users, photos)

### Table Categories

#### 1. User Management (3 tables)
- `users` - Core authentication and basic profile
- `user_profiles` - Extended training information
- `subscriptions` - Payment and subscription status

#### 2. Exercise Library (3 tables)
- `movement_patterns` - Exercise categorization (22 patterns)
- `exercises` - Complete exercise database (150+ exercises)
- `exercise_progressions` - Explicit progression relationships

#### 3. Workout Programming (3 tables)
- `workout_plans` - 12-week programs
- `workout_sessions` - Individual workout instances
- `workout_session_exercises` - Exercises within each session

#### 4. Progress Tracking (4 tables)
- `workout_logs` - Completed workouts
- `exercise_logs` - Performance data per exercise
- `progress_metrics` - Body measurements, wellness scores
- `progress_photos` - Body composition photos

#### 5. Nutrition (2 tables)
- `nutrition_plans` - Calorie and macro targets
- `meal_plans` - Structured meal planning

#### 6. AI & Personalization (3 tables)
- `ai_chat_messages` - Conversation history with AI coach
- `ai_content_cache` - Cached AI-generated content
- `check_ins` - Periodic user assessments

#### 7. Gamification (2 tables)
- `achievements` - Achievement definitions
- `user_achievements` - User progress on achievements

#### 8. Social (2 tables - Future)
- `user_follows` - Social connections
- `workout_shares` - Shared workout posts

#### 9. System (3 tables)
- `payments` - Transaction history
- `audit_logs` - System event tracking
- `schema_migrations` - Version control

---

## Entity Relationship Diagram {#erd}

### Core Relationships (Text Representation)

```
┌─────────────┐
│    USERS    │
└──────┬──────┘
       │
       ├─────────────────────────────────────┐
       │                                     │
       ▼                                     ▼
┌──────────────┐                    ┌─────────────────┐
│USER_PROFILES │                    │  SUBSCRIPTIONS  │
└──────────────┘                    └─────────────────┘
       │
       │
       ├──────────────┬──────────────┬──────────────┬──────────────┐
       │              │              │              │              │
       ▼              ▼              ▼              ▼              ▼
┌─────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────────┐
│WORKOUT_PLANS│ │NUTRITION │ │ PROGRESS │ │ AI_CHAT  │ │ACHIEVEMENTS │
│             │ │  PLANS   │ │ METRICS  │ │ MESSAGES │ │             │
└──────┬──────┘ └──────────┘ └──────────┘ └──────────┘ └─────────────┘
       │
       ▼
┌──────────────┐
│   WORKOUT    │
│   SESSIONS   │
└──────┬───────┘
       │
       ├──────────────────┬──────────────────┐
       │                  │                  │
       ▼                  ▼                  ▼
┌────────────┐   ┌──────────────┐   ┌─────────────┐
│  SESSION   │   │WORKOUT_LOGS  │   │  EXERCISES  │
│ EXERCISES  │   └──────┬───────┘   └──────┬──────┘
└────────────┘          │                  │
                        │                  │
                        ▼                  ▼
                 ┌──────────────┐   ┌─────────────┐
                 │EXERCISE_LOGS │   │MOVEMENT_    │
                 └──────────────┘   │PATTERNS     │
                                    └─────────────┘
```

### Key Relationships Explained

#### User → Workout Plan (One-to-Many)
- Each user can have multiple workout plans (historical)
- Only one plan is "active" at a time (enforced at application level)
- Cascade delete: If user deleted, all their plans are deleted

#### Workout Plan → Workout Sessions (One-to-Many)
- Each 12-week plan generates ~36-60 workout sessions (3-5 per week × 12 weeks)
- Sessions are pre-generated when plan is created
- Each session contains 4-8 exercises

#### Workout Session → Workout Log (One-to-One)
- When user completes a session, a workout_log record is created
- workout_log contains actual performance data
- workout_session remains as the "prescription," workout_log is the "result"

#### Exercise → Exercise Progressions (Many-to-Many)
- Each exercise can have multiple progressions (easier/harder variations)
- Enables automatic progression recommendations
- Example: Standard Push-ups → Diamond Push-ups (progression)
- Example: Standard Push-ups → Knee Push-ups (regression)

#### User → Progress Metrics (One-to-Many)
- Polymorphic relationship via JSONB `data` field
- Supports multiple metric types (weight, photos, rep maxes, wellness)
- Time-series data for trend analysis

---

## Core Data Flows {#data-flows}

### Flow 1: User Onboarding → Workout Plan Generation

```
1. User signs up
   ├─ INSERT INTO users (email, password_hash)
   └─ Returns user.id

2. User completes onboarding
   ├─ INSERT INTO user_profiles (user_id, goals, equipment, injuries, ...)
   └─ Assessment scores captured

3. Workout plan generation (backend algorithm)
   ├─ Reads user_profiles
   ├─ Applies periodization rules
   ├─ Selects exercises from exercises table
   │  └─ Filters by: movement_pattern, difficulty, equipment, contraindications
   ├─ Generates 12-week structure
   ├─ INSERT INTO workout_plans (user_id, mesocycles, ...)
   └─ Batch INSERT INTO workout_sessions (36-60 records)
       └─ Batch INSERT INTO workout_session_exercises (~200-400 records)

4. AI enhancement
   ├─ Calls LLM API with plan context
   ├─ UPDATE workout_plans SET ai_explanation = ...
   └─ UPDATE workout_session_exercises SET coaching_notes = ...

5. User sees dashboard with today's workout
   └─ Query: Get active plan + today's session + exercises
```

### Flow 2: User Completes a Workout

```
1. User clicks "Start Workout"
   ├─ Frontend loads: workout_session + workout_session_exercises + exercises
   ├─ Displays: warm-up, exercises, cool-down
   └─ Starts timer

2. User logs each set
   ├─ Frontend accumulates set data: [
   │    {setNumber: 1, repsCompleted: 12, rpe: 8},
   │    {setNumber: 2, repsCompleted: 10, rpe: 9}, ...
   │  ]
   └─ Stored temporarily in frontend state

3. User completes workout
   ├─ INSERT INTO workout_logs (
   │    user_id, workout_session_id,
   │    started_at, completed_at,
   │    overall_difficulty, energy_level, enjoyment
   │  )
   │
   ├─ For each exercise:
   │  └─ INSERT INTO exercise_logs (
   │       workout_log_id, exercise_id,
   │       sets: JSONB, total_reps, max_reps, avg_rpe
   │     )
   │
   └─ UPDATE workout_sessions SET status = 'completed'

4. Backend analyzes performance
   ├─ Check for progression triggers:
   │  └─ If user hit 3x15 reps on an exercise for 3 consecutive sessions
   │      └─ Recommend progression to next level
   │
   ├─ Check for achievement unlocks:
   │  └─ Query achievements table, evaluate criteria
   │  └─ INSERT INTO user_achievements IF criteria met
   │
   └─ Calculate streak
       └─ Call calculate_user_streak(user_id) function
```

### Flow 3: Progress Tracking

```
1. User logs weight
   ├─ INSERT INTO progress_metrics (
   │    user_id, metric_type: 'weight',
   │    data: {"weight": 87.5}, recorded_at
   │  )

2. User uploads progress photo
   ├─ Upload to S3/Cloudinary → get URL
   ├─ INSERT INTO progress_photos (
   │    user_id, photo_url, photo_type: 'front',
   │    taken_at, weight_kg
   │  )

3. User views progress dashboard
   ├─ Query weight trend (last 90 days):
   │  └─ SELECT from progress_metrics WHERE metric_type = 'weight'
   │
   ├─ Query strength progression (pull-ups, last 3 months):
   │  └─ JOIN exercise_logs + workout_logs + exercises
   │
   ├─ Query workout adherence (last 4 weeks):
   │  └─ COUNT completed vs scheduled from workout_sessions
   │
   └─ Query current streak:
       └─ Call calculate_user_streak(user_id)

4. AI generates insights
   ├─ Aggregate all above data
   ├─ Call LLM API: "Analyze this user's progress and provide insights"
   ├─ Return: ["Great consistency!", "Pull-ups improving 15%", ...]
```

### Flow 4: Check-in & Plan Adjustment

```
1. Every 2 weeks, user gets check-in prompt
   └─ Notification: "Time for your check-in!"

2. User completes check-in survey
   ├─ Questions: How are you feeling? Any new pain? Goals same?
   ├─ INSERT INTO check_ins (
   │    user_id, responses: JSONB, check_in_date
   │  )

3. AI analyzes check-in + recent performance
   ├─ Query last 2 weeks of workout_logs
   ├─ Query progress_metrics (weight, wellness)
   ├─ Call LLM API: "Analyze and recommend adjustments"
   ├─ UPDATE check_ins SET ai_analysis = ..., recommendations = ...

4. If adjustments needed:
   ├─ Modify future workout_sessions (increase/decrease volume)
   ├─ OR suggest exercise substitutions
   └─ Log in audit_logs
```

---

## Design Decisions {#design-decisions}

### 1. UUID vs. Auto-incrementing IDs

**Decision:** Use UUIDs for all primary keys

**Rationale:**
- ✅ **Security:** Non-sequential IDs prevent enumeration attacks
- ✅ **Distributed systems:** Can generate IDs client-side or across multiple servers
- ✅ **Merging data:** Easier to merge data from multiple sources
- ❌ **Storage:** UUIDs are 16 bytes vs 4 bytes for integers (acceptable trade-off)
- ❌ **Performance:** Slightly slower joins (mitigated by proper indexing)

### 2. JSONB for Flexible Data

**Used in:**
- `user_profiles.goals` - Variable-length array of goal objects
- `workout_plans.mesocycles` - Complex nested periodization structure
- `workout_session_exercises.sets` - Variable number of sets per exercise
- `progress_metrics.data` - Polymorphic metric storage
- `ai_chat_messages.context` - Flexible conversation context

**Rationale:**
- ✅ **Flexibility:** Schema can evolve without migrations
- ✅ **Performance:** JSONB is binary, supports indexing, fast queries
- ✅ **Simplicity:** Avoids EAV (Entity-Attribute-Value) anti-pattern
- ❌ **Type safety:** Less strict than relational columns (mitigated by application validation)

**Best Practices:**
- Use JSONB for truly variable/nested data
- Use relational columns for frequently queried, structured data
- Index JSONB fields when needed: `CREATE INDEX ON table USING GIN (jsonb_column);`

### 3. Separate Workout Sessions vs. Workout Logs

**Why two tables?**

**`workout_sessions`** = **Prescription** (what user should do)
- Created when plan is generated
- Defines: exercises, sets, reps, rest periods
- Status: scheduled → in_progress → completed/skipped

**`workout_logs`** = **Actual Performance** (what user did)
- Created when user completes a workout
- Contains: actual reps, RPE, duration, subjective feedback
- Linked to session (if following plan) or standalone (custom workout)

**Benefits:**
- ✅ Can compare prescription vs. actual performance
- ✅ Supports custom/unscheduled workouts (workout_session_id can be NULL)
- ✅ Preserves original plan even if user modifies on-the-fly

### 4. Polymorphic Progress Metrics

**Alternative approaches considered:**
1. ❌ Separate tables: `weight_logs`, `photo_logs`, `rep_max_logs`, etc.
   - Pros: Type safety, easier queries per type
   - Cons: 10+ tables, complex joins for holistic view

2. ✅ **Single table with JSONB** (`progress_metrics`)
   - Pros: Single source of truth, easy to add new metric types
   - Cons: Less type safety (mitigated by application layer)

**Compromise:**
- Use `progress_metrics` for most metrics (weight, body fat, wellness)
- Use dedicated `progress_photos` table (needs special handling: encryption, deletion, storage)

### 5. Exercise Progression Strategy

**Two approaches implemented:**

1. **Implicit (via foreign keys):**
   - `exercises.regression_id` → easier exercise
   - `exercises.progression_id` → harder exercise
   - Fast lookup: "What's the next progression for this exercise?"

2. **Explicit (via junction table):**
   - `exercise_progressions` table
   - Supports multiple progression paths (e.g., push-ups → diamonds OR archer OR explosive)
   - More flexible for complex progression trees

**Use explicit approach for full flexibility.**

### 6. Soft Deletes

**Implemented on:**
- `users` (deleted_at)
- `progress_photos` (deleted_at)

**Rationale:**
- ✅ GDPR compliance (user can request deletion, but preserve anonymized analytics)
- ✅ Accidental deletion recovery
- ✅ Audit trail

**Implementation:**
- Add `WHERE deleted_at IS NULL` to all queries
- Use database views to automatically filter
- Schedule cleanup job to hard-delete after retention period (e.g., 90 days)

---

## Query Patterns {#query-patterns}

### Pattern 1: Get Today's Workout (Most Common Query)

**Frequency:** Every user login (multiple times daily)

**Optimization Strategy:** Aggressive caching

```sql
-- Optimized query with index hits
SELECT
    ws.id AS session_id,
    ws.name AS workout_name,
    ws.scheduled_date,
    JSONB_AGG(
        JSONB_BUILD_OBJECT(
            'exerciseId', e.id,
            'name', e.name,
            'videoUrl', e.video_url,
            'sets', wse.sets,
            'reps', wse.reps,
            'restSeconds', wse.rest_seconds,
            'notes', wse.coaching_notes
        ) ORDER BY wse.exercise_order
    ) AS exercises
FROM workout_plans wp
JOIN workout_sessions ws ON ws.workout_plan_id = wp.id
JOIN workout_session_exercises wse ON wse.workout_session_id = ws.id
JOIN exercises e ON e.id = wse.exercise_id
WHERE wp.user_id = $1
    AND wp.status = 'active'
    AND ws.scheduled_date = CURRENT_DATE
    AND ws.status != 'completed'
GROUP BY ws.id
LIMIT 1;
```

**Indexes used:**
- `idx_workout_plans_user_id`
- `idx_workout_sessions_scheduled_date`
- Composite index on `(user_id, status, scheduled_date)` - **consider adding**

**Caching:**
- Cache result in Redis with key: `workout:today:{userId}`
- TTL: Until midnight (since workout changes daily)
- Invalidate on: Workout completion, plan modification

---

### Pattern 2: Progress Trend Analysis

**Use Case:** User views "Weight Loss Progress" chart

**Query:**
```sql
-- Get weight trend with 7-day moving average
WITH weight_data AS (
    SELECT
        DATE(recorded_at) AS date,
        (data->>'weight')::DECIMAL AS weight_kg
    FROM progress_metrics
    WHERE user_id = $1
        AND metric_type = 'weight'
        AND recorded_at >= CURRENT_DATE - INTERVAL '90 days'
),
moving_avg AS (
    SELECT
        date,
        weight_kg,
        AVG(weight_kg) OVER (
            ORDER BY date
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ) AS moving_avg_7day
    FROM weight_data
)
SELECT * FROM moving_avg ORDER BY date ASC;
```

**Optimization:**
- Use materialized view for heavy analytics (refresh daily)
- Index: `(user_id, metric_type, recorded_at)`

---

### Pattern 3: Exercise Progression Recommendation

**Use Case:** User completes 3x15 push-ups for 3rd consecutive time → Suggest progression

**Query:**
```sql
-- Check if user is ready for progression
WITH recent_performance AS (
    SELECT
        el.exercise_id,
        el.max_reps,
        wl.completed_at,
        ROW_NUMBER() OVER (
            PARTITION BY el.exercise_id
            ORDER BY wl.completed_at DESC
        ) AS session_rank
    FROM exercise_logs el
    JOIN workout_logs wl ON wl.id = el.workout_log_id
    WHERE wl.user_id = $1
        AND el.exercise_id = $2 -- e.g., "standard-push-ups"
        AND wl.completed_at >= CURRENT_DATE - INTERVAL '2 weeks'
)
SELECT
    COUNT(*) AS consecutive_sessions_hitting_target
FROM recent_performance
WHERE session_rank <= 3 -- Last 3 sessions
    AND max_reps >= 15; -- Target reps

-- If result >= 3, recommend progression:
SELECT
    e.id,
    e.name,
    e.difficulty,
    e.video_url
FROM exercises e
WHERE e.id = (
    SELECT progression_id
    FROM exercises
    WHERE id = $2
);
```

---

### Pattern 4: User Analytics Dashboard

**Use Case:** Admin dashboard showing user engagement metrics

**Query (using view):**
```sql
-- Aggregate user statistics (from user_stats view)
SELECT
    subscription_tier,
    COUNT(*) AS user_count,
    AVG(total_workouts_completed) AS avg_workouts,
    AVG(current_streak) AS avg_streak,
    COUNT(CASE WHEN total_workouts_completed > 0 THEN 1 END)::FLOAT /
        NULLIF(COUNT(*), 0) * 100 AS activation_rate
FROM user_stats
WHERE member_since >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY subscription_tier;
```

---

## Performance Optimization {#performance}

### Critical Optimizations

#### 1. Index Strategy

**High-priority indexes (already in schema):**
- All foreign keys
- Frequently filtered columns (user_id, status, date fields)
- Composite indexes for common WHERE clauses

**Consider adding:**
```sql
-- Composite index for "today's workout" query
CREATE INDEX idx_workout_sessions_user_date_status
    ON workout_sessions(user_id, scheduled_date, status);

-- Index for progress metrics time-series queries
CREATE INDEX idx_progress_metrics_user_type_date
    ON progress_metrics(user_id, metric_type, recorded_at DESC);

-- GIN index for JSONB searching (if needed)
CREATE INDEX idx_user_profiles_equipment
    ON user_profiles USING GIN (equipment);
```

#### 2. Query Optimization Checklist

Before deploying, ensure:
- [ ] All queries use EXPLAIN ANALYZE to verify index usage
- [ ] No full table scans on tables > 10,000 rows
- [ ] Joins use indexed columns
- [ ] Aggregations use GROUP BY efficiently
- [ ] LIMIT clause on unbounded queries

#### 3. Caching Strategy

**Redis cache for:**
- Today's workout (per user) - TTL: until midnight
- Exercise library (entire dataset) - TTL: 24 hours
- User stats (per user) - TTL: 1 hour
- AI-generated content (by hash) - TTL: 7 days

**PostgreSQL query cache:**
- Materialized views for analytics (refresh nightly)

#### 4. Connection Pooling

**Recommended settings (for ~1000 concurrent users):**
- Connection pool size: 20-30
- Max overflow: 10
- Connection timeout: 30 seconds
- Pool recycle: 3600 seconds (1 hour)

---

## Data Integrity Rules {#integrity}

### Business Logic Constraints

#### 1. One Active Workout Plan Per User

**Enforcement:** Application-level (not database constraint)

```typescript
// Before creating new plan
const activePlans = await db.workoutPlans.count({
    where: {
        userId,
        status: 'active'
    }
});

if (activePlans > 0) {
    throw new Error('User already has an active plan');
}
```

**Alternative:** Database constraint (complex, not recommended)

#### 2. Workout Session Dates Within Plan Duration

**Enforcement:** Application validation + check constraint

```sql
ALTER TABLE workout_sessions
ADD CONSTRAINT check_session_within_plan_dates
CHECK (
    scheduled_date >= (
        SELECT start_date FROM workout_plans
        WHERE id = workout_plan_id
    )
    AND scheduled_date <= (
        SELECT end_date FROM workout_plans
        WHERE id = workout_plan_id
    )
);
-- Note: This is slow, enforce in application instead
```

#### 3. Exercise Difficulty Progression

**Rule:** User should progress from difficulty N to N+1 or N+2 (not N to N+5)

**Enforcement:** Application-level algorithm

```typescript
function recommendProgression(currentExercise, userPerformance) {
    const nextDifficulty = currentExercise.difficulty + 1;

    // Get progressions within difficulty range
    const candidates = exercises.filter(e =>
        e.movementPattern === currentExercise.movementPattern &&
        e.difficulty >= nextDifficulty &&
        e.difficulty <= nextDifficulty + 1 // Max 2 levels up
    );

    return selectBestMatch(candidates, userPerformance);
}
```

#### 4. Subscription Access Control

**Rule:** Free users can't access premium features

**Enforcement:** Middleware + database check

```typescript
async function requirePremium(userId) {
    const user = await db.users.findUnique({
        where: { id: userId },
        select: { subscriptionTier: true }
    });

    if (user.subscriptionTier !== 'premium') {
        throw new ForbiddenError('Premium subscription required');
    }
}
```

---

## Migration Strategy {#migrations}

### Initial Setup

**Step 1: Create Database**
```bash
createdb califlow_dev
psql califlow_dev < database_schema.sql
```

**Step 2: Seed Exercise Library**
```bash
# Load exercises from exercise_progression_trees.md
npm run seed:exercises
# OR
python scripts/seed_exercises.py
```

### Schema Versioning

**Using Prisma (Node.js):**

```bash
# Initialize Prisma
npx prisma init

# Generate Prisma schema from existing database
npx prisma db pull

# Create migration
npx prisma migrate dev --name add_user_timezone

# Apply migration in production
npx prisma migrate deploy
```

**Using Alembic (Python):**

```bash
# Initialize Alembic
alembic init migrations

# Create migration
alembic revision --autogenerate -m "add_user_timezone"

# Apply migration
alembic upgrade head
```

### Example Migration: Adding User Timezone

**Migration file:**
```sql
-- Migration: 20250121_add_user_timezone.sql

BEGIN;

-- Add column with default
ALTER TABLE users
ADD COLUMN timezone VARCHAR(50) DEFAULT 'UTC';

-- Backfill existing users (optional)
UPDATE users
SET timezone = 'America/New_York' -- Or determine from IP/profile
WHERE timezone IS NULL;

-- Add index
CREATE INDEX idx_users_timezone ON users(timezone);

-- Update schema_migrations
INSERT INTO schema_migrations (version)
VALUES ('20250121_add_user_timezone');

COMMIT;
```

**Rollback:**
```sql
BEGIN;

ALTER TABLE users DROP COLUMN timezone;

DELETE FROM schema_migrations
WHERE version = '20250121_add_user_timezone';

COMMIT;
```

---

## Best Practices Summary

### DO:
✅ Use UUIDs for primary keys
✅ Add indexes on foreign keys and frequently queried columns
✅ Use JSONB for truly flexible/nested data
✅ Implement soft deletes on user-facing tables
✅ Use database functions for complex, reusable logic
✅ Create views for common, complex queries
✅ Add `updated_at` triggers to all mutable tables
✅ Use transactions for multi-table operations
✅ Cache aggressively at application layer
✅ Monitor slow queries and add indexes

### DON'T:
❌ Store large files (images, videos) in database - use S3/Cloudinary
❌ Use JSONB for frequently queried, structured data
❌ Skip migrations - version all schema changes
❌ Over-normalize - some denormalization is good for performance
❌ Trust client input - validate at database AND application layer
❌ Ignore N+1 queries - use JOINs or batching
❌ Hardcode business logic in database triggers (keep in application)

---

## Next Steps for Implementation

1. **Set up development environment**
   - PostgreSQL 15+ installation
   - Create database
   - Run schema.sql

2. **Seed initial data**
   - Movement patterns (22 patterns)
   - Exercises (50-80 for MVP, ~150 for full version)
   - Achievements (10-20 initial achievements)

3. **Implement ORM layer**
   - Prisma schema generation (Node.js)
   - OR SQLAlchemy models (Python)
   - Type definitions for TypeScript

4. **Build API endpoints**
   - User registration/authentication
   - Onboarding flow (POST /api/user-profiles)
   - Workout plan generation (POST /api/workout-plans/generate)
   - Workout logging (POST /api/workout-logs)
   - Progress tracking (GET/POST /api/progress/metrics)

5. **Testing**
   - Unit tests for database models
   - Integration tests for API endpoints
   - Load testing for performance validation

6. **Production preparation**
   - Set up managed PostgreSQL (Supabase, Railway, or AWS RDS)
   - Configure backups (automated daily)
   - Implement monitoring (slow query log, connection pool metrics)
   - Set up alerting (high error rates, low disk space)

---

**Document Version:** 1.0
**Last Updated:** 2025-12-20
**Companion Files:**
- `database_schema.sql` - Full SQL schema
- `calisthenics_app_design.md` - App design document
- `exercise_progression_trees.md` - Exercise data source
