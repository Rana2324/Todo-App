# Use Case: User Authentication & Profile Management

## Primary Actor
End User (Unauthenticated or Authenticated)

## Pre-conditions
- User has access to a modern web browser.
- Network connection to the server is active.

## Main Success Scenario (Registration & Login)
1. User visits `/registration` and fills in name, email, password, and password confirmation.
2. Client-side form validates input shape via `registerSchema` (Zod).
3. Better Auth `signUp.email` creates the user account in Neon Postgres, generates a session, and sets the `better-auth.session_token` cookie.
4. Browser receives success response and redirects to `/todos`.
5. User navigates to `/profile` to view their account metadata, role, and active session status.

## Scenario: Password Change
1. User navigates to `/change-password` (or clicks "Change Password" in `/profile`).
2. User provides `currentPassword`, `newPassword` (min 6 chars), and `confirmPassword`.
3. User selects whether to revoke active sessions across other devices.
4. `ChangePasswordForm` validates schema and invokes `authClient.changePassword`.
5. On success, a toast confirmation appears and the user is redirected to `/profile`.

## Alternative Scenarios
- **Invalid Credentials**: Toast error alert displays "Invalid email or password", and the user stays on `/login`.
- **Session Expired**: Middleware / `proxy.ts` detects missing session cookie and redirects user to `/login`.
