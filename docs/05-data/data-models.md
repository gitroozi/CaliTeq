# Data Models

**Part of the CaliFlow App Documentation**

**Related Documentation:**
- [Database Overview](./database-overview.md)
- [Schema SQL](./schema.sql)
- [API Design](../06-architecture/api-design.md)

---

## Overview

This document describes the data models used throughout the CaliFlow application. These models correspond to database tables and are exposed via the API layer.

For complete data model specifications, see:
- Source: [calisthenics_app_design.md](../../calisthenics_app_design.md) (lines 724-1073)
- Database Schema: [database_schema.sql](../../database_schema.sql)

---

## Core Data Models

### User Models
- **User:** Authentication and basic profile
- **UserProfile:** Training preferences and capabilities
- **Subscription:** Payment and access control

### Exercise Models
- **MovementPattern:** 22 movement categories
- **Exercise:** Complete exercise details with videos
- **ExerciseProgression:** Progression relationships

### Workout Models
- **WorkoutPlan:** 12-week program structure
- **WorkoutSession:** Individual workout
- **WorkoutSessionExercise:** Exercise prescriptions
- **WorkoutLog:** Completed workout data
- **ExerciseLog:** Performance metrics

### Progress Models
- **ProgressMetric:** Body measurements and wellness
- **ProgressPhoto:** Photo tracking
- **UserAchievement:** Gamification progress

---

---
**Source:** calisthenics_app_design.md (lines 724-1073)
**Last Updated:** 2025-12-21
**Related Docs:**
- [Database Overview](./database-overview.md)
- [Schema SQL](./schema.sql)
- [API Design](../06-architecture/api-design.md)
