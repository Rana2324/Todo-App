# ADR 001: Monorepo Structure & Route-Local Organization

## Status
Accepted

## Context
In large enterprise applications like MEO Tool, codebases often suffer from monolithic tangling where components, actions, and utilities are dumped into a single global folder. This makes code ownership ambiguous, increases cognitive load, and slows down maintenance.

## Decision
We adopted a **monorepo structure** partitioned into `apps/` and `packages/`:
1. **`apps/web`**: Contains the Next.js application shell, routes, local UI components, and domain business services.
2. **Route-Local Folders (`_components/` and `_lib/`)**:
   - Any component or Server Action used solely by a single route (e.g. `(dashboard)/todos/_components/TodoForm.tsx` or `(dashboard)/todos/_lib/actions.ts`) lives directly inside that route folder.
   - Global components in `components/ui` or `components/shared` are reserved strictly for cross-cutting primitives (Radix UI wrappers, Navigation bar, Theme providers).
3. **`packages/`**: Scalable workspace boundaries (`packages/ui`, `packages/types`, `packages/utils`, `packages/config`) ready for internal package extraction when multiple client apps are introduced.

## Consequences
- **High Cohesion**: Developers working on `/todos` find all related forms, dialogs, actions, and sub-views in one place.
- **Clear Boundaries**: Eliminates sprawling global folders.
- **Easy Refactoring**: Deleting or refactoring a feature route naturally deletes all its private components without leaving dead code in global directories.
