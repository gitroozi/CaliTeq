# API Design

**Part of the CaliFlow App Documentation**

**Related Documentation:**
- [System Design](./system-design.md)
- [Tech Stack](./tech-stack.md)
- [Data Models](../05-data/data-models.md)

---

## API Architecture

CaliFlow uses a RESTful API architecture with the following principles:

### Endpoint Structure
```
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id

GET    /api/workout-plans
POST   /api/workout-plans/generate
GET    /api/workout-plans/:id
PUT    /api/workout-plans/:id

POST   /api/workout-logs
GET    /api/workout-logs/:id
GET    /api/workout-logs/recent

GET    /api/exercises
GET    /api/exercises/:id
GET    /api/exercises/search
```

### Authentication
- JWT tokens in Authorization header
- Refresh token rotation
- Session management

### Response Format
```json
{
  "success": true,
  "data": {...},
  "message": "Success message",
  "timestamp": "2025-12-21T21:00:00Z"
}
```

---

For complete API specifications, see:
- Source: [calisthenics_app_design.md](../../calisthenics_app_design.md) (lines 1186-1261)

---

---
**Source:** calisthenics_app_design.md (lines 1186-1261)
**Last Updated:** 2025-12-21
**Related Docs:**
- [System Design](./system-design.md)
- [Tech Stack](./tech-stack.md)
- [Data Models](../05-data/data-models.md)
