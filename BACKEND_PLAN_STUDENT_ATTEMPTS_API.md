# Backend Plan: Enable Student Access to General Attempts API

## Current State
- **Endpoint**: `GET /api/v1/admin/general-attempts/students/{studentId}`
- **Access Level**: Admin-only
- **Use Case**: Frontend `use-student-general-attempts.ts` hook needs student to view their own attempt analytics

---

## Objectives
1. Allow students to securely view **their own** general attempts data
2. Maintain admin ability to view any student's data
3. Implement proper authorization checks at the API and database layer
4. Ensure data privacy and prevent unauthorized access

---

## Implementation Options

### **Option A: Modify Existing Admin Endpoint (Recommended)**
Add authorization logic to the existing endpoint to support both admin and student access.

**Pros:**
- Single endpoint to maintain
- Clear permission hierarchy
- Reduces code duplication

**Cons:**
- Endpoint path remains `/admin/...` which is semantically misleading for students
- May require more sophisticated authorization logic

**Implementation Steps:**
1. Update `StudentGeneralAttemptsController` to:
   - Accept an optional `studentId` path parameter (admin use)
   - Read `userId` from JWT token for student access
   - Return current user's data if no `studentId` provided and user is student
2. Modify authorization middleware:
   ```
   IF user is ADMIN:
     - Allow access to /admin/general-attempts/students/{studentId}
     - Return student {studentId}'s data
   ELSE IF user is STUDENT:
     - Allow access to /admin/general-attempts/students/{studentId}
     - Only if {studentId} == currentUser.id
     - Return error 403 if student tries to access another student's data
   ```
3. Add audit logging to track who accessed whose data
4. Update API documentation to reflect dual-access capability

---

### **Option B: Create New Student Endpoint (Alternative)**
Create a separate student-specific endpoint at `/api/v1/students/general-attempts/me` or `/api/v1/me/general-attempts`.

**Pros:**
- Clear API semantics
- Easy to apply different rate limits/caching for students
- Potential future extension for peer comparisons

**Cons:**
- Duplicate endpoint logic
- Increased maintenance burden
- Admin endpoint remains for backward compatibility

**Implementation Steps:**
1. Create new `StudentGeneralAttemptsController` with endpoint:
   - `GET /api/v1/me/general-attempts`
   - Auto-extracts `userId` from JWT token
   - Returns current user's attempts data
2. Reuse business logic layer from admin endpoint
3. Apply student-only authorization guard
4. Update API documentation

---

## Detailed Implementation (Option A - Recommended)

### 1. **Authorization Layer Enhancement**

**Current (assumed):**
```
@Authorize(Role.ADMIN)
public ActionResult GetStudentGeneralAttempts(int studentId) { ... }
```

**Updated:**
```
@Authorize(Role.ADMIN, Role.STUDENT)
public ActionResult GetStudentGeneralAttempts(int? studentId) 
{
    var userId = HttpContext.User.GetUserId(); // from JWT
    var userRole = HttpContext.User.GetRole();
    
    // Determine which student ID to query
    int targetStudentId;
    
    if (userRole == Role.ADMIN && studentId.HasValue)
    {
        targetStudentId = studentId.Value;
    }
    else if (userRole == Role.STUDENT)
    {
        targetStudentId = userId;
    }
    else
    {
        return Unauthorized(); // Student trying to access other student
    }
    
    // Query and return data for targetStudentId
    return Ok(GetStudentAttempts(targetStudentId));
}
```

### 2. **Database Query Optimization**

Ensure queries are indexed for performance:
```sql
-- Existing index (verify it exists)
CREATE INDEX idx_general_attempts_student_id 
ON general_attempts(student_id);

-- Add index for common filters if not present
CREATE INDEX idx_general_attempts_student_date 
ON general_attempts(student_id, attempt_date DESC);

-- Consider materialized view for aggregates if performance is an issue
CREATE MATERIALIZED VIEW vw_student_attempt_summary AS
SELECT 
    student_id,
    COUNT(*) as total_attempts,
    AVG(score) as avg_score,
    MAX(attempt_date) as last_attempt_date,
    COUNT(DISTINCT chapter_id) as chapters_attempted
FROM general_attempts
GROUP BY student_id;
```

### 3. **Data Filtering & Security**

In the service layer:
```
public GeneralAttemptStudentDetail GetStudentDetail(int studentId)
{
    // Query only attempts for this specific student
    var attempts = context.GeneralAttempts
        .Where(a => a.StudentId == studentId)
        .OrderByDescending(a => a.AttemptDate)
        .ToList();
    
    // Verify student exists
    var student = context.Students.FirstOrDefault(s => s.Id == studentId);
    if (student == null)
        throw new EntityNotFoundException("Student not found");
    
    // Build response with nested chapter stats
    return new GeneralAttemptStudentDetail
    {
        StudentId = studentId,
        FullName = student.FullName,
        Chapters = attempts
            .GroupBy(a => a.ChapterId)
            .Select(g => new ChapterAttemptStats
            {
                ChapterId = g.Key,
                AttemptCount = g.Count(),
                AverageScore = g.Average(a => a.Score),
                Attempts = g.Select(a => new AttemptDetail { ... }).ToList()
            })
            .ToList()
    };
}
```

### 4. **Error Handling**

```
if (userRole == Role.STUDENT && targetStudentId != userId)
{
    logger.LogWarning(
        "Student {UserId} attempted to access student {TargetId}'s data",
        userId, targetStudentId);
    return Forbid(); // 403 Forbidden
}
```

### 5. **Audit Logging**

```
auditService.Log(new AuditLog
{
    Action = "VIEW_STUDENT_ATTEMPTS",
    ActorUserId = userId,
    ActorRole = userRole,
    TargetStudentId = targetStudentId,
    Timestamp = DateTime.UtcNow,
    IpAddress = HttpContext.Connection.RemoteIpAddress.ToString()
});
```

---

## Frontend Changes Required

**Current (frontend):**
```typescript
// src/hooks/use-student-general-attempts.ts
const result = await generalAttemptsService.getStudentDetail(userId);
```

**No change needed!** The hook already passes `userId` and will work once backend allows student role.

**Optional enhancement for cleaner semantics:**
```typescript
// If using Option B with /me/general-attempts endpoint
const result = await generalAttemptsService.getMyAttempts(); // No parameter
```

---

## Testing Strategy

### **Unit Tests**
- ✅ Admin can access any student's data
- ✅ Student can access only their own data
- ✅ Student accessing other student's data returns 403
- ✅ Anonymous user access returns 401
- ✅ Data filtering: returned attempts match queried student only

### **Integration Tests**
- ✅ End-to-end with JWT tokens (admin & student roles)
- ✅ Database queries execute with correct filters
- ✅ Audit logs record access attempts
- ✅ Performance: large attempt datasets load in < 1 second

### **Security Tests**
- ✅ SQL injection prevention (parameterized queries)
- ✅ Authorization bypass attempts
- ✅ Token tampering attempts
- ✅ Role escalation attempts

---

## Implementation Timeline

| Phase | Task | Est. Time |
|-------|------|-----------|
| 1 | Modify authorization logic | 1-2 hours |
| 2 | Add audit logging | 1 hour |
| 3 | Write unit tests | 2-3 hours |
| 4 | Integration testing with frontend | 1-2 hours |
| 5 | Performance testing | 1 hour |
| 6 | Code review & documentation | 1-2 hours |
| **Total** | | **7-11 hours** |

---

## Database Migration (if needed)

```sql
-- Ensure student role can be assigned
ALTER TABLE users ADD CONSTRAINT chk_role CHECK (role IN ('ADMIN', 'STUDENT', 'TEACHER'));

-- Add attempt audit table if not present
CREATE TABLE attempt_access_audit (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    actor_user_id INT NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    target_student_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    timestamp DATETIME2 NOT NULL,
    ip_address VARCHAR(45),
    FOREIGN KEY (actor_user_id) REFERENCES users(id),
    FOREIGN KEY (target_student_id) REFERENCES users(id)
);

CREATE INDEX idx_attempt_access_audit_timestamp 
ON attempt_access_audit(timestamp DESC);
```

---

## Deployment Checklist

- [ ] Code review completed
- [ ] Unit tests passing (>90% coverage)
- [ ] Integration tests passing
- [ ] Performance tests confirm no regression
- [ ] API documentation updated
- [ ] Backward compatibility verified (admin endpoint still works)
- [ ] Staging environment testing completed
- [ ] Audit logging tested
- [ ] Database indexes created/verified
- [ ] Rollback plan documented
- [ ] Production deployment scheduled during low-traffic window
- [ ] Monitoring alerts configured for authorization failures

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Accidental data exposure | High | Double authorization checks, unit tests, code review |
| Performance degradation | Medium | Query optimization, index creation, load testing |
| Audit log overflow | Low | Implement log rotation, archival strategy |
| Role misconfiguration | High | Automated tests, manual verification on staging |

---

## Post-Implementation

1. **Monitor** authorization failures in logs
2. **Track** query performance metrics
3. **Gather** student feedback on data visibility
4. **Document** lessons learned
5. **Plan** related features (e.g., peer comparison, progress sharing)

