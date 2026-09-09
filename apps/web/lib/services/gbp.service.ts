import { isGbpConfigured } from "@/lib/env";
import { fetchGbpLocationDetails } from "@/lib/providers/google-business";

import type { BusinessDetails } from "@/lib/domain/place";

const MOCK_DETAILS: BusinessDetails = {
  rating: 4.4,
  reviewCount: 128,
  hoursSummary: "Mon–Sat, 9:00 AM – 9:00 PM (mock data)",
};

export const gbpService = {
  /**
   * Falls back to mock business details when GOOGLE_BUSINESS_API_KEY is
   * unset, or when the real call fails for any reason (GBP access requires
   * a verified business, which this project has no way to obtain).
   */
  async getBusinessDetails(placeId: string): Promise<BusinessDetails> {
    if (!isGbpConfigured()) {
      return MOCK_DETAILS;
    }

    try {
      return await fetchGbpLocationDetails(placeId);
    } catch {
      return MOCK_DETAILS;
    }
  },
};
