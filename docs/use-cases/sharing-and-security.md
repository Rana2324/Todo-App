# Use Case: Cryptographic Sharing & Public Access

## Primary Actor
Authenticated Todo Owner & External Public Recipient

## Pre-conditions
- Owner is authenticated and owns the specific Todo item.

## Main Success Scenario
1. Todo owner clicks the "Share" action on a Todo item.
2. Server Action calls `shareService.createShareLink(userId, todoId)`.
3. System verifies ownership, constructs `{ todoId }` payload, and encrypts it using PASETO v4 local with symmetric key `PASETO_LOCAL_KEY`.
4. The generated link `/share/[token]` is displayed and copied to the owner's clipboard.
5. Owner shares link with an external party.
6. Recipient opens `/share/[token]` in any browser (no login required).
7. Server Component on `/share/[token]/page.tsx` calls `shareService.getSharedTodo(token)`.
8. System decrypts and cryptographically verifies token payload.
9. Database retrieves the specific Todo item and renders a clean, read-only public card.

## Alternative Scenarios
- **Tampered / Expired Token**: If the token string is altered or invalid, PASETO verification fails (`null`), and the page renders a clean 404 / "Invalid or expired share link" message.
