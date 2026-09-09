import { decrypt, encrypt } from "paseto-ts/v4";

import { getPasetoKey } from "@/lib/env";

const SHARE_LINK_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export type ShareTokenPayload = {
  todoId: string;
};

/** Issues a stateless, self-expiring v4.local PASETO token for a public todo share link. */
export function signShareToken(payload: ShareTokenPayload): string {
  const exp = new Date(Date.now() + SHARE_LINK_TTL_MS).toISOString();

  return encrypt(getPasetoKey(), { ...payload, exp });
}

/** Returns the payload if `token` is a valid, unexpired share token — otherwise null. */
export function verifyShareToken(token: string): ShareTokenPayload | null {
  try {
    const { payload } = decrypt<ShareTokenPayload>(getPasetoKey(), token);

    if (typeof payload.todoId !== "string") {
      return null;
    }

    return { todoId: payload.todoId };
  } catch {
    // Covers: wrong key, tampered token, malformed token, and — paseto-ts's
    // `decrypt()` validates the registered `exp` claim against the current
    // time by default — an expired token (see lib/paseto.test.ts).
    return null;
  }
}
