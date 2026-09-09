# ADR 003: Authentication & Cryptographic Token Sharing (Better Auth + PASETO)

## Status
Accepted

## Context
Applications require two distinct identity & authorization patterns:
1. **User Authentication & Session Management**: Stateful session verification, password hashing, and role-based access control (RBAC).
2. **Stateless Public Resource Sharing**: Allowing a user to share an individual resource (e.g. a specific todo) with unauthenticated external users without exposing their credentials or opening up arbitrary database access.

## Decision
1. **Better Auth**: Selected for user management, credential authentication, session cookies (`better-auth.session_token`), and administrative role guards (`user.role === 'admin'`).
2. **Route Guarding (`proxy.ts`)**: Evaluates incoming request session cookies and redirects unauthenticated traffic to `/login` before rendering protected dashboard routes.
3. **PASETO (Platform-Agnostic Security Tokens) v4 Local**:
   - Used for the `/share/[token]` capability.
   - Symmetric authenticated encryption (`v4.local`) using `paseto-ts` with a 256-bit key (`PASETO_LOCAL_KEY`).
   - Encrypts the payload `{ todoId }` into an opaque, tamper-proof token string with built-in expiration.
   - Prevents predictable ID harvesting and guarantees token authenticity without requiring a separate "shares" table in the database.

## Consequences
- **Robust Security**: Session management is standards-compliant and immune to common JWT vulnerabilities (e.g. algorithm confusion).
- **Stateless Sharing**: Share links are self-contained and cryptographically verified at zero database overhead for token validation.
