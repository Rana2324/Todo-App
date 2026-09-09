import { isGeoapifyConfigured } from "@/lib/env";
import { searchGeoapifyPlaces } from "@/lib/providers/geoapify";

import type { Place } from "@/lib/domain/place";

const MOCK_PLACES: Place[] = [
  { id: "mock-1", name: "Central Cafe, Dhaka", lat: 23.8103, lng: 90.4125 },
  { id: "mock-2", name: "Riverside Books, Dhaka", lat: 23.7808, lng: 90.4194 },
  { id: "mock-3", name: "Green Park, Dhaka", lat: 23.7461, lng: 90.3742 },
];

export const placeService = {
  /**
   * Falls back to a small, loosely-matched mock place list when
   * GEOAPIFY_API_KEY is unset, or when the real call fails for any reason.
   */
  async searchPlaces(query: string): Promise<Place[]> {
    if (!isGeoapifyConfigured()) {
      const q = query.toLowerCase();
      const matches = MOCK_PLACES.filter((place) =>
        place.name.toLowerCase().includes(q),
      );
      return matches.length > 0 ? matches : MOCK_PLACES;
    }

    try {
      return await searchGeoapifyPlaces(query);
    } catch {
      return MOCK_PLACES;
    }
  },
};
