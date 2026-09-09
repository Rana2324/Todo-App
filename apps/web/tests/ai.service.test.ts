import { describe, expect, it } from "vitest";

import { aiService } from "@/lib/ai/ai.service";

describe("aiService (mock mode — no OPENAI_API_KEY in test env)", () => {
  it("returns 1-3 canned suggestions instead of throwing", async () => {
    const suggestions = await aiService.generateTodoSuggestions(
      "plan my day",
    );

    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions.length).toBeLessThanOrEqual(3);

    for (const suggestion of suggestions) {
      expect(suggestion.title.length).toBeGreaterThan(0);
    }
  });
});
