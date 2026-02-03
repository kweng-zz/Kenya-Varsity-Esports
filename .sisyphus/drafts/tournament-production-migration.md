# Draft: Tournament Registration Production Migration

## Requirements (confirmed)
- Move tournament registration from client-side Appwrite to server-side API
- Implement real database persistence using node-appwrite
- Refactor frontend to use API instead of direct Appwrite SDK
- Redesign UI for better UX with modern form patterns
- Maintain strict type safety and complex team data structure support

## Technical Decisions
- Use existing tournament_registrations collection schema as foundation
- Implement service layer architecture in participantManagement.ts
- Replace in-memory Map storage with actual Appwrite database operations
- Keep student ID as primary key for conflict prevention
- Preserve game-driven form generation and validation

## Research Findings
- **Current Architecture**: Dual-service with direct Appwrite + mock service layer
- **Data Model**: JSON nested structure for teams with players/substitutes
- **Auth System**: Multi-layer with Appwrite auth + team captain authorization
- **Validation**: Client-side + game-specific + business logic validation
- **Complexity**: Dynamic team structures based on game rules (1-5 players + 0-2 subs)

## Open Questions
- What's the preferred form library? (React Hook Form + Zod recommended)
- Should we implement optimistic UI updates for better UX?
- Any specific design system requirements beyond Tailwind?
- Load testing requirements for tournament registration surges?

## Scope Boundaries
- INCLUDE: Backend service implementation, API endpoint updates, frontend refactor, UI redesign
- EXCLUDE: Database schema changes (use existing), authentication system overhaul
- GUARDRAILS: Must preserve student ID uniqueness validation, maintain game rules engine