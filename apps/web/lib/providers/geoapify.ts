import { z } from "zod";

const geoapifyResponseSchema = z.object({
  results: z.array(
    z.object({
      place_id: z.string(),
      formatted: z.string(),
      lat: z.number(),
      lon: z.number(),
    }),
  ),
});

export type GeoapifyPlace = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

/** Thin REST wrapper — Geoapify is a plain JSON API, no official SDK needed. */
export async function searchGeoapifyPlaces(
  query: string,
): Promise<GeoapifyPlace[]> {
  const url = new URL("https://api.geoapify.com/v1/geocode/search");
  url.searchParams.set("text", query);
  url.searchParams.set("apiKey", process.env.GEOAPIFY_API_KEY ?? "");
  url.searchParams.set("limit", "5");
  url.searchParams.set("format", "json");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Geoapify request failed: ${response.status}`);
  }

  const data = geoapifyResponseSchema.parse(await response.json());

  return data.results.map((result) => ({
    id: result.place_id,
    name: result.formatted,
    lat: result.lat,
    lng: result.lon,
  }));
}
