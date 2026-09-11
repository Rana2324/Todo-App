"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, Loader2, Share2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ShareTodoProps = {
  onCreateLink: () => Promise<string>;
};

const SHARE_PATH_MARKER = "/share/";
const VISIBLE_PAYLOAD_CHARS = 12;

/**
 * Shortens a share URL for display only — e.g.
 * `https://example.com/share/v4.local.F7CAIpMOmSU0...` — never the value
 * that gets copied or opened, which always uses the full, untouched URL
 * (`url` state / the `url` param here are never mutated by this function).
 */
function truncateShareUrl(url: string): string {
  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    return url;
  }

  const markerIndex = parsed.pathname.indexOf(SHARE_PATH_MARKER);
  if (markerIndex === -1) return url;

  const token = parsed.pathname.slice(markerIndex + SHARE_PATH_MARKER.length);

  // PASETO tokens look like `<version>.<purpose>.<payload>`, e.g.
  // `v4.local.<base64url payload>` — keep the version/purpose prefix intact
  // and only truncate the (much longer) payload segment.
  const firstDot = token.indexOf(".");
  const secondDot = firstDot === -1 ? -1 : token.indexOf(".", firstDot + 1);

  if (secondDot === -1) {
    const shortToken =
      token.length > VISIBLE_PAYLOAD_CHARS
        ? `${token.slice(0, VISIBLE_PAYLOAD_CHARS)}...`
        : token;
    return `${parsed.origin}${SHARE_PATH_MARKER}${shortToken}`;
  }

  const prefix = token.slice(0, secondDot + 1);
  const payload = token.slice(secondDot + 1);
  const shortPayload =
    payload.length > VISIBLE_PAYLOAD_CHARS
      ? `${payload.slice(0, VISIBLE_PAYLOAD_CHARS)}...`
      : payload;

  return `${parsed.origin}${SHARE_PATH_MARKER}${prefix}${shortPayload}`;
}

export default function ShareTodo({ onCreateLink }: ShareTodoProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleOpenChange = async (nextOpen: boolean) => {
    setOpen(nextOpen);
    setCopied(false);

    if (!nextOpen) return;

    setUrl(null);
    setIsLoading(true);

    try {
      setUrl(await onCreateLink());
    } catch {
      toast.error("Could not create share link. Please try again.");
      setOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!url) return;

    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied to clipboard!");
  };

  const handleOpenLink = () => {
    if (!url) return;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Share2 />
          <span className="sr-only">Share</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Todo</DialogTitle>

          <DialogDescription>
            Anyone with this link can view this todo, without signing in.
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-10 w-full min-w-0 items-center rounded-md border bg-muted/50 px-3 py-2">
          {isLoading ? (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          ) : (
            <span
              className="block w-full max-w-full min-w-0 overflow-hidden font-mono text-sm text-ellipsis whitespace-nowrap text-muted-foreground"
              title={url ?? undefined}
            >
              {url ? truncateShareUrl(url) : ""}
            </span>
          )}
        </div>

        <DialogFooter className="gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleOpenLink}
            disabled={!url}
          >
            <ExternalLink />
            Open
          </Button>

          <Button type="button" onClick={handleCopy} disabled={!url}>
            {copied ? <Check /> : <Copy />}
            Copy Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
