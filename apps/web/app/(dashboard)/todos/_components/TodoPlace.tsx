"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

import { Input } from "@/components/ui/input";

import { getPlaceEnrichment, searchPlaces } from "../_lib/place.actions";

import type {
  BusinessDetails,
  Place,
  SocialPost,
} from "@/lib/domain/place";

type TodoPlaceProps = {
  place?: Place;
  onAttach: (place: Place) => void;
};

export default function TodoPlace({ place, onAttach }: TodoPlaceProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [showEnrichment, setShowEnrichment] = useState(false);
  const [isLoadingEnrichment, setIsLoadingEnrichment] = useState(false);
  const [enrichment, setEnrichment] = useState<{
    business: BusinessDetails;
    posts: SocialPost[];
  } | null>(null);

  const handleSearch = async (value: string) => {
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);

    try {
      setResults(await searchPlaces(value));
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = (selected: Place) => {
    onAttach(selected);
    setShowSearch(false);
    setQuery("");
    setResults([]);
  };

  const toggleEnrichment = async () => {
    const next = !showEnrichment;
    setShowEnrichment(next);

    if (next && !enrichment && place) {
      setIsLoadingEnrichment(true);

      try {
        setEnrichment(await getPlaceEnrichment(place.id));
      } finally {
        setIsLoadingEnrichment(false);
      }
    }
  };

  if (place) {
    return (
      <div className="mt-1">
        <button
          type="button"
          onClick={toggleEnrichment}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <MapPin className="h-3 w-3" />
          {place.name}
        </button>

        {showEnrichment && (
          <div className="mt-2 space-y-2 rounded-md border bg-muted/30 p-3 text-xs">
            {isLoadingEnrichment ? (
              <p className="text-muted-foreground">
                Loading place details...
              </p>
            ) : (
              enrichment && (
                <>
                  <p>
                    ⭐ {enrichment.business.rating ?? "N/A"}
                    {enrichment.business.reviewCount
                      ? ` (${enrichment.business.reviewCount} reviews)`
                      : ""}
                  </p>
                  {enrichment.business.hoursSummary && (
                    <p>{enrichment.business.hoursSummary}</p>
                  )}
                  {enrichment.posts.length > 0 && (
                    <div>
                      <p className="font-medium">Recent posts</p>
                      <ul className="list-disc pl-4">
                        {enrichment.posts.map((post) => (
                          <li key={post.id}>
                            {post.caption ?? "(no caption)"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-1">
      {showSearch ? (
        <div className="space-y-1">
          <Input
            autoFocus
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search a place..."
            className="h-7 text-xs"
          />

          {isSearching && (
            <p className="text-xs text-muted-foreground">Searching...</p>
          )}

          {results.length > 0 && (
            <ul className="rounded-md border bg-background text-xs">
              {results.map((result) => (
                <li key={result.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(result)}
                    className="w-full px-2 py-1 text-left hover:bg-muted"
                  >
                    {result.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowSearch(true)}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <MapPin className="h-3 w-3" />
          Add place
        </button>
      )}
    </div>
  );
}
