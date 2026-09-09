import OpenAI from "openai";

let client: OpenAI | null = null;

/** Lazily-created, cached OpenAI client — reads `OPENAI_API_KEY` from `process.env`. */
export function getOpenAiClient(): OpenAI {
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  return client;
}
