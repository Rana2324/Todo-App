# Non-Functional Requirements Specification (NFRS)

This document specifies quality attributes, security standards, and performance constraints.

## NFR-01: Security & Confidentiality
- **NFR-01.1 Session Security**: Session tokens are transmitted exclusively in `HttpOnly`, `SameSite=Lax`, `Secure` cookies.
- **NFR-01.2 Token Encryption**: Public share links utilize authenticated symmetric encryption via PASETO v4 local with a 256-bit key.
- **NFR-01.3 Input Sanitation**: All inputs from HTTP requests or Server Actions are validated via strict Zod schemas before hitting business or database layers.
- **NFR-01.4 Tenant Isolation**: Zero cross-tenant data leakage; every SQL query filtering user records is scoped by `userId`.

## NFR-02: Maintainability & Architectural Cleanliness
- **NFR-02.1 Route Locality**: Components and Server Actions specific to a single route are stored in route-local `_components` and `_lib` folders.
- **NFR-02.2 Strict Layering**: Repositories exclusively interact with Drizzle ORM; Services contain business logic; Server Actions handle orchestration.
- **NFR-02.3 TypeScript Strict Mode**: 100% strict TypeScript typing without implicit `any` escapes.

## NFR-03: Performance & Optimization
- **NFR-03.1 Server Components**: Static and initial page content is pre-rendered on the server to minimize client bundle sizes.
- **NFR-03.2 Asset Compression**: Media files are compressed and converted to WebP on upload using Sharp.
- **NFR-03.3 Fast Route Transitions**: Session validation in `proxy.ts` executes in microseconds using lightweight cookie inspection.

## NFR-04: Testability & Quality Assurance
- **NFR-04.1 Unit Testing**: All Zod validation schemas, domain services, cryptographic helpers, and notification engines are covered by Vitest unit tests.
- **NFR-04.2 Isolated Mocking**: Service tests verify business logic by mocking repository interfaces without requiring live database connections.
- **NFR-04.3 Component Integration**: Critical UI form interactions are verified via Testing Library and jsdom.
