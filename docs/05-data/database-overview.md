# Database Overview

**Part of the CaliFlow App Documentation**

**Related Documentation:**
- [Schema SQL](./schema.sql)
- [Data Models](./data-models.md)
- [Relationships](./relationships.md)

---

## Table of Contents

1. [Database Architecture](#architecture)
2. [Table Categories](#table-categories)
3. [Key Design Decisions](#design-decisions)
4. [Performance Considerations](#performance)

---

## Database Architecture {#architecture}

The CaliFlow database is built on **PostgreSQL 15+** with the following characteristics:

- **Total Tables:** 31
- **Total Indexes:** 50+
- **Primary Key Type:** UUID (security, distributed systems support)
- **Timestamp Strategy:** Automatic `created_at`, `updated_at` with triggers
- **Soft Deletes:** Implemented on critical tables (users, photos)
- **JSONB Usage:** Flexible data storage for nested/variable structures

---

## Table Categories {#table-categories}

### 1. User Management (3 tables)
- `users` - Core authentication and basic profile
- `user_profiles` - Extended training information
- `subscriptions` - Payment and subscription status

### 2. Exercise Library (3 tables)
- `movement_patterns` - Exercise categorization (22 patterns)
- `exercises` - Complete exercise database (150+ exercises)
- `exercise_progressions` - Explicit progression relationships

### 3. Workout Programming (3 tables)
- `workout_plans` - 12-week programs
- `workout_sessions` - Individual workout instances
- `workout_session_exercises` - Exercises within each session

### 4. Progress Tracking (4 tables)
- `workout_logs` - Completed workouts
- `exercise_logs` - Performance data per exercise
- `progress_metrics` - Body measurements, wellness scores
- `progress_photos` - Body composition photos

### 5. Nutrition (2 tables)
- `nutrition_plans` - Calorie and macro targets
- `meal_plans` - Structured meal planning

### 6. AI & Personalization (3 tables)
- `ai_chat_messages` - Conversation history with AI coach
- `ai_content_cache` - Cached AI-generated content
- `check_ins` - Periodic user assessments

### 7. Gamification (2 tables)
- `achievements` - Achievement definitions
- `user_achievements` - User progress on achievements

### 8. System (3 tables)
- `payments` - Transaction history
- `audit_logs` - System event tracking
- `schema_migrations` - Version control

---

## Key Design Decisions {#design-decisions}

### UUID vs Auto-incrementing IDs

**Decision:** Use UUIDs for all primary keys

**Rationale:**
- Security: Non-sequential IDs prevent enumeration attacks
- Distributed systems: Can generate IDs client-side
- Merging data: Easier to merge data from multiple sources

### JSONB for Flexible Data

**Used in:**
- `user_profiles.goals` - Variable-length goal arrays
- `workout_plans.mesocycles` - Complex nested periodization
- `workout_session_exercises.sets` - Variable sets per exercise
- `progress_metrics.data` - Polymorphic metric storage

**Advantages:**
- Schema evolution without migrations
- Fast queries with GIN indexes
- Simplifies complex data relationships

### Separate Sessions vs Logs

`workout_sessions` = Prescription (what user should do)
`workout_logs` = Performance (what user actually did)

**Benefits:**
- Compare prescription vs. actual performance
- Supports custom/unscheduled workouts
- Preserves original plan data

---

## Performance Considerations {#performance}

### Critical Optimizations

**Indexes:**
- All foreign keys indexed
- Composite indexes on common WHERE clauses
- GIN indexes on JSONB columns where queried

**Caching Strategy:**
- Redis cache for today's workout (TTL: until midnight)
- Exercise library cache (TTL: 24 hours)
- User stats cache (TTL: 1 hour)

**Connection Pooling:**
- Pool size: 20-30 connections
- For ~1000 concurrent users

---

For complete database documentation, see:
- [database_schema.sql](../../database_schema.sql) - Full executable schema
- [database_design_guide.md](../../database_design_guide.md) - Complete design guide

---

---
**Source:** database_design_guide.md (lines 1-155)
**Last Updated:** 2025-12-21
**Related Docs:**
- [Schema SQL](./schema.sql)
- [Data Models](./data-models.md)
- [Relationships](./relationships.md)
