import { describe, expect, it } from "vitest";

import { loginSchema, registerSchema } from "@/schema/auth";

describe("loginSchema", () => {
  it("rejects an invalid email", () => {
    expect(
      loginSchema.safeParse({ email: "not-an-email", password: "secret" })
        .success,
    ).toBe(false);
  });

  it("rejects an empty password", () => {
    expect(
      loginSchema.safeParse({ email: "a@b.com", password: "" }).success,
    ).toBe(false);
  });

  it("accepts a valid email/password pair", () => {
    expect(
      loginSchema.safeParse({ email: "a@b.com", password: "secret" })
        .success,
    ).toBe(true);
  });
});

describe("registerSchema", () => {
  const valid = {
    name: "Jane Doe",
    email: "jane@example.com",
    password: "password123",
    confirmPassword: "password123",
  };

  it("accepts valid input", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a password under 6 characters", () => {
    const result = registerSchema.safeParse({
      ...valid,
      password: "123",
      confirmPassword: "123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects mismatched passwords, attributing the error to confirmPassword", () => {
    const result = registerSchema.safeParse({
      ...valid,
      confirmPassword: "different",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      expect(fieldErrors.confirmPassword?.[0]).toBe("Passwords do not match");
    }
  });

  it("rejects an empty name", () => {
    expect(registerSchema.safeParse({ ...valid, name: "  " }).success).toBe(
      false,
    );
  });
});
