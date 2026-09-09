export type Place = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

export type BusinessDetails = {
  rating: number | null;
  reviewCount: number | null;
  hoursSummary: string | null;
};

export type SocialPost = {
  id: string;
  caption: string | null;
  mediaUrl: string | null;
  permalink: string | null;
};
