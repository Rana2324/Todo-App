import { isInstagramConfigured } from "@/lib/env";
import { fetchInstagramRecentMedia } from "@/lib/providers/instagram";

import type { SocialPost } from "@/lib/domain/place";

const MOCK_POSTS: SocialPost[] = [
  {
    id: "mock-post-1",
    caption: "A great spot for coffee and focused work ☕ (mock data)",
    mediaUrl: null,
    permalink: null,
  },
  {
    id: "mock-post-2",
    caption: "New seasonal menu is up! (mock data)",
    mediaUrl: null,
    permalink: null,
  },
];

export const instagramService = {
  /**
   * Falls back to mock posts when META_GRAPH_ACCESS_TOKEN is unset, or when
   * the real call fails for any reason.
   */
  async getRecentPosts(placeId: string): Promise<SocialPost[]> {
    if (!isInstagramConfigured()) {
      return MOCK_POSTS;
    }

    try {
      return await fetchInstagramRecentMedia(placeId);
    } catch {
      return MOCK_POSTS;
    }
  },
};
