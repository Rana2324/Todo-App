# ADR 002: Layered Service-Repository Pattern

## Status
Accepted

## Context
Directly embedding database queries, validation rules, external API calls, and UI state mutations in Next.js Server Actions or UI components leads to "Fat Controller" / "Fat Action" anti-patterns. This makes unit testing impossible without live databases and couples UI logic tightly to database schema definitions.

## Decision
We enforce a strict 4-tier layered architecture:
```
UI Component → Server Action (_lib/actions.ts) → Domain Service (lib/services/) → Repository (drizzle/) → Database
```

1. **Validation Layer (`schema/`)**: Zod schemas act as the single source of truth for runtime input validation.
2. **Server Actions (`_lib/actions.ts`)**: Thin orchestrators. They authenticate the user (`requireUserId()`), parse inputs with Zod, invoke the appropriate domain service, and call `revalidatePath()`.
3. **Domain Services (`lib/services/`)**: Contain pure business logic and data mapping (e.g. converting raw database rows with nulls to UI-friendly domain models). Never touches SQL or Drizzle directly.
4. **Repositories (`drizzle/*.repository.ts`)**: The ONLY files in the application permitted to import the database instance (`db`) or execute SQL queries. Every query is scoped by `userId` to enforce tenant isolation.

## Consequences
- **Testability**: Services can be unit tested with mock repositories in milliseconds without needing a real database.
- **Maintainability**: Swapping database drivers or changing schema column types only affects the repository layer.
- **Security**: Hard tenant isolation is enforced at the repository query boundary.
