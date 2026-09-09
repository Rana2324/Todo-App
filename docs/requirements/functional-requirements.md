# Functional Requirements Specification (FRS)

This document outlines all functional requirements fulfilled by the application.

## FR-01: Authentication & User Management
- **FR-01.1 Registration**: Users can register with full name, email, and password (minimum 6 characters) via `/registration`.
- **FR-01.2 Login**: Registered users can authenticate via `/login` and receive a secure HTTP-only session cookie.
- **FR-01.3 Session Termination**: Users can sign out from any view via the shared Navbar or Profile menu.
- **FR-01.4 Password Management**: Users can update their account password via `/change-password` with option to revoke active secondary sessions.
- **FR-01.5 Profile Inspection**: Authenticated users can view their account metadata, role, ID, and session expiration at `/profile`.

## FR-02: Route Protection & Authorization (RBAC)
- **FR-02.1 Route Guarding**: Unauthenticated visits to `/todos`, `/profile`, or `/admin` are intercepted by `proxy.ts` and redirected to `/login`.
- **FR-02.2 Admin RBAC**: Non-admin users attempting to access `/admin/overview` or `/admin/users` are redirected to `/todos`.
- **FR-02.3 User Directory Auditing**: Authorized administrators can inspect all registered user accounts at `/admin/users`.

## FR-03: Todo Lifecycle Management
- **FR-03.1 Creation**: Users can create todos with a required title (1–200 characters) and optional details/body (up to 2000 characters).
- **FR-03.2 Persistence**: All todos are persisted in PostgreSQL via Drizzle ORM.
- **FR-03.3 Tenant Isolation**: Every user only sees and modifies their own todos.
- **FR-03.4 Status Toggling**: Users can toggle todos between pending and completed states.
- **FR-03.5 Inline & Modal Editing**: Users can edit title and description of existing todos.
- **FR-03.6 Deletion**: Users can delete todos with confirmation.
- **FR-03.7 Filtering & Searching**: Users can filter todos by status (all, active, completed) and search by keyword.

## FR-04: AI-Assisted Task Planning
- **FR-04.1 Task Generation**: Users can enter a prompt (e.g. "Prepare for presentation") and receive 1–3 structured task suggestions powered by OpenAI `gpt-4o-mini`.
- **FR-04.2 Suggestion Adoption**: Users can click an AI suggestion to automatically populate and create a new Todo item.

## FR-05: Geolocation & Social Insights
- **FR-05.1 Place Search**: Users can search for physical venues via Geoapify Geocoding API.
- **FR-05.2 Location Attachment**: Users can attach a selected place (ID, name, latitude, longitude) to any Todo.
- **FR-05.3 Business & Social Intelligence**: Viewing an attached place displays real or mock Google Business Profile ratings/hours and Instagram feed media.

## FR-06: Media Attachment & Optimization
- **FR-06.1 Image Upload**: Users can attach an image to a Todo item.
- **FR-06.2 Optimization**: Uploaded images are automatically resized to max 800px width and converted to WebP format via Sharp.
- **FR-06.3 Dual Storage**: Uploads are stored in AWS S3 when configured or cached locally in `public/uploads/` during local development.

## FR-07: PASETO Cryptographic Sharing
- **FR-07.1 Share Token Generation**: Users can generate a secure, encrypted PASETO v4 local token for any owned Todo.
- **FR-07.2 Public Share Access**: Unauthenticated visitors can view the shared Todo at `/share/[token]` with verified cryptographic integrity.
