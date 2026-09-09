import { z } from "zod";

const igMediaSchema = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      caption: z.string().optional(),
      media_url: z.string().optional(),
      permalink: z.string().optional(),
    }),
  ),
});

export type InstagramPost = {
  id: string;
  caption: string | null;
  mediaUrl: string | null;
  permalink: string | null;
};

/**
 * Thin REST wrapper around the Meta Graph API's IG Media edge
 * (https://developers.facebook.com/docs/instagram-platform/instagram-graph-api).
 * `igUserId` is the Instagram Business Account id linked to the place — the
 * caller resolves that separately; this just fetches its recent media.
 */
export async function fetchInstagramRecentMedia(
  igUserId: string,
): Promise<InstagramPost[]> {
  const url = new URL(`https://graph.facebook.com/v19.0/${igUserId}/media`);
  url.searchParams.set("fields", "id,caption,media_url,permalink");
  url.searchParams.set("limit", "3");
  url.searchParams.set(
    "access_token",
    process.env.META_GRAPH_ACCESS_TOKEN ?? "",
  );

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Meta Graph API request failed: ${response.status}`);
  }

  const data = igMediaSchema.parse(await response.json());

  return data.data.map((item) => ({
    id: item.id,
    caption: item.caption ?? null,
    mediaUrl: item.media_url ?? null,
    permalink: item.permalink ?? null,
  }));
}
