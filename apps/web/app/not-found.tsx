"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center bg-background px-6">
      <div className="mx-auto w-full max-w-lg">
        <p className="font-sans text-[7rem] font-semibold leading-none tracking-tight text-foreground sm:text-[9rem]">
          404
        </p>

        <div className="mt-6 border-t border-border pt-6">
          <h1 className="text-xl font-semibold text-foreground">
            Page not found
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>

          <div className="mt-8 flex items-center gap-3">
            <Button asChild>
              <Link href="/">Go home</Link>
            </Button>

            <Button variant="outline" onClick={() => router.back()}>
              Go back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
