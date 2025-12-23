# Security

**Part of the CaliFlow App Documentation**

**Related Documentation:**
- [System Design](./system-design.md)
- [API Design](./api-design.md)

---

## Security Measures

### Authentication & Authorization
- JWT token-based authentication
- Bcrypt password hashing
- Refresh token rotation
- Session timeout after inactivity

### Data Protection
- HTTPS enforcement
- SQL injection prevention (parameterized queries)
- XSS protection
- CSRF protection
- Rate limiting on API endpoints

### User Data Privacy
- Password hashing with bcrypt (12 rounds minimum)
- Progress photo encryption (optional)
- Soft deletes for GDPR compliance
- User data export capability

### Infrastructure Security
- Environment variable management
- Secrets management (AWS Secrets Manager)
- Regular security audits
- Dependency vulnerability scanning

---

For complete security specifications, see:
- Source: [calisthenics_app_design.md](../../calisthenics_app_design.md) (lines 2293-2334)

---

---
**Source:** calisthenics_app_design.md (lines 2293-2334)
**Last Updated:** 2025-12-21
**Related Docs:**
- [System Design](./system-design.md)
- [API Design](./api-design.md)
