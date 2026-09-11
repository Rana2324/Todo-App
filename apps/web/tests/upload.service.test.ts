import { access, readFile, rm } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";
import { afterEach, describe, expect, it } from "vitest";

import { uploadService } from "@/lib/services/upload.service";

const TEST_USER_ID = "vitest-upload-user";

describe("uploadService (mock mode — no AWS creds in test env)", () => {
  afterEach(async () => {
    await rm(path.join(process.cwd(), "public", "uploads", TEST_USER_ID), {
      recursive: true,
      force: true,
    });
  });

  it("resizes/converts via sharp and falls back to a local /uploads path", async () => {
    const input = await sharp({
      create: {
        width: 200,
        height: 200,
        channels: 3,
        background: { r: 255, g: 0, b: 0 },
      },
    })
      .png()
      .toBuffer();

    const url = await uploadService.uploadTodoImage(
      input,
      TEST_USER_ID,
      "test-todo",
    );

    expect(url).toBe(`/uploads/${TEST_USER_ID}/test-todo.webp`);

    const savedPath = path.join(
      process.cwd(),
      "public",
      url.replace(/^\//, ""),
    );
    // Read into a buffer rather than pointing sharp at the path directly —
    // on Windows, libvips can keep a file handle open briefly after reading
    // from disk, which races with this test's own cleanup (EBUSY on unlink).
    const savedBuffer = await readFile(savedPath);
    const metadata = await sharp(savedBuffer).metadata();

    expect(metadata.format).toBe("webp");
    expect(metadata.width).toBeLessThanOrEqual(800);
  });

  it("deleteTodoImage removes the local fallback file", async () => {
    const input = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 3,
        background: { r: 0, g: 0, b: 255 },
      },
    })
      .png()
      .toBuffer();

    await uploadService.uploadTodoImage(input, TEST_USER_ID, "test-todo");

    const savedPath = path.join(
      process.cwd(),
      "public",
      "uploads",
      TEST_USER_ID,
      "test-todo.webp",
    );
    await expect(access(savedPath)).resolves.toBeUndefined();

    await uploadService.deleteTodoImage(TEST_USER_ID, "test-todo");

    await expect(access(savedPath)).rejects.toThrow();
  });

  it("deleteTodoImage is a no-op when no file was ever uploaded", async () => {
    await expect(
      uploadService.deleteTodoImage(TEST_USER_ID, "never-uploaded"),
    ).resolves.toBeUndefined();
  });
});
