import { headers } from "next/headers";

import { auth } from "./auth";

/** Reads the current session in a Server Action / Server Component, throws if signed out. */
export async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Not authenticated");
  }

  return session;
}

/** Shorthand for the common case of just needing the current user's id. */
export async function requireUserId() {
  const session = await requireSession();
  return session.user.id;
}

/** Reads the current session, returns null instead of throwing when signed out. */
export async function getOptionalSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** For Server Component admin guards — true only for a signed-in admin. */
export async function isAdmin(): Promise<boolean> {
  const session = await getOptionalSession();
  return session?.user.role === "admin";
}
