# Blog Ecosystem Production Readiness Plan

## TL;DR

> **Quick Summary**: Fix critical authentication integration issues and implement production-ready infrastructure for the blog system, addressing 400 bookmark errors and broken view tracking while scaling for production traffic.
> 
> **Deliverables**: 
> - Fixed bookmark functionality with proper authentication
> - Automatic view tracking on article clicks
> - Production-ready authentication and state management
> - Database migration to PostgreSQL (optional staged approach)
> - Redis-based rate limiting and caching
> - Complete security hardening
> 
> **Estimated Effort**: Medium (2-3 days for core fixes, 1 week for full production setup)
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: Authentication fixes → View tracking → Production infrastructure

---

## Context

### Original Request
Prepare the blogs ecosystem for production by fixing 400 bookmark errors, implementing automatic view tracking, and making the entire system production-ready with proper authentication, state management, and scalability.

### Interview Summary
**Key Discussions**:
- User identified specific 400 errors in bookmark endpoint
- View tracking not working automatically when users click articles
- Need production-ready blog system

**Research Findings**:
- Root causes identified: authentication integration gaps, local-state-only bookmark functionality, disabled view tracking
- Production best practices: PostgreSQL migration, Redis rate limiting, Zustand state management
- Security patterns: Zod validation, proper authorization checks

### Metis Review
**Identified Gaps** (addressed):
- **Authentication Scope**: Clarified whether to fix existing Appwrite vs migrate to NextAuth.js/Clerk
- **Database Timeline**: Addressed whether to migrate immediately or stage the approach
- **Traffic Scaling**: Added infrastructure sizing based on expected traffic levels
- **Anonymous Users**: Defined hybrid approach for anonymous vs authenticated features
- **Rollback Strategy**: Added migration safety and rollback procedures
- **Edge Cases**: Addressed session management, error handling, and data consistency

---

## Work Objectives

### Core Objective
Transform the blog ecosystem from development MVP to production-ready system with reliable functionality, proper authentication, and scalable infrastructure.

### Concrete Deliverables
- Fixed bookmark API endpoints with proper authentication integration
- Automatic view tracking functionality on article clicks
- Production-grade authentication system (Appwrite integration fixed or migrated)
- Centralized state management for blog interactions
- PostgreSQL database migration (staged approach available)
- Redis-based rate limiting and caching system
- Complete security hardening and monitoring

### Definition of Done
- [ ] All API endpoints return 200 status with proper authentication
- [ ] View tracking works automatically on article page loads
- [ ] Anonymous and authenticated users have appropriate access levels
- [ ] Database migration completed with zero data loss
- [ ] Rate limiting prevents abuse while allowing legitimate usage
- [ ] All interactions (bookmarks, likes, views) persist across sessions
- [ ] Production monitoring and logging implemented

### Must Have
- Fix 400 errors in bookmark functionality
- Implement automatic view tracking when users click articles
- Proper authentication integration across all blog components
- Production security hardening
- Scalable database and caching infrastructure

### Must NOT Have (Guardrails)
- No breaking changes to existing Contentful/Strapi CMS integration
- No data loss during database migration
- No degradation in page load performance
- No removal of existing anonymous access to blog content
- No complex authentication overhaul without clear user preference

---

## Verification Strategy (MANDATORY)

> This section is determined during interview based on Test Infrastructure Assessment.

### Test Decision
- **Infrastructure exists**: YES (Next.js with built-in testing capabilities)
- **User wants tests**: YES (Automated verification for production readiness)
- **Framework**: Bun test (recommended for Next.js projects)

### If TDD Enabled

Each TODO follows RED-GREEN-REFACTOR:

**Task Structure:**
1. **RED**: Write failing test first
   - Test file: `src/__tests__/[feature].test.ts`
   - Test command: `bun test [file]`
   - Expected: FAIL (test exists, implementation doesn't)
2. **GREEN**: Implement minimum code to pass
   - Command: `bun test [file]`
   - Expected: PASS
3. **REFACTOR**: Clean up while keeping green
   - Command: `bun test [file]`
   - Expected: PASS (still)

**Test Setup Task (if infrastructure doesn't exist):**
- [ ] 0. Setup Test Infrastructure
  - Install: `bun add -d @types/bun @testing-library/react @testing-library/jest-dom`
  - Config: Create `bun.test.config.ts`
  - Verify: `bun test --help` → shows help
  - Example: Create `src/__tests__/example.test.ts`
  - Verify: `bun test` → 1 test passes

### If Automated Verification Only (NO User Intervention)

> **CRITICAL PRINCIPLE: ZERO USER INTERVENTION**
>
> **NEVER** create acceptance criteria that require:
> - "User manually tests..." / "사용자가 직접 테스트..."
> - "User visually confirms..." / "사용자가 눈으로 확인..."
> - "User interacts with..." / "사용자가 직접 조작..."
> - "Ask user to verify..." / "사용자에게 확인 요청..."
> - ANY step that requires a human to perform an action
>
> **ALL verification MUST be automated and executable by the agent.**
> If a verification cannot be automated, find an automated alternative or explicitly note it as a known limitation.

Each TODO includes EXECUTABLE verification procedures that agents can run directly:

**By Deliverable Type:**

| Type | Verification Tool | Automated Procedure |
|------|------------------|---------------------|
| **Frontend/UI** | Playwright browser via playwright skill | Agent navigates, clicks, screenshots, asserts DOM state |
| **TUI/CLI** | interactive_bash (tmux) | Agent runs command, captures output, validates expected strings |
| **API/Backend** | curl / httpie via Bash | Agent sends request, parses response, validates JSON fields |
| **Library/Module** | Node/Python REPL via Bash | Agent imports, calls function, compares output |
| **Config/Infra** | Shell commands via Bash | Agent applies config, runs state check, validates output |

**Evidence Requirements (Agent-Executable):**
- Command output captured and compared against expected patterns
- Screenshots saved to .sisyphus/evidence/ for visual verification
- JSON response fields validated with specific assertions
- Exit codes checked (0 = success)

---

## Execution Strategy

### Parallel Execution Waves

> Maximize throughput by grouping independent tasks into parallel waves.
> Each wave completes before the next begins.

```
Wave 1 (Start Immediately):
├── Task 1: Fix Authentication Integration (Critical Path)
└── Task 2: Setup Test Infrastructure

Wave 2 (After Wave 1):
├── Task 3: Fix Bookmark 400 Errors
├── Task 4: Implement View Tracking
└── Task 5: Implement Zustand State Management

Wave 3 (After Wave 2):
├── Task 6: Database Migration to PostgreSQL
├── Task 7: Redis Rate Limiting & Caching
└── Task 8: Security Hardening

Critical Path: Task 1 → Task 3 → Task 4
Parallel Speedup: ~50% faster than sequential
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 3, 4, 5 | 2 |
| 2 | None | None | 1 |
| 3 | 1 | None | 4, 5 |
| 4 | 1 | None | 3, 5 |
| 5 | 1 | None | 3, 4 |
| 6 | 1 | 7, 8 | None (can start after auth fixes) |
| 7 | 6 | 8 | None |
| 8 | 1, 7 | None | 6, 7 |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Agents |
|------|-------|-------------------|
| 1 | 1, 2 | delegate_task(category="quick", load_skills=['git-master'], run_in_background=true) |
| 2 | 3, 4, 5 | dispatch parallel after Wave 1 completes |
| 3 | 6, 7, 8 | delegate_task(category="unspecified-high", load_skills=['frontend-ui-ux'], run_in_background=true) |

---

## TODOs

> Implementation + Test = ONE Task. Never separate.
> EVERY task MUST have: Recommended Agent Profile + Parallelization info.

- [ ] 1. Fix Authentication Integration Across Blog Components

  **What to do**:
  - Import and integrate `getUserFromRequest` from `src/lib/auth-utils.ts` in BlogPostContent.tsx
  - Fix BlogPostContent.tsx line 199: remove 'anonymous' fallback, implement proper auth check
  - Add authentication context provider to blog components
  - Implement proper error handling for unauthenticated users
  - Update BlogCard component to access authentication state

  **Must NOT do**:
  - Remove anonymous user access to blog content viewing
  - Break existing Contentful/Strapi CMS integration
  - Change authentication system without user preference

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `quick`
    - Reason: Authentication integration is a targeted fix requiring precision
  - **Skills**: [`git-master`]
    - `git-master`: Essential for tracking authentication changes and ensuring atomic commits
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Not needed for authentication logic integration

  **Parallelization**:
  - **Can Run In Parallel**: NO (Critical Path)
  - **Parallel Group**: Sequential (Wave 1)
  - **Blocks**: Tasks 3, 4, 5
  - **Blocked By**: None (can start immediately)

  **References** (CRITICAL - Be Exhaustive):

  > The executor has NO context from your interview. References are their ONLY guide.
  > Each reference must answer: "What should I look at and WHY?"

  **Pattern References** (existing code to follow):
  - `src/lib/auth-utils.ts:getUserFromRequest()` - Use this function to extract user authentication from requests
  - `src/lib/auth-check.ts` - Authentication verification patterns for admin access
  - `src/app/api/articles/[id]/bookmarks/route.ts:13-19` - Current authentication pattern in API routes

  **API/Type References** (contracts to implement against):
  - `src/lib/auth-utils.ts:User` - User object structure with $id field
  - `src/lib/validation.ts:userIdSchema` - Validation schema for user IDs

  **Test References** (testing patterns to follow):
  - `src/__tests__/` - Existing test structure and patterns (if any exist)

  **Documentation References** (specs and requirements):
  - Appwrite authentication documentation for JWT token handling
  - Next.js 15 App Router authentication patterns

  **External References** (libraries and frameworks):
  - Appwrite SDK documentation: `https://appwrite.io/docs/nextjs/authentication`
  - Next.js authentication patterns: `https://nextjs.org/docs/app/building-your-application/authentication`

  **WHY Each Reference Matters** (explain the relevance):
  - `src/lib/auth-utils.ts`: Contains the exact function needed to extract user authentication, preventing the 'anonymous' fallback issue
  - `src/app/api/articles/[id]/bookmarks/route.ts`: Shows how authentication currently works in API endpoints, providing a pattern to follow in components
  - Appwrite documentation: Explains how to properly integrate authentication in client-side components

  **Acceptance Criteria**:

  > **CRITICAL: AGENT-EXECUTABLE VERIFICATION ONLY**

  **Automated Verification (API testing):**
  ```bash
  # Agent runs:
  curl -s -X POST http://localhost:3000/api/articles/test-article/bookmarks \
    -H "Content-Type: application/json" \
    -b "appwrite-session=test-token" \
    | jq '.success'
  # Assert: Returns true (no 400 error)
  
  # Agent runs:
  curl -s -X GET http://localhost:3000/api/articles/test-article/bookmarks \
    -b "appwrite-session=test-token" \
    | jq '.bookmarks'
  # Assert: Returns bookmark array (not error)
  ```

  **Evidence to Capture:**
  - [ ] Terminal output from bookmark API calls (showing 200 status codes)
  - [ ] Component logs showing proper user authentication extraction
  - [ ] Database records showing bookmarks associated with actual user IDs

  **Commit**: YES
  - Message: `fix(auth): integrate authentication in blog components`
  - Files: `src/components/pages/blogs/BlogPostContent.tsx`, `src/components/pages/blogs/BlogsOverview.tsx`
  - Pre-commit: `bun test src/__tests__/auth.test.ts`

- [ ] 2. Setup Test Infrastructure

  **What to do**:
  - Install testing dependencies for Next.js project
  - Create bun test configuration file
  - Setup test database environment (SQLite in-memory)
  - Create example test file to verify setup
  - Configure test scripts in package.json

  **Must NOT do**:
  - Change production database configuration
  - Install heavy testing frameworks that slow development
  - Modify existing application code

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Standard infrastructure setup with clear patterns
  - **Skills**: [`git-master`]
    - `git-master`: Track infrastructure changes in commits
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Not needed for test infrastructure

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 1)
  - **Parallel Group**: Wave 1
  - **Blocks**: None
  - **Blocked By**: None (can start immediately)

  **References**:
  - `package.json` - Current dependencies and scripts section
  - Next.js testing documentation: `https://nextjs.org/docs/app/building-your-application/testing`
  - Bun testing documentation: `https://bun.sh/docs/cli/test`

  **Acceptance Criteria**:
  ```bash
  # Agent runs:
  bun add -D @types/bun @testing-library/react @testing-library/jest-dom
  # Assert: Exit code 0
  
  # Agent runs:
  bun test --help
  # Assert: Shows bun test help output
  
  # Agent runs:
  bun test
  # Assert: Shows test runner initialized successfully
  ```

  **Evidence to Capture:**
  - [ ] Package.json updated with test dependencies
  - [ ] Test configuration file created
  - [ ] Example test file passing
  - [ ] Bun test help output showing installation success

  **Commit**: YES
  - Message: `feat(testing): setup bun test infrastructure`
  - Files: `package.json`, `bun.test.config.ts`, `src/__tests__/example.test.ts`

- [ ] 3. Fix Bookmark 400 Errors

  **What to do**:
  - Integrate BlogCard component bookmark button with actual API calls
  - Fix BlogPostContent.tsx bookmark API integration with proper authentication
  - Add proper error handling for bookmark API failures
  - Implement optimistic UI updates for bookmark interactions
  - Add bookmark state persistence across page refreshes

  **Must NOT do**:
  - Remove bookmark functionality for anonymous users (handle gracefully)
  - Change bookmark API endpoint contracts
  - Break existing bookmark data in database

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Complex frontend integration with API calls and state management
  - **Skills**: [`frontend-ui-ux`, `git-master`]
    - `frontend-ui-ux`: Essential for proper UI state management and user experience
    - `git-master`: Track bookmark functionality changes and ensure atomic commits
  - **Skills Evaluated but Omitted**:
    - `playwright`: Not needed for implementation (testing only)

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 4, 5)
  - **Parallel Group**: Wave 2
  - **Blocks**: None
  - **Blocked By**: Task 1 (Authentication Integration)

  **References**:
  - `src/components/pages/blogs/BlogsOverview.tsx:154-158` - BlogCard bookmark button implementation
  - `src/components/pages/blogs/BlogPostContent.tsx:698` - BlogPostContent bookmark API call
  - `src/app/api/articles/[id]/bookmarks/route.ts` - Bookmark API endpoint implementation
  - `src/lib/blog-db.ts:toggleBookmark` - Database bookmark operations

  **Acceptance Criteria**:
  ```bash
  # Agent runs:
  curl -s -X POST http://localhost:3000/api/articles/test-article/bookmarks \
    -H "Content-Type: application/json" \
    -d '{"userId":"test-user"}' \
    | jq '.success'
  # Assert: Returns true (no 400 error)
  
  # Agent runs browser automation:
  # Navigate to blog overview, click bookmark button, verify UI updates and persists
  ```

  **Evidence to Capture:**
  - [ ] Bookmark API responses showing 200 status codes
  - [ ] Browser screenshots showing bookmark button state changes
  - [ ] Database records showing bookmark associations with user IDs
  - [ ] Component state logs showing proper bookmark persistence

  **Commit**: YES
  - Message: `fix(blog): resolve bookmark 400 errors and integrate UI with API`
  - Files: `src/components/pages/blogs/BlogsOverview.tsx`, `src/components/pages/blogs/BlogPostContent.tsx`

- [ ] 4. Implement Automatic View Tracking

  **What to do**:
  - Enable view tracking in BlogOverview component (change trackView={false} to true)
  - Add automatic view tracking when users click on articles
  - Implement session-based view tracking for anonymous users
  - Add user association for view tracking when authenticated
  - Implement privacy-compliant view deduplication (one view per session per article)

  **Must NOT do**:
  - Track views from bots or crawlers
  - Implement overly complex view attribution that violates privacy
  - Break existing view counting functionality

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Client-side tracking implementation with privacy considerations
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Critical for implementing user interaction tracking without affecting UX
  - **Skills Evaluated but Omitted**:
    - `git-master`: Not primary skill, but changes should be tracked

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 3, 5)
  - **Parallel Group**: Wave 2
  - **Blocks**: None
  - **Blocked By**: Task 1 (Authentication Integration)

  **References**:
  - `src/components/pages/blogs/BlogsOverview.tsx:231` - ViewTracker component with trackView={false}
  - `src/components/ViewTracker.tsx` - Existing view tracking component
  - `src/app/api/articles/[id]/views/route.ts` - View tracking API endpoint
  - `src/lib/blog-db.ts:incrementView` - Database view operations

  **Acceptance Criteria**:
  ```bash
  # Agent runs browser automation:
  # Navigate to blog overview, click on article, verify view count increments
  # Verify view tracking API called automatically
  
  # Agent runs:
  curl -s -X GET http://localhost:3000/api/articles/test-article/views | jq '.viewCount'
  # Assert: View count increments after article click
  ```

  **Evidence to Capture:**
  - [ ] Browser screenshots showing article click navigation
  - [ ] API logs showing view tracking calls automatically triggered
  - [ ] Database records showing view increments with proper timestamps
  - [ ] Session tracking logs showing privacy-compliant deduplication

  **Commit**: YES
  - Message: `feat(blog): implement automatic view tracking on article clicks`
  - Files: `src/components/pages/blogs/BlogsOverview.tsx`, `src/components/ViewTracker.tsx`

- [ ] 5. Implement Zustand State Management

  **What to do**:
  - Install Zustand for centralized state management
  - Create blog interactions store (bookmarks, likes, views)
  - Integrate Zustand store with BlogCard and BlogPostContent components
  - Implement optimistic updates for better user experience
  - Add state persistence and synchronization with backend

  **Must NOT do**:
  - Replace all existing component state immediately
  - Break existing local state that works correctly
  - Over-engineer state management for simple cases

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: State management architecture implementation
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Essential for designing state management patterns that enhance user experience
  - **Skills Evaluated but Omitted**:
    - `git-master`: Not primary for state management implementation

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 3, 4)
  - **Parallel Group**: Wave 2
  - **Blocks**: None
  - **Blocked By**: Task 1 (Authentication Integration)

  **References**:
  - Zustand documentation: `https://github.com/pmndrs/zustand`
  - `src/components/pages/blogs/BlogsOverview.tsx` - Component state patterns to replace
  - `src/components/pages/blogs/BlogPostContent.tsx` - Component state patterns to replace

  **Acceptance Criteria**:
  ```bash
  # Agent runs:
  bun add zustand
  # Assert: Package installed successfully
  
  # Agent runs browser automation:
  # Test bookmark/like interactions persist across page refreshes
  ```

  **Evidence to Capture:**
  - [ ] Package.json showing Zustand dependency
  - [ ] Store implementation files
  - [ ] Browser screenshots showing state persistence across refreshes
  - [ ] Component logs showing proper state synchronization

  **Commit**: YES
  - Message: `feat(state): implement Zustand for blog interactions management`
  - Files: `src/stores/blogStore.ts`, component integration files

- [ ] 6. Database Migration to PostgreSQL

  **What to do**:
  - Install PostgreSQL and migration dependencies
  - Create production-ready PostgreSQL database schema
  - Use pgLoader to migrate SQLite data to PostgreSQL
  - Update database connection strings and configuration
  - Implement database connection pooling
  - Create database migration scripts for future updates
  - Add proper database indexes for performance

  **Must NOT do**:
  - Lose any existing blog data during migration
  - Skip database backup before migration
  - Change database schema in ways that break existing APIs

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Database migration is high-risk, high-complexity operation
  - **Skills**: [`git-master`]
    - `git-master`: Critical for tracking migration changes and ensuring rollback capability
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Not relevant for database migration

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential (Wave 3)
  - **Blocks**: Tasks 7, 8
  - **Blocked By**: Task 1 (Authentication Integration - ensures stable foundation)

  **References**:
  - `src/lib/blog-db.ts` - Current SQLite database operations
  - `data/blog-features.db` - Existing SQLite database file
  - pgLoader documentation: `https://pgloader.io/`
  - PostgreSQL Node.js documentation: `https://node-postgres.com/`

  **Acceptance Criteria**:
  ```bash
  # Agent runs:
  pgloader sqlite:///data/blog-features.db postgresql://user:pass@localhost/blog_prod
  # Assert: Migration completes without errors
  
  # Agent runs:
  psql -d blog_prod -c "SELECT COUNT(*) FROM article_bookmarks;"
  # Assert: Returns same count as SQLite
  
  # Agent runs:
  curl -s http://localhost:3000/api/articles/test/bookmarks | jq '.success'
  # Assert: API works with PostgreSQL
  ```

  **Evidence to Capture:**
  - [ ] Migration logs showing successful data transfer
  - [ ] Database comparison reports (SQLite vs PostgreSQL row counts)
  - [ ] API test results showing PostgreSQL functionality
  - [ ] Database backup files created before migration

  **Commit**: YES
  - Message: `feat(db): migrate from SQLite to PostgreSQL for production`
  - Files: Database configuration files, migration scripts, updated connection code

- [ ] 7. Redis Rate Limiting & Caching

  **What to do**:
  - Install Upstash Redis client and rate limiting library
  - Replace in-memory rate limiting with Redis-based distributed rate limiting
  - Implement Redis caching for blog content and user interactions
  - Add cache invalidation strategies for dynamic content
  - Configure Redis environment variables and connection
  - Add monitoring and metrics for cache hit rates

  **Must NOT do**:
  - Cache sensitive user data without proper security
  - Implement caching that breaks data consistency
  - Remove all existing rate limiting without proper replacement

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Infrastructure implementation with performance considerations
  - **Skills**: [`git-master`]
    - `git-master`: Track infrastructure changes and ensure proper configuration management
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Not needed for backend infrastructure

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 8)
  - **Parallel Group**: Wave 3
  - **Blocks**: None
  - **Blocked By**: Task 6 (Database Migration - ensures stable data layer)

  **References**:
  - `src/lib/rate-limit.ts` - Current in-memory rate limiting implementation
  - Upstash Redis documentation: `https://upstash.com/docs/redis`
  - Next.js caching patterns: `https://nextjs.org/docs/app/building-your-application/caching`

  **Acceptance Criteria**:
  ```bash
  # Agent runs:
  bun add @upstash/redis @upstash/ratelimit
  # Assert: Packages installed
  
  # Agent runs:
  # Test rate limiting with rapid API calls
  # Verify Redis rate limiting works across multiple instances
  
  # Agent runs:
  curl -s http://localhost:3000/api/articles/test
  # Assert: Response time improved with caching
  ```

  **Evidence to Capture:**
  - [ ] Redis configuration files
  - [ ] Rate limiting test results showing distributed behavior
  - [ ] Performance metrics showing response time improvements
  - [ ] Cache hit rate statistics

  **Commit**: YES
  - Message: `feat(perf): implement Redis rate limiting and caching`
  - Files: Rate limiting implementation, caching configuration, environment setup

- [ ] 8. Security Hardening

  **What to do**:
  - Add comprehensive input validation with Zod for all API endpoints
  - Implement proper security headers via Next.js middleware
  - Add CSRF protection for state-changing operations
  - Implement proper error logging and monitoring
  - Add rate limiting for sensitive operations (password changes, admin actions)
  - Configure environment variables properly for production secrets
  - Add security monitoring and alerting

  **Must NOT do**:
  - Expose sensitive configuration in client-side code
  - Implement overly aggressive security that blocks legitimate users
  - Skip security testing and validation

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Security implementation requires careful attention to detail
  - **Skills**: [`git-master`]
    - `git-master`: Track security changes and ensure proper audit trail
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Not relevant for backend security

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 7)
  - **Parallel Group**: Wave 3
  - **Blocks**: None
  - **Blocked By**: Task 1 (Authentication Integration) and Task 7 (Redis setup)

  **References**:
  - `src/lib/validation.ts` - Current validation schemas
  - `src/lib/rate-limit.ts` - Current rate limiting implementation
  - Next.js security documentation: `https://nextjs.org/docs/app/building-your-application/security`
  - Zod validation documentation: `https://zod.dev/`

  **Acceptance Criteria**:
  ```bash
  # Agent runs security tests:
  curl -s -X POST http://localhost:3000/api/articles/test/bookmarks \
    -H "Content-Type: application/json" \
    -d '{"malicious_payload": "<script>alert(1)</script>"}' \
    | jq '.error'
  # Assert: Returns validation error, not 200
  
  # Agent runs:
  curl -I http://localhost:3000/api/articles/test
  # Assert: Shows security headers (X-Frame-Options, CSP, etc.)
  ```

  **Evidence to Capture**:
  - [ ] Security headers in HTTP responses
  - [ ] Validation error responses for malicious inputs
  - [ ] Security middleware configuration files
  - [ ] Rate limiting logs showing protection against abuse

  **Commit**: YES
  - Message: `feat(security): comprehensive security hardening for production`
  - Files: Security middleware, validation schemas, rate limiting updates

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `fix(auth): integrate authentication in blog components` | BlogPostContent.tsx, BlogsOverview.tsx | bun test auth.test.ts |
| 2 | `feat(testing): setup bun test infrastructure` | package.json, bun.test.config.ts | bun test |
| 3 | `fix(blog): resolve bookmark 400 errors and integrate UI with API` | BlogCard, BlogPostContent | bun test bookmark.test.ts |
| 4 | `feat(blog): implement automatic view tracking on article clicks` | ViewTracker, BlogsOverview | bun test view-tracking.test.ts |
| 5 | `feat(state): implement Zustand for blog interactions management` | blogStore.ts, components | bun test state-management.test.ts |
| 6 | `feat(db): migrate from SQLite to PostgreSQL for production` | DB configs, migrations | bun test db-migration.test.ts |
| 7 | `feat(perf): implement Redis rate limiting and caching` | rate-limit.ts, cache configs | bun test performance.test.ts |
| 8 | `feat(security): comprehensive security hardening for production` | middleware.ts, validation.ts | bun test security.test.ts |

---

## Success Criteria

### Verification Commands
```bash
# Test bookmark functionality
curl -s -X POST http://localhost:3000/api/articles/test/bookmarks \
  -H "Content-Type: application/json" \
  -d '{"userId":"test-user"}' | jq '.success'  # Expected: true

# Test view tracking
curl -s http://localhost:3000/api/articles/test/views | jq '.viewCount'  # Expected: incrementing number

# Test authentication integration
curl -s -X GET http://localhost:3000/api/articles/test/bookmarks \
  -b "appwrite-session=valid-token" | jq '.bookmarks'  # Expected: array

# Test rate limiting
for i in {1..20}; do curl -s http://localhost:3000/api/articles/test; done  # Expected: rate limited after threshold

# Test security
curl -s -X POST http://localhost:3000/api/articles/test/bookmarks \
  -d '{"malicious":"<script>"}' | jq '.error'  # Expected: validation error
```

### Final Checklist
- [ ] All "Must Have" present and functional
- [ ] All "Must NOT Have" properly excluded
- [ ] All API endpoints return 200 status codes with proper authentication
- [ ] View tracking works automatically on article clicks
- [ ] Bookmarks and likes persist across sessions
- [ ] Database migration completed with zero data loss
- [ ] Rate limiting prevents abuse while allowing legitimate usage
- [ ] Security headers and validation protect against common attacks
- [ ] All tests pass in production-like environment
- [ ] Performance benchmarks meet production requirements