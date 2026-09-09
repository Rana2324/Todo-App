import { z } from "zod";

const requiredEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.string().min(1),
});

let cachedEnv: z.infer<typeof requiredEnvSchema> | null = null;

/**
 * Validates the app-wide required env vars on first call, then caches — not
 * at module-import time. Importing this file (e.g. just for `isXConfigured()`)
 * must never fail just because unrelated required vars aren't set (a unit
 * test for the AI service shouldn't need a real `DATABASE_URL`).
 */
export function getEnv() {
  if (!cachedEnv) {
    cachedEnv = requiredEnvSchema.parse({
      DATABASE_URL: process.env.DATABASE_URL,
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    });
  }

  return cachedEnv;
}

/**
 * Kept separate from `getEnv()` — only `lib/paseto.ts` needs this one var,
 * so it shouldn't have to drag in the DB/auth required-vars check too.
 */
export function getPasetoKey(): string {
  return z.string().min(1).parse(process.env.PASETO_LOCAL_KEY);
}

// Optional external integrations — every feature that uses these must keep
// working (in a mock/fallback mode) when the corresponding key is absent.
export const isOpenAiConfigured = () => !!process.env.OPENAI_API_KEY;

export const isS3Configured = () =>
  !!process.env.AWS_ACCESS_KEY_ID &&
  !!process.env.AWS_SECRET_ACCESS_KEY &&
  !!process.env.AWS_REGION &&
  !!process.env.AWS_S3_BUCKET;

export const isGeoapifyConfigured = () => !!process.env.GEOAPIFY_API_KEY;

export const isGbpConfigured = () => !!process.env.GOOGLE_BUSINESS_API_KEY;

export const isInstagramConfigured = () =>
  !!process.env.META_GRAPH_ACCESS_TOKEN;
