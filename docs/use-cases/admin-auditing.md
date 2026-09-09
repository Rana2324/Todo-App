# Use Case: Admin Role Authorization & User Directory Auditing

## Primary Actor
System Administrator (`role === "admin"`)

## Pre-conditions
- User has logged in with an account having `role: "admin"` in the Better Auth database.

## Main Success Scenario
1. Administrator navigates to `/admin/overview` or `/admin/users`.
2. Server Component calls `isAdmin()`. The helper reads the caller's session from headers and verifies `session.user.role === "admin"`.
3. `/admin/overview` renders the admin navigation hub and summary statistics.
4. `/admin/users` invokes `auth.api.listUsers()` to retrieve registered users.
5. System renders an administrative audit table showing names, email addresses, and roles across all registered accounts.

## Alternative Scenarios
- **Unauthorized Access Attempt**: If a standard user (`role: "user"`) attempts to visit `/admin/*`, `isAdmin()` evaluates to false and immediately executes `redirect("/todos")`.
