# System Design

**Part of the CaliFlow App Documentation**

**Related Documentation:**
- [Tech Stack](./tech-stack.md)
- [API Design](./api-design.md)
- [Database Overview](../05-data/database-overview.md)

---

## Architecture Overview

CaliFlow uses a modern three-tier architecture:

### Frontend Layer
- React + TypeScript
- Tailwind CSS for styling
- Responsive design (mobile-first)

### Backend Layer
- Node.js + Express + TypeScript
- RESTful API
- JWT authentication

### Data Layer
- PostgreSQL database
- Redis caching layer
- S3 for media storage

---

## System Components

### Authentication Service
- JWT token-based auth
- Refresh token rotation
- Session management

### Workout Generation Service
- Rule-based algorithm
- AI enhancement layer
- Caching for performance

### Progress Tracking Service
- Real-time logging
- Analytics aggregation
- Achievement system

---

For complete system architecture details, see:
- Source: [calisthenics_app_design.md](../../calisthenics_app_design.md) (lines 594-672)

---

---
**Source:** calisthenics_app_design.md (lines 594-672)
**Last Updated:** 2025-12-21
**Related Docs:**
- [Tech Stack](./tech-stack.md)
- [API Design](./api-design.md)
- [Database Overview](../05-data/database-overview.md)
