import { z } from "zod";

export const aiPromptSchema = z
  .string()
  .trim()
  .min(1, "Prompt is required")
  .max(300, "Prompt is too long");

export const suggestionSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().max(2000).optional(),
});

export const suggestionsResponseSchema = z.object({
  suggestions: z.array(suggestionSchema).min(1).max(3),
});

export type TodoSuggestion = z.infer<typeof suggestionSchema>;
