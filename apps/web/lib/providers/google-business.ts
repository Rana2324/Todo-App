import { z } from "zod";

const gbpLocationSchema = z.object({
  title: z.string().optional(),
  rating: z.number().optional(),
  userRatingCount: z.number().optional(),
  regularHours: z.unknown().optional(),
});

export type GbpLocationDetails = {
  rating: number | null;
  reviewCount: number | null;
  hoursSummary: string | null;
};

/**
 * Thin REST wrapper around the Google Business Profile "Business Information"
 * API (https://developers.google.com/my-business/reference/businessinformation/rest).
 * Real GBP access requires an OAuth2 access token tied to a *verified*
 * business — an API key alone is not sufficient, so this assumes
 * `GOOGLE_BUSINESS_API_KEY` holds a valid Bearer token. Not testable without
 * a real verified account; the calling service always falls back to mock
 * data for exactly this reason.
 */
export async function fetchGbpLocationDetails(
  placeId: string,
): Promise<GbpLocationDetails> {
  const response = await fetch(
    `https://mybusinessbusinessinformation.googleapis.com/v1/locations/${placeId}?readMask=title,rating,userRatingCount,regularHours`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GOOGLE_BUSINESS_API_KEY}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Google Business Profile request failed: ${response.status}`,
    );
  }

  const data = gbpLocationSchema.parse(await response.json());

  return {
    rating: data.rating ?? null,
    reviewCount: data.userRatingCount ?? null,
    hoursSummary: data.regularHours
      ? "See Google Business Profile for hours"
      : null,
  };
}
