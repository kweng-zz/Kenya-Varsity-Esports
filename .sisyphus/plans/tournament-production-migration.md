# Tournament Registration Production Migration

## TL;DR

> **Quick Summary**: Migrate tournament registration from client-side Appwrite to production-ready server-side architecture with real database persistence, modern UI, and comprehensive testing.
> 
> **Deliverables**: 
> - Production-ready ParticipantManagementService using node-appwrite
> - Updated API endpoints with full payload handling
> - Refactored frontend using API instead of direct SDK
> - Modern multi-step form UI with React Hook Form + Zod
> - Complete test coverage (unit, integration, E2E)
> 
> **Estimated Effort**: Medium (2-3 days for core implementation, 1-2 days for testing/polish)
> **Parallel Execution**: YES - 3 waves (Backend, Frontend, Testing)
> **Critical Path**: Service Implementation → API Update → Frontend Refactor → UI Redesign

---

## Context

### Original Request
Prepare the tournament UI and backend for production by moving logic to the server, implementing real DB persistence in the backend service, and cleaning up the frontend. Frontend currently writes directly to Appwrite DB using client-side SDK and handles complex team data (players, substitutes as JSON).

### Interview Summary
**Key Discussions**:
- **Architecture Decision**: Consolidate dual-service approach into unified service layer
- **Data Model Preservation**: Maintain existing tournament_registrations collection schema with JSON team structures
- **Student ID Validation**: Keep student ID as primary key for conflict prevention
- **Game Rules Engine**: Preserve dynamic form generation based on game configurations
- **Auth Integration**: Maintain existing multi-layer authentication with team captain authorization

**Research Findings**:
- **Current Implementation**: Well-structured with client-side Appwrite + mock service layer
- **Test Infrastructure**: Mature Bun Test + Playwright setup with BDD patterns available
- **Form UI Best Practices**: React Hook Form + Zod validation recommended for production
- **Appwrite Backend**: node-appwrite provides robust service layer capabilities for production

### Metis Review
**Self-Analysis** (Metis consultation skipped due to agent unavailability):
- **Gap Identified**: Need explicit rollback strategy for migration
- **Guardrail Applied**: Preserve existing schema and validation logic
- **Assumption Validated**: User wants modern UX without breaking existing functionality

---

## Work Objectives

### Core Objective
Transform tournament registration from client-side direct database access to production-ready server-side architecture while preserving all existing functionality and improving user experience.

### Concrete Deliverables
- `src/lib/services/participantManagement.ts` - Real database persistence with node-appwrite
- `src/app/api/tournaments/[id]/participants/route.ts` - Full payload handling API endpoint
- `src/app/tournament-registration/page.tsx` - API-based frontend implementation
- Modern multi-step form UI with team management capabilities
- Comprehensive test suite covering all layers

### Definition of Done
- [ ] All database operations go through service layer (no direct client-side Appwrite)
- [ ] API handles full registration payload including complex team structures
- [ ] Frontend uses API exclusively for all tournament operations
- [ ] Modern UI provides better UX with progressive disclosure and validation
- [ ] All tests pass (unit, integration, E2E)
- [ ] Performance benchmarks show no regression in response times

### Must Have
- Preserve student ID uniqueness validation across tournaments
- Maintain game-driven form generation and validation
- Keep team captain authorization system intact
- Support complex team structures (players + substitutes with JSON)
- Implement proper error handling and user feedback

### Must NOT Have (Guardrails)
- **NO breaking changes to existing database schema**
- **NO removal of existing validation logic**
- **NO changes to authentication system**
- **NO removal of game rules engine**
- **NO scope creep into unrelated tournament features**

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: YES (Bun Test + Playwright)
- **User wants tests**: YES (TDD approach)
- **Framework**: Bun Test for unit/integration, Playwright for E2E

### TDD Enabled

Each TODO follows RED-GREEN-REFACTOR:

**Task Structure:**
1. **RED**: Write failing test first
   - Test file: `[path].test.ts` 
   - Test command: `bun test [file]`
   - Expected: FAIL (test exists, implementation doesn't)
2. **GREEN**: Implement minimum code to pass
   - Command: `bun test [file]`
   - Expected: PASS
3. **REFACTOR**: Clean up while keeping green
   - Command: `bun test [file]`
   - Expected: PASS (still)

### Automated Verification (ALWAYS include, choose by deliverable type)

**For Backend Service changes** (using Bun test):
```bash
# Agent runs:
bun test src/lib/services/__tests__/participantManagement.test.ts
# Assert: All database operation tests pass

bun test src/app/api/tournaments/[id]/participants/__tests__/route.test.ts
# Assert: API endpoint handles full payload correctly
```

**For Frontend/UI changes** (using Playwright):
```bash
# Agent executes via playwright browser automation:
npx playwright test tournament-registration.spec.ts
# Assert: Complete registration flow works end-to-end
```

**For Database Operations** (using Bun + Appwrite):
```bash
# Agent runs integration test:
bun test src/__tests__/integration/tournament-registration.test.ts
# Assert: Data persists correctly and can be retrieved
```

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately):
├── Task 1: Setup Test Infrastructure for Service Layer
├── Task 2: Research Appwrite Service Patterns

Wave 2 (After Wave 1):
├── Task 3: Implement ParticipantManagementService
├── Task 4: Update API Route
├── Task 5: Create Frontend Form Schema

Wave 3 (After Wave 2):
├── Task 6: Refactor Frontend to API calls
├── Task 7: Implement Modern UI Components
└── Task 8: Integration Testing & Verification

Critical Path: Task 1 → Task 3 → Task 4 → Task 6 → Task 8
Parallel Speedup: ~50% faster than sequential
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 3, 5 | 2 |
| 2 | None | 3 | 1 |
| 3 | 1, 2 | 4, 6 | 5 |
| 4 | 3 | 6 | 5, 7 |
| 5 | 1 | 7 | 3, 4 |
| 6 | 3, 4 | 8 | 7 |
| 7 | 5 | 8 | 6 |
| 8 | 6, 7 | None | None (final) |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Agents |
|------|-------|-------------------|
| 1 | 1, 2 | delegate_task(category="quick", load_skills=[]) |
| 2 | 3, 4, 5 | delegate_task(category="unspecified-high", load_skills=[]) |
| 3 | 6, 7, 8 | delegate_task(category="visual-engineering", load_skills=["frontend-ui-ux"]) |

---

## TODOs

> Implementation + Test = ONE Task. Never separate.
> EVERY task MUST have: Recommended Agent Profile + Parallelization info.

### Wave 1: Foundation Setup

- [ ] 1. Setup Test Infrastructure for Service Layer

  **What to do**:
  - Create test files for participantManagement service
  - Setup Appwrite test environment with isolated collections
  - Create mock data fixtures for testing complex team structures
  - Implement test utilities for database cleanup

  **Must NOT do**:
  - Don't modify production database collections
  - Don't use existing production data for tests

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Foundation setup with clear patterns, no complex logic
  - **Skills**: [] (none needed)
    - Basic testing patterns are well-established

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 2)
  - **Blocks**: Tasks 3, 5 (service implementation depends on test setup)
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References** (existing test patterns):
  - `src/__tests__/integration.test.ts:5-25` - API testing patterns with fetch
  - `src/__tests__/security.test.ts:10-30` - Service testing with singleton patterns
  - `oh-my-opencode/src/shared/session-cursor.test.ts:15-35` - BDD style with #given/#when/#then

  **Test Infrastructure References**:
  - `bun.test.config.ts:1-20` - Test configuration with happy-dom and jest-dom
  - `package.json:25-35` - Test scripts and dependencies

  **Documentation References**:
  - Bun test documentation for mocking and setup patterns

  **WHY Each Reference Matters**:
  - Integration test patterns show how to test API endpoints effectively
  - Service test patterns demonstrate singleton testing approach needed for Appwrite services
  - BDD patterns provide structure for complex service behavior testing

  **Acceptance Criteria**:

  **TDD Workflow**:
  - [ ] Test file created: `src/lib/services/__tests__/participantManagement.test.ts`
  - [ ] Test covers: service instantiation, basic CRUD operations
  - [ ] Test utilities created: `src/lib/services/__tests__/fixtures/teams.ts`
  - [ ] bun test src/lib/services/__tests__/participantManagement.test.ts → FAIL (no implementation yet)

  **Automated Verification**:
  ```bash
  # Agent runs:
  bun test src/lib/services/__tests__/participantManagement.test.ts --dry-run
  # Assert: Test files compile and structure is valid
  
  bun test src/lib/services/__tests__/fixtures/teams.test.ts
  # Assert: Mock data fixtures generate correctly
  ```

  **Evidence to Capture**:
  - [ ] Test output showing test discovery works
  - [ ] Fixture files with sample team data structures
  - [ ] Test environment isolation verification

  **Commit**: NO (group with Task 2)

- [ ] 2. Research Appwrite Service Patterns

  **What to do**:
  - Study node-appwrite official documentation for database operations
  - Research production Appwrite service layer implementations
  - Document best practices for error handling and transaction management
  - Create code examples for complex data handling (JSON team structures)

  **Must NOT do**:
  - Don't implement actual service code (research only)
  - Don't modify existing codebase during research

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Research and documentation task, no implementation complexity
  - **Skills**: [] (none needed)
    - Research patterns are straightforward

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: Task 3 (service implementation depends on research)
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References** (existing service patterns):
  - `src/lib/services/participantManagement.ts:1-50` - Current mock service interface
  - `src/lib/services/participantsService.ts:1-40` - Alternative service implementation
  - `src/contexts/AuthContext.tsx:100-150` - Appwrite client usage patterns

  **External References**:
  - node-appwrite official documentation for database.create(), database.list()
  - Appwrite production examples for complex nested data handling

  **WHY Each Reference Matters**:
  - Current service interface shows what methods need to be implemented
  - AuthContext demonstrates existing Appwrite client configuration patterns
  - Official docs provide authoritative implementation guidance

  **Acceptance Criteria**:

  **TDD Workflow**:
  - [ ] Research document created: `.sisyphus/research/appwrite-service-patterns.md`
  - [ ] Code examples documented for team data CRUD operations
  - [ ] Error handling patterns documented
  - [ ] Transaction management approaches researched

  **Automated Verification**:
  ```bash
  # Agent runs:
  ls -la .sisyphus/research/appwrite-service-patterns.md
  # Assert: Research document exists and contains implementation patterns
  
  grep -c "database.create" .sisyphus/research/appwrite-service-patterns.md
  # Assert: Contains at least 3 database operation examples
  ```

  **Evidence to Capture**:
  - [ ] Research document with implementation patterns
  - [ ] Code snippets for complex data handling
  - [ ] Best practices summary

  **Commit**: YES (group with Task 1)
  - Message: `feat(test): setup service layer test infrastructure and research patterns`
  - Files: Test files, research documentation
  - Pre-commit: `bun test --dry-run`

### Wave 2: Backend Implementation

- [ ] 3. Implement ParticipantManagementService with node-appwrite

  **What to do**:
  - Replace in-memory Map storage with real Appwrite database operations
  - Implement createRegistration() method with full team data handling
  - Implement checkStudentConflicts() for duplicate prevention
  - Add proper error handling and validation
  - Implement getAllRegistrations() and getRegistrationById() methods

  **Must NOT do**:
  - Don't break existing method signatures (maintain API compatibility)
  - Don't remove existing validation logic
  - Don't change database collection schema

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Complex service implementation requiring Appwrite integration and error handling
  - **Skills**: []
    - Core implementation without specialized skill requirements

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (sequential within wave)
  - **Blocks**: Tasks 4, 6 (API and frontend depend on service)
  - **Blocked By**: Tasks 1, 2 (test setup and research required)

  **References**:

  **Pattern References** (existing service to replace):
  - `src/lib/services/participantManagement.ts:15-80` - Current implementation to replace with real DB operations
  - `src/lib/services/participantManagement.ts:85-120` - Method signatures to preserve
  - `src/types/tournament.ts:20-45` - Type definitions for tournament data

  **Database Schema References**:
  - `scripts/setup-tournament-registration-collection.js:1-50` - Database collection schema
  - Current tournament_registrations collection structure

  **Test References**:
  - `src/lib/services/__tests__/participantManagement.test.ts` - Tests to satisfy

  **WHY Each Reference Matters**:
  - Current service shows exact method signatures and behavior to preserve
  - Database schema provides collection structure and field types
  - Type definitions ensure strict type safety is maintained

  **Acceptance Criteria**:

  **TDD Workflow**:
  - [ ] RED: Tests run and fail (implementation missing)
  - [ ] GREEN: Implement core database operations
  - [ ] GREEN: Implement student conflict checking
  - [ ] GREEN: Implement error handling and validation
  - [ ] REFACTOR: Optimize queries and add logging
  - [ ] bun test src/lib/services/__tests__/participantManagement.test.ts → PASS

  **Automated Verification**:
  ```bash
  # Agent runs:
  bun test src/lib/services/__tests__/participantManagement.test.ts
  # Assert: All service tests pass (CRUD, validation, error handling)
  
  # Integration test:
  bun -e "import { ParticipantManagementService } from './src/lib/services/participantManagement'; const service = new ParticipantManagementService(); console.log('Service instantiated:', !!service)"
  # Assert: Service can be instantiated without errors
  ```

  **Evidence to Capture**:
  - [ ] Test output showing all service tests pass
  - [ ] Database operations successfully create/read tournament registrations
  - [ ] Error handling works correctly for invalid data

  **Commit**: YES
  - Message: `feat(service): implement real database persistence for tournament registration`
  - Files: `src/lib/services/participantManagement.ts`
  - Pre-commit: `bun test src/lib/services/__tests__/participantManagement.test.ts`

- [ ] 4. Update API Route to Handle Full Registration Payload

  **What to do**:
  - Update POST endpoint to use real ParticipantManagementService
  - Add comprehensive request validation with full team data structure
  - Implement proper error responses with detailed messages
  - Add support for all tournament registration fields
  - Implement proper authentication and authorization checks

  **Must NOT do**:
  - Don't remove existing endpoint structure
  - Don't break existing request/response format
  - Don't remove authentication requirements

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: API implementation with validation, auth, and error handling
  - **Skills**: []
    - Standard API implementation without specialized skills

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (sequential with service)
  - **Blocks**: Task 6 (frontend depends on API)
  - **Blocked By**: Task 3 (service must be implemented first)

  **References**:

  **API Pattern References**:
  - `src/app/api/tournaments/[id]/participants/route.ts:1-50` - Current API structure to enhance
  - `src/app/api/tournaments/[id]/participants/route.ts:51-100` - Existing validation to preserve and extend
  - `src/contexts/AuthContext.tsx:200-250` - Authentication patterns to use

  **Service References**:
  - `src/lib/services/participantManagement.ts` - New service methods to integrate
  - `src/types/tournament.ts:45-70` - Request/response types

  **Test References**:
  - `src/__tests__/integration.test.ts:50-80` - API testing patterns

  **WHY Each Reference Matters**:
  - Current API shows the structure and validation that needs to be enhanced
  - AuthContext provides patterns for proper user authentication in API routes
  - Service methods show what functionality needs to be exposed via API

  **Acceptance Criteria**:

  **TDD Workflow**:
  - [ ] RED: API tests fail with mock service
  - [ ] GREEN: Update API to use real service
  - [ ] GREEN: Add comprehensive validation for team data
  - [ ] GREEN: Implement proper error responses
  - [ ] REFACTOR: Optimize response structure and add logging
  - [ ] bun test src/app/api/tournaments/[id]/participants/__tests__/route.test.ts → PASS

  **Automated Verification**:
  ```bash
  # Agent runs:
  bun test src/app/api/tournaments/[id]/participants/__tests__/route.test.ts
  # Assert: API tests pass with full payload handling
  
  # Manual API test:
  curl -s -X POST http://localhost:3000/api/tournaments/test-id/participants \
    -H "Content-Type: application/json" \
    -d '{"tournamentId":"test","playerName":"Test Captain","email":"test@example.com","players":"{\\"players\\":[{\\"name\\":\\"Player1\\",\\"studentId\\":\\"STU001\\"}]}"}' \
    | jq '.success'
  # Assert: API returns success: true
  ```

  **Evidence to Capture**:
  - [ ] API test output showing full payload acceptance
  - [ ] Error responses properly formatted for invalid data
  - [ ] Authentication/authorization working correctly

  **Commit**: YES
  - Message: `feat(api): support full tournament registration payload with real persistence`
  - Files: `src/app/api/tournaments/[id]/participants/route.ts`
  - Pre-commit: `bun test src/app/api/tournaments/[id]/participants/__tests__/route.test.ts`

- [ ] 5. Create Frontend Form Schema and Validation

  **What to do**:
  - Create Zod schema for tournament registration form matching API payload
  - Implement form validation rules matching game-specific requirements
  - Create form types that match backend data structures
  - Setup React Hook Form configuration with resolver
  - Create form validation utilities for complex team data

  **Must NOT do**:
  - Don't create validation that differs from backend requirements
  - Don't remove existing game-driven validation logic
  - Don't break compatibility with existing team data structures

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Complex form schema creation with validation logic
  - **Skills**: []
    - Standard React form implementation without specialized skills

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 3, 4)
  - **Blocks**: Task 7 (UI components depend on schema)
  - **Blocked By**: Task 1 (test setup provides foundation)

  **References**:

  **Form Pattern References**:
  - `src/app/tournament-registration/page.tsx:100-200` - Current form structure to replicate in schema
  - `src/lib/gamesData.ts:50-100` - Game-specific validation rules to implement
  - `src/types/tournament.ts:70-100` - Data structures to match

  **Validation References**:
  - Current client-side validation patterns to preserve
  - Game-specific team size and substitute limits

  **React Hook Form References**:
  - Research findings on React Hook Form + Zod integration patterns

  **WHY Each Reference Matters**:
  - Current form structure shows exact validation requirements
  - GamesData provides business rules that must be encoded in schema
  - Type definitions ensure frontend-backend type compatibility

  **Acceptance Criteria**:

  **TDD Workflow**:
  - [ ] RED: Form validation tests fail (no schema)
  - [ ] GREEN: Create base Zod schema for registration data
  - [ ] GREEN: Add game-specific validation rules
  - [ ] GREEN: Implement team data structure validation
  - [ ] REFACTOR: Optimize validation performance and add custom error messages
  - [ ] bun test src/components/tournament-registration/__tests__/form-schema.test.ts → PASS

  **Automated Verification**:
  ```bash
  # Agent runs:
  bun test src/components/tournament-registration/__tests__/form-schema.test.ts
  # Assert: Form schema validates correctly
  
  # Schema validation test:
  bun -e "import { tournamentSchema } from './src/components/tournament-registration/schema'; console.log('Schema valid:', !!tournamentSchema)"
  # Assert: Schema can be imported and instantiated
  ```

  **Evidence to Capture**:
  - [ ] Schema validation test output
  - [ ] Form configuration with React Hook Form + Zod resolver
  - [ ] Custom validation rules for game-specific requirements

  **Commit**: YES (group with Task 4)
  - Message: `feat(form): create comprehensive validation schema for tournament registration`
  - Files: Form schema files, validation utilities
  - Pre-commit: `bun test src/components/tournament-registration/__tests__/form-schema.test.ts`

### Wave 3: Frontend and UI Implementation

- [ ] 6. Refactor TournamentRegistrationPage to Use API

  **What to do**:
  - Remove direct Appwrite client usage from registration page
  - Implement API client functions for tournament operations
  - Update form submission to use API endpoints instead of direct DB writes
  - Add proper error handling for API responses
  - Maintain all existing functionality while switching to API-based approach

  **Must NOT do**:
  - Don't break existing form functionality
  - Don't remove existing validation logic
  - Don't change user experience flow

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Frontend refactoring requiring careful API integration
  - **Skills**: []
    - Standard React implementation without specialized skills

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (starts after backend complete)
  - **Blocks**: Task 8 (final testing depends on frontend refactoring)
  - **Blocked By**: Tasks 3, 4 (service and API must be ready)

  **References**:

  **Frontend Pattern References**:
  - `src/app/tournament-registration/page.tsx:1-100` - Current implementation to refactor
  - `src/app/tournament-registration/page.tsx:200-300` - Direct Appwrite usage to replace
  - `src/app/tournament-registration/page.tsx:300-400` - Form submission logic to update

  **API References**:
  - `src/app/api/tournaments/[id]/participants/route.ts` - New API endpoints to use
  - Form schema from Task 5 for request payload structure

  **Integration References**:
  - `src/contexts/AuthContext.tsx:150-200` - Authentication patterns for API calls

  **WHY Each Reference Matters**:
  - Current page shows exact functionality that must be preserved
  - API endpoints provide the new integration points
  - AuthContext shows how to properly authenticate API requests

  **Acceptance Criteria**:

  **TDD Workflow**:
  - [ ] RED: Frontend tests fail with direct Appwrite calls
  - [ ] GREEN: Implement API client functions
  - [ ] GREEN: Update form submission to use API
  - [ ] GREEN: Add proper error handling for API responses
  - [ ] REFACTOR: Optimize loading states and user feedback
  - [ ] bun test src/app/tournament-registration/__tests__/page.test.ts → PASS

  **Automated Verification**:
  ```bash
  # Agent runs:
  bun test src/app/tournament-registration/__tests__/page.test.ts
  # Assert: Frontend tests pass with API integration
  
  # Component smoke test:
  bun test --run src/app/tournament-registration/page.tsx
  # Assert: Page component renders without errors
  ```

  **Evidence to Capture**:
  - [ ] Frontend test output showing API integration works
  - [ ] Network requests in browser dev tools showing API calls instead of direct DB
  - [ ] Error handling displaying proper user feedback

  **Commit**: YES
  - Message: `refactor(frontend): migrate tournament registration to API-based architecture`
  - Files: `src/app/tournament-registration/page.tsx`, API client utilities
  - Pre-commit: `bun test src/app/tournament-registration/__tests__/page.test.ts`

- [ ] 7. Implement Modern UI Components and Progressive Disclosure

  **What to do**:
  - Design multi-step form layout with clear progress indicators
  - Implement team member management UI with add/remove/reorder functionality
  - Add progressive disclosure for optional information
  - Implement loading states, skeleton screens, and optimistic updates
  - Add comprehensive accessibility features (ARIA labels, keyboard navigation)
  - Style with Tailwind CSS for modern, responsive design

  **Must NOT do**:
  - Don't change core form functionality
  - Don't remove existing validation
  - Don't break mobile responsiveness

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Complex UI implementation requiring design skills and UX patterns
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Essential for creating modern, accessible form UI with good UX patterns

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Task 6)
  - **Blocks**: Task 8 (testing requires UI implementation)
  - **Blocked By**: Task 5 (form schema provides structure)

  **References**:

  **UI Pattern References**:
  - Research findings on modern form design patterns
  - Progressive disclosure techniques for complex forms
  - Team management UI patterns from research

  **Existing UI References**:
  - `src/app/tournament-registration/page.tsx:400-500` - Current form structure to enhance
  - `src/components/ui/` - Existing UI component library to leverage

  **Tailwind CSS References**:
  - Current Tailwind configuration and component patterns
  - Accessibility guidelines for form design

  **WHY Each Reference Matters**:
  - Research provides evidence-based UX patterns for implementation
  - Existing UI components maintain design consistency
  - Current form structure ensures all functionality is preserved

  **Acceptance Criteria**:

  **TDD Workflow**:
  - [ ] RED: UI component tests fail (no modern components)
  - [ ] GREEN: Implement multi-step form structure
  - [ ] GREEN: Add team member management UI
  - [ ] GREEN: Implement progressive disclosure and loading states
  - [ ] REFACTOR: Optimize accessibility and responsive design
  - [ ] bun test src/components/tournament-registration/__tests__/ui.test.ts → PASS

  **Automated Verification**:
  ```bash
  # Agent runs:
  bun test src/components/tournament-registration/__tests__/ui.test.ts
  # Assert: UI component tests pass
  
  # Playwright test:
  npx playwright test tournament-registration-ui.spec.ts
  # Assert: Modern UI renders and functions correctly
  ```

  **Evidence to Capture**:
  - [ ] Component test output showing UI functionality
  - [ ] Screenshots of modern UI in different states
  - [ ] Accessibility test results

  **Commit**: YES (group with Task 6)
  - Message: `feat(ui): implement modern multi-step tournament registration form`
  - Files: UI components, styles, accessibility features
  - Pre-commit: `bun test src/components/tournament-registration/__tests__/ui.test.ts`

- [ ] 8. Integration Testing and Flow Verification

  **What to do**:
  - Create comprehensive E2E tests for complete registration flow
  - Test all game types and team configurations
  - Verify error handling and edge cases
  - Performance testing for large team data
  - Cross-browser testing and responsive design verification
  - Security testing for authentication and data validation

  **Must NOT do**:
  - Don't skip testing any game types
  - Don't ignore error scenarios
  - Don't skip accessibility testing

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Comprehensive testing requiring E2E and performance validation
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Important for user experience testing and accessibility validation

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (final task)
  - **Blocks**: None (completion task)
  - **Blocked By**: Tasks 6, 7 (frontend and UI must be complete)

  **References**:

  **Test Pattern References**:
  - `e2e/contact-form-validation.spec.ts:1-50` - E2E test patterns to follow
  - `src/__tests__/integration.test.ts:80-120` - Integration test examples
  - `src/__tests__/performance.test.ts:1-30` - Performance testing patterns

  **Flow References**:
  - Complete tournament registration workflow requirements
  - All game types from gamesData.ts
  - Error scenarios from current implementation

  **WHY Each Reference Matters**:
  - E2E patterns show how to test complete user flows
  - Integration tests demonstrate backend testing approaches
  - Performance tests ensure no regression in response times

  **Acceptance Criteria**:

  **TDD Workflow**:
  - [ ] RED: E2E tests fail with incomplete flow
  - [ ] GREEN: Implement basic registration flow tests
  - [ ] GREEN: Add all game type variations
  - [ ] GREEN: Implement error scenario testing
  - [ ] GREEN: Add performance and accessibility tests
  - [ ] REFACTOR: Optimize test reliability and coverage
  - [ ] bun test && npx playwright test → ALL PASS

  **Automated Verification**:
  ```bash
  # Agent runs:
  bun test src/__tests__/integration/tournament-registration.test.ts
  # Assert: Integration tests pass
  
  npx playwright test tournament-registration-e2e.spec.ts
  # Assert: E2E tests pass across all scenarios
  
  # Performance test:
  bun test src/__tests__/performance/registration-load.test.ts
  # Assert: Performance benchmarks met
  ```

  **Evidence to Capture**:
  - [ ] Complete E2E test coverage report
  - [ ] Performance benchmark results
  - [ ] Accessibility audit results
  - [ ] Cross-browser testing results

  **Commit**: YES
  - Message: `test(tournament): comprehensive integration and E2E test coverage`
  - Files: Test files, performance benchmarks, audit results
  - Pre-commit: `bun test && npx playwright test`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1-2 | `feat(test): setup service layer test infrastructure and research patterns` | Test files, research docs | `bun test --dry-run` |
| 3 | `feat(service): implement real database persistence for tournament registration` | `src/lib/services/participantManagement.ts` | `bun test src/lib/services/__tests__/*.test.ts` |
| 4-5 | `feat(api): support full tournament registration payload with real persistence` | API route, form schema | `bun test src/app/api/tournaments/**/__tests__/*.test.ts` |
| 6-7 | `refactor(frontend): migrate tournament registration to API-based architecture with modern UI` | Frontend page, UI components | `bun test src/app/tournament-registration/__tests__/*.test.ts` |
| 8 | `test(tournament): comprehensive integration and E2E test coverage` | Test files, benchmarks | `bun test && npx playwright test` |

---

## Success Criteria

### Verification Commands
```bash
# Service layer tests
bun test src/lib/services/__tests__/participantManagement.test.ts
# Expected: All database operations pass with real Appwrite integration

# API endpoint tests  
bun test src/app/api/tournaments/[id]/participants/__tests__/route.test.ts
# Expected: Full payload handling with proper validation

# Frontend integration tests
bun test src/app/tournament-registration/__tests__/page.test.ts
# Expected: API-based registration flow works correctly

# E2E tests
npx playwright test tournament-registration.spec.ts
# Expected: Complete user journey from form submission to confirmation

# Performance benchmarks
bun test src/__tests__/performance/registration.test.ts
# Expected: Response times <500ms for all operations
```

### Final Checklist
- [ ] All database operations go through service layer (no direct client-side Appwrite)
- [ ] API handles full registration payload including complex team structures
- [ ] Frontend uses API exclusively for all tournament operations
- [ ] Modern UI provides progressive disclosure and team management
- [ ] Student ID uniqueness validation preserved
- [ ] Game-driven form generation and validation maintained
- [ ] Team captain authorization system intact
- [ ] All tests pass (unit, integration, E2E)
- [ ] Performance benchmarks met
- [ ] Accessibility audit passed
- [ ] Cross-browser compatibility verified