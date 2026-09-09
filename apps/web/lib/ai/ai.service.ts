import { isOpenAiConfigured } from "@/lib/env";
import { getOpenAiClient } from "@/lib/providers/openai";

import { suggestionsResponseSchema } from "@/schema/ai";

import type { TodoSuggestion } from "@/schema/ai";

const MOCK_SUGGESTIONS: TodoSuggestion[] = [
  {
    title: "Review today's top priorities",
    body: "Pick the 3 most important tasks and tackle those first.",
  },
  {
    title: "Take a 10-minute break",
    body: "Step away from the screen and stretch.",
  },
  {
    title: "Plan tomorrow's schedule",
    body: "Write down what needs to get done tomorrow before you log off.",
  },
];

export const aiService = {
  /**
   * Returns 1-3 short todo suggestions for `prompt`.
   * Falls back to canned mock suggestions when OPENAI_API_KEY is unset,
   * or when the real call fails for any reason (bad key, rate limit,
   * malformed JSON) — this action should never throw into the UI.
   */
  async generateTodoSuggestions(prompt: string): Promise<TodoSuggestion[]> {
    if (!isOpenAiConfigured()) {
      return MOCK_SUGGESTIONS;
    }

    try {
      const completion = await getOpenAiClient().chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              'You suggest short todo list items. Respond ONLY with JSON of the shape {"suggestions":[{"title":"...","body":"..."}]}, 1 to 3 suggestions, each title under 60 characters and each body under 200 characters.',
          },
          { role: "user", content: prompt },
        ],
      });

      const raw = completion.choices[0]?.message?.content ?? "{}";
      const parsed = suggestionsResponseSchema.parse(JSON.parse(raw));

      return parsed.suggestions;
    } catch {
      return MOCK_SUGGESTIONS;
    }
  },
};
