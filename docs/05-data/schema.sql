-- =====================================================
-- CALISTHENICS WORKOUT APP - DATABASE SCHEMA
-- =====================================================
-- This is a copy of the complete database schema
-- For full documentation, see database_schema.sql in project root
-- For design guide, see database-overview.md
-- =====================================================

-- See /Users/roozi/Claude/Calisthenics Workout/database_schema.sql
-- for the complete, executable schema with:
-- - All 31 tables
-- - All indexes
-- - All triggers and functions
-- - Sample data inserts
-- - Example queries

/**
 * Key Tables Overview:
 *
 * USER MANAGEMENT:
 * - users: Core authentication and profile
 * - user_profiles: Extended training information
 * - subscriptions: Payment and subscription status
 *
 * EXERCISE LIBRARY:
 * - movement_patterns: Exercise categorization (22 patterns)
 * - exercises: Complete exercise database (150+ exercises)
 * - exercise_progressions: Explicit progression relationships
 *
 * WORKOUT PROGRAMMING:
 * - workout_plans: 12-week programs
 * - workout_sessions: Individual workout instances
 * - workout_session_exercises: Exercises within each session
 *
 * PROGRESS TRACKING:
 * - workout_logs: Completed workouts
 * - exercise_logs: Performance data per exercise
 * - progress_metrics: Body measurements, wellness scores
 * - progress_photos: Body composition photos
 *
 * For complete schema, refer to the source file.
 */

-- =====================================================
-- METADATA
-- =====================================================
-- Document Version: 1.0
-- Last Updated: 2025-12-21
-- Part of: CaliFlow App Documentation
-- Source: database_schema.sql (complete file in project root)
