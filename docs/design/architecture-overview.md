# Architecture Overview & System Topology

The Todo application serves as an educational blueprint of the office **MEO Tool monorepo architecture**. It demonstrates how enterprise-grade scalability, type safety, route locality, and provider isolation can be applied in Next.js App Router applications.

```mermaid
graph TD
    subgraph Client["Client Tier (Browser)"]
        UI["Route-Local React Components<br/>(apps/web/app/.../_components)"]
        Forms["Client Forms & Hooks<br/>(useSession, useState, sonner)"]
    end

    subgraph AppRouter["Next.js App Shell (apps/web)"]
        Proxy["proxy.ts<br/>(Route Session Guard)"]
        Pages["Server Component Pages<br/>(page.tsx)"]
        Actions["Server Actions<br/>(_lib/actions.ts)"]
    end

    subgraph CoreLayer["Business & Domain Core (apps/web/lib)"]
        Validations["Zod Schemas<br/>(schema/*)"]
        Services["Business Services<br/>(lib/services/*)"]
        AI["AI Suggestions Engine<br/>(lib/ai/*)"]
        Notifications["Notification Dispatcher<br/>(lib/notifications/*)"]
        Domain["Domain Entities<br/>(lib/domain/*)"]
    end

    subgraph Providers["External Providers (lib/providers)"]
        OpenAI["OpenAI (gpt-4o-mini)"]
        S3["AWS S3 / Sharp"]
        Geoapify["Geoapify Places API"]
        GoogleGBP["Google Business Profile API"]
        MetaIG["Instagram Graph API"]
    end

    subgraph DataTier["Persistence Tier (apps/web/drizzle)"]
        Repositories["Drizzle Repositories<br/>(todo.repository.ts)"]
        DrizzleClient["Drizzle ORM Client<br/>(client.ts)"]
        Postgres[("Neon PostgreSQL DB")]
    end

    UI --> Actions
    Pages --> Services
    Actions --> Validations
    Actions --> Services
    Services --> Domain
    Services --> Repositories
    Services --> Notifications
    AI --> OpenAI
    Services --> Providers
    Repositories --> DrizzleClient
    DrizzleClient --> Postgres
```

## Core Architectural Invariants

1. **Unidirectional Dependency Flow**:
   - UI / Components depend on Server Actions or Services.
   - Server Actions depend on Zod validation and Services.
   - Services depend on Repositories and Providers.
   - Repositories depend on Drizzle ORM and Database schemas.
   - **Crucial Rule**: DB logic never leaks into UI, and UI logic never leaks into Services.

2. **Tenant Isolation by Construction**:
   - Every read and write operation executed against user resources (`todos`, `uploads`) requires a valid `userId`.
   - The repository explicitly binds the user ID into the SQL `WHERE` clause.

3. **Graceful Fallbacks**:
   - All third-party providers (AI, Maps, S3, Meta) implement intelligent fallbacks when API keys are absent, ensuring that developers can test and evaluate the system without third-party vendor dependencies.
