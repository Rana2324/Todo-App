import { describe, expect, it } from "vitest";
import { changePasswordSchema } from "@/schema/auth";

describe("changePasswordSchema", () => {
  it("accepts a valid password change request", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "oldpassword123",
      newPassword: "newpassword456",
      confirmPassword: "newpassword456",
      revokeOtherSessions: true,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.newPassword).toBe("newpassword456");
      expect(result.data.revokeOtherSessions).toBe(true);
    }
  });

  it("rejects when new passwords do not match", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "oldpassword123",
      newPassword: "newpassword456",
      confirmPassword: "mismatchedpassword",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("New passwords do not match");
    }
  });

  it("rejects when new password is too short (< 6 chars)", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "oldpassword123",
      newPassword: "123",
      confirmPassword: "123",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain("at least 6 characters");
    }
  });

  it("rejects when current password is empty", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "",
      newPassword: "newpassword456",
      confirmPassword: "newpassword456",
    });

    expect(result.success).toBe(false);
  });
});
