# ADR 004: Isolation of External API Providers

## Status
Accepted

## Context
Enterprise applications frequently integrate with 3rd-party SaaS platforms (OpenAI, AWS S3, Google Business Profile, Instagram/Meta Graph, Geoapify). Direct vendor SDK calls scattered across UI or business logic create high coupling, make testing difficult, and break local development when vendor API keys are missing.

## Decision
We enforce strict isolation for all external third-party SDKs under `apps/web/lib/providers/`:
1. **Provider Isolation**:
   - `openai.ts`: OpenAI client instantiation.
   - `s3.ts`: AWS S3 client wrapper.
   - `geoapify.ts`: Geoapify location search REST client.
   - `google-business.ts`: Google Business Profile REST client.
   - `instagram.ts`: Meta Graph Instagram Media REST client.
2. **Service Fallbacks & Graceful Degradation**:
   - Business services (`lib/services/` and `lib/ai/`) wrap provider calls with configuration checks (`lib/env.ts`).
   - If an API key is missing or an external API is temporarily down, services gracefully fall back to deterministic mock data without crashing the UI.
   - Media uploads use Sharp for image optimization and fall back to local disk storage (`public/uploads/`) during local development when S3 credentials are unset.

## Consequences
- **Zero-Friction Onboarding**: New developers can run and test the entire project locally without needing 5 paid external vendor API accounts.
- **Resilience**: Network failures in external APIs do not bring down core application functionality.
- **Provider Swappability**: Replacing an external provider (e.g. switching from Geoapify to Foursquare or Google Maps) only touches a single file under `lib/providers/`.
