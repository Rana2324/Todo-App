"use server";

import { requireUserId } from "@/lib/auth/session";
import { gbpService } from "@/lib/services/gbp.service";
import { instagramService } from "@/lib/services/instagram.service";
import { placeService } from "@/lib/services/place.service";

import { placeIdSchema, placeSearchQuerySchema } from "@/schema/place";

export async function searchPlaces(query: string) {
  await requireUserId();
  const validQuery = placeSearchQuerySchema.parse(query);

  return placeService.searchPlaces(validQuery);
}

export async function getPlaceEnrichment(placeId: string) {
  await requireUserId();
  const validPlaceId = placeIdSchema.parse(placeId);

  const [business, posts] = await Promise.all([
    gbpService.getBusinessDetails(validPlaceId),
    instagramService.getRecentPosts(validPlaceId),
  ]);

  return { business, posts };
}
