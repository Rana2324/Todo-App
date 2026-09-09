# System Sequence Flows

This document details key operational sequence flows through the layered architecture.

## 1. Authentication & Protected Route Access

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Browser
    participant Proxy as proxy.ts
    participant AuthRoute as /api/auth/[...all]
    participant BetterAuth as lib/auth/auth.ts
    participant DB as Postgres (user/session)

    User->>Browser: Fill Login Form & Click Submit
    Browser->>AuthRoute: POST /api/auth/sign-in/email { email, password }
    AuthRoute->>BetterAuth: Validate credentials
    BetterAuth->>DB: Query user & verify password hash
    DB-->>BetterAuth: User record verified
    BetterAuth->>DB: Insert session token row
    BetterAuth-->>Browser: Set-Cookie: better-auth.session_token (HttpOnly, Secure)
    Browser-->>User: Redirect to /todos

    User->>Browser: Navigate to /todos
    Browser->>Proxy: GET /todos (with session_token cookie)
    Proxy->>Proxy: Check getSessionCookie(request)
    alt No Cookie
        Proxy-->>Browser: 302 Redirect to /login
    else Cookie Present
        Proxy-->>Browser: Next() -> Render Server Component Page
    end
```

## 2. Todo Creation & Validation Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Form as TodoForm.tsx (_components)
    participant Action as actions.ts (_lib)
    participant Zod as schema/todo.ts
    participant Service as todo.service.ts
    participant Repo as todo.repository.ts
    participant DB as Postgres (todos table)

    User->>Form: Enter Title, Description & Click Add
    Form->>Action: invoke createTodoAction({ title, body })
    Action->>Action: requireUserId() (verify session)
    Action->>Zod: createTodoSchema.parse(input)
    Zod-->>Action: Validated CreateTodoInput
    Action->>Service: todoService.create(userId, validatedData)
    Service->>Repo: todoRepository.insert(userId, validatedData)
    Repo->>DB: INSERT INTO todos (id, user_id, title, body, completed) VALUES (...)
    DB-->>Repo: Inserted row
    Repo-->>Service: Raw DB Row
    Service->>Service: toTodoType(row) (null sanitization)
    Service-->>Action: Domain TodoType entity
    Action->>Action: revalidatePath("/todos")
    Action-->>Form: Return Success Result
    Form-->>User: Render new Todo item in list
```

## 3. PASETO Cryptographic Share Flow

```mermaid
sequenceDiagram
    autonumber
    actor Owner as Todo Owner
    actor Recipient as Public Viewer
    participant UI as TodoItem.tsx
    participant ShareAction as actions.ts
    participant ShareService as share.service.ts
    participant Paseto as lib/paseto.ts
    participant SharePage as /share/[token]/page.tsx

    Owner->>UI: Click "Share" button
    UI->>ShareAction: shareTodoAction(todoId)
    ShareAction->>ShareService: createShareLink(userId, todoId)
    ShareService->>ShareService: Verify ownership (userId === todo.userId)
    ShareService->>Paseto: signShareToken({ todoId })
    Paseto-->>ShareService: Encrypted token "v4.local.XXXX..."
    ShareService-->>UI: Return share URL "/share/v4.local.XXXX..."
    UI-->>Owner: Copy link to clipboard

    Recipient->>SharePage: Open GET /share/v4.local.XXXX...
    SharePage->>ShareService: getSharedTodo(token)
    ShareService->>Paseto: verifyShareToken(token)
    alt Invalid / Expired / Tampered Token
        Paseto-->>ShareService: null
        ShareService-->>SharePage: null
        SharePage-->>Recipient: Render 404 / "Invalid or Expired Link"
    else Valid Token
        Paseto-->>ShareService: Payload { todoId }
        ShareService->>Service: todoService.findOne(payload.todoId)
        Service-->>SharePage: Todo domain object
        SharePage-->>Recipient: Render public read-only todo view
    end
```
