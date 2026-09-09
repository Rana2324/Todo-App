import { beforeAll, describe, expect, it } from "vitest";
import { encrypt, generateKeys } from "paseto-ts/v4";

import { signShareToken, verifyShareToken } from "@/lib/paseto";

beforeAll(() => {
  // A fresh key generated for this test run — doesn't need to match the
  // real .env.local value, `getPasetoKey()` reads it lazily per call.
  process.env.PASETO_LOCAL_KEY = generateKeys("local");
});

describe("paseto share tokens", () => {
  it("round-trips a freshly signed token", () => {
    const token = signShareToken({ todoId: "todo-1" });
    const payload = verifyShareToken(token);

    expect(payload).toEqual({ todoId: "todo-1" });
  });

  it("rejects an expired token", () => {
    const key = process.env.PASETO_LOCAL_KEY!;
    const twoDaysAgo = new Date(
      Date.now() - 2 * 24 * 60 * 60 * 1000,
    ).toISOString();
    const oneDayAgo = new Date(
      Date.now() - 1 * 24 * 60 * 60 * 1000,
    ).toISOString();

    // `addIat`/`addExp` default to true and would silently overwrite these
    // with fresh, valid values — `false` here lets us build a token that's
    // genuinely expired (both `iat` and `exp` are in the past, `exp > iat`
    // still holds) to prove `verifyShareToken` rejects it.
    const expiredToken = encrypt(
      key,
      { todoId: "todo-1", iat: twoDaysAgo, exp: oneDayAgo },
      { validatePayload: false, addIat: false, addExp: false },
    );

    expect(verifyShareToken(expiredToken)).toBeNull();
  });

  it("rejects a tampered or garbage token", () => {
    expect(verifyShareToken("not-a-real-token")).toBeNull();
  });
});
