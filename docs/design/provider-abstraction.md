# Provider Abstraction & Fault Tolerance

In production monorepo architectures like MEO Tool, external API integrations must be decoupled from UI and business logic to prevent external rate limits, network timeouts, or missing configurations from halting local development or crashing core user journeys.

## Provider Overview Matrix

| Provider | File | Vendor / Protocol | Fallback Strategy | Primary Consumer |
|---|---|---|---|---|
| **OpenAI** | `lib/providers/openai.ts` | OpenAI REST API (`gpt-4o-mini`) | Return canned high-quality mock task suggestions | `lib/ai/ai.service.ts` |
| **AWS S3 / Sharp** | `lib/providers/s3.ts` | S3 SDK (`@aws-sdk/client-s3`) + Sharp | Sharp WebP optimization + local filesystem storage in `public/uploads/` | `lib/services/upload.service.ts` |
| **Geoapify** | `lib/providers/geoapify.ts` | Geoapify Geocoding & Places REST API | Filter deterministic mock places list | `lib/services/place.service.ts` |
| **Google Business** | `lib/providers/google-business.ts` | Google My Business API | Return structured mock rating, review count, and business hours | `lib/services/gbp.service.ts` |
| **Instagram / Meta** | `lib/providers/instagram.ts` | Meta Graph API | Return structured mock recent posts & captions | `lib/services/instagram.service.ts` |

## Design Rules for Providers

1. **Configuration Probing (`lib/env.ts`)**:
   - Every provider has an associated predicate function in `lib/env.ts` (e.g. `isOpenAiConfigured()`, `isS3Configured()`, `isGeoapifyConfigured()`).
   - The predicate checks for the presence and non-emptiness of the required environment variables.

2. **Zero Throw Contract for Fallbacks**:
   - Calling a business service (e.g. `placeService.searchPlaces(query)`) will never reject with an unhandled network error to the UI.
   - If the API key is not configured OR if the external HTTP request fails (network error, rate limit, timeout, invalid JSON response), the service logs a trace and yields the mock fallback structure.

3. **Strict Domain Typing**:
   - External provider payloads (which often contain vendor-specific noise like camelCase vs snake_case, arbitrary nested metadata, or deprecated properties) are mapped into clean domain models (`lib/domain/place.ts`, `lib/domain/todo.ts`) before being returned to UI components.
