# Database Relationships

**Part of the CaliFlow App Documentation**

**Related Documentation:**
- [Database Overview](./database-overview.md)
- [Schema SQL](./schema.sql)

---

## Key Relationships

### User → Workout Plan (One-to-Many)
- Each user can have multiple workout plans (historical)
- Only one plan is "active" at a time
- Cascade delete: If user deleted, all their plans are deleted

### Workout Plan → Workout Sessions (One-to-Many)
- Each 12-week plan generates 36-60 workout sessions
- Sessions are pre-generated when plan is created
- Each session contains 4-8 exercises

### Workout Session → Workout Log (One-to-One)
- When user completes a session, a workout_log record is created
- workout_session = "prescription" (what to do)
- workout_log = "result" (what was done)

### Exercise → Exercise Progressions (Many-to-Many)
- Each exercise can have multiple progressions
- Enables automatic progression recommendations
- Example: Standard Push-ups → Diamond Push-ups (progression)

---

---
**Source:** database_design_guide.md (lines 123-153)
**Last Updated:** 2025-12-21
**Related Docs:**
- [Database Overview](./database-overview.md)
- [Schema SQL](./schema.sql)
