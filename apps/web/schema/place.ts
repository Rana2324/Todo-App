import { z } from "zod";

export const placeSearchQuerySchema = z
  .string()
  .trim()
  .min(1, "Search term is required")
  .max(200, "Search term is too long");

export const placeIdSchema = z
  .string()
  .trim()
  .min(1, "Place id is required");

export const attachPlaceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(300),
  lat: z.number(),
  lng: z.number(),
});

export type AttachPlaceInput = z.infer<typeof attachPlaceSchema>;
