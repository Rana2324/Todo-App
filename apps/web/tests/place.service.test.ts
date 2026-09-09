import { describe, expect, it } from "vitest";

import { placeService } from "@/lib/services/place.service";
import { gbpService } from "@/lib/services/gbp.service";
import { instagramService } from "@/lib/services/instagram.service";

describe("placeService (mock mode — no GEOAPIFY_API_KEY in test env)", () => {
  it("returns places matching the query", async () => {
    const results = await placeService.searchPlaces("Cafe");

    expect(results.length).toBeGreaterThan(0);
    expect(
      results.some((place) => place.name.toLowerCase().includes("cafe")),
    ).toBe(true);
  });

  it("falls back to all mock places for an unmatched query", async () => {
    const results = await placeService.searchPlaces("zzz-no-match-zzz");

    expect(results.length).toBeGreaterThan(0);
  });
});

describe("gbpService (mock mode — no GOOGLE_BUSINESS_API_KEY in test env)", () => {
  it("returns mock business details instead of throwing", async () => {
    const details = await gbpService.getBusinessDetails("mock-1");

    expect(details.rating).not.toBeNull();
  });
});

describe("instagramService (mock mode — no META_GRAPH_ACCESS_TOKEN in test env)", () => {
  it("returns mock posts instead of throwing", async () => {
    const posts = await instagramService.getRecentPosts("mock-1");

    expect(posts.length).toBeGreaterThan(0);
  });
});
