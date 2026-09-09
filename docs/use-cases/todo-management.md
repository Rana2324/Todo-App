# Use Case: Todo Item Lifecycle Management

## Primary Actor
Authenticated User

## Pre-conditions
- User has logged in and has an active session.

## Main Success Scenario
1. User navigates to `/todos`.
2. Server Component fetches user-scoped todos via `todoService.listForUser(userId)` and renders the initial list.
3. User enters a task title in `TodoForm` and clicks "Add".
4. Server Action `createTodoAction` receives data, verifies caller session, parses input via `createTodoSchema`, and delegates to `todoService.create`.
5. Repository executes parameterized insert into Postgres and returns the row.
6. Server Action invokes `revalidatePath("/todos")`, updating the UI instantly with the new item.
7. User can toggle completion status (line-through strike), click edit dialog to modify text, or delete item via confirmation alert.

## Extension: AI-Assisted Planning
1. User clicks the AI suggestions sparkle button and inputs a goal prompt (e.g. "Prepare product launch").
2. Server Action calls `aiService.generateTodoSuggestions(prompt)`.
3. System prompts OpenAI `gpt-4o-mini` (or falls back to mock suggestions) and validates returned JSON schema.
4. Suggestions render as quick-add cards; clicking an item automatically saves it to the user's Todo list.
