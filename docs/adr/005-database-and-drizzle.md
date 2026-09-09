# ADR 005: Database Schema & Drizzle ORM Repository Pattern

## Status
Accepted

## Context
TypeScript applications need end-to-end type safety between the database schema and runtime application code, as well as deterministic, version-controlled database migrations.

## Decision
1. **Drizzle ORM + Neon Postgres**:
   - Drizzle ORM provides zero-overhead, type-safe SQL query generation with TypeScript schema definitions.
   - Schemas are partitioned into `apps/web/drizzle/schema.ts` (application entities like `todos`) and `apps/web/drizzle/auth-schema.ts` (Better Auth entities like `user`, `session`, `account`, `verification`).
2. **Migrations Directory**:
   - `apps/web/drizzle/migrations/` stores versioned SQL migration scripts generated via `drizzle-kit generate`.
3. **Repository Pattern**:
   - `apps/web/drizzle/todo.repository.ts` encapsulates all query execution.
   - All mutations and lookups are parameterized and explicitly filtered by `userId`.

## Consequences
- **Type Safety**: Database columns automatically infer TypeScript types without code duplication.
- **Auditable Evolution**: Database schema changes are tracked in source control via SQL migration files.
- **Scoped Security**: Queries cannot accidentally leak cross-tenant data.
