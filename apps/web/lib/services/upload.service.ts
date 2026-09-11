import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

import { isS3Configured } from "@/lib/env";
import { getS3Client } from "@/lib/providers/s3";

const MAX_WIDTH = 800;

export const uploadService = {
  /**
   * Resizes/converts the image (always, via sharp), then stores it on S3
   * when configured, or locally under `public/uploads/` as a dev-only
   * fallback — the local path won't survive on a read-only serverless prod
   * deploy, but it keeps the feature usable without an AWS account.
   */
  async uploadTodoImage(
    input: Buffer,
    userId: string,
    todoId: string,
  ): Promise<string> {
    const optimized = await sharp(input)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    const key = `todos/${userId}/${todoId}.webp`;

    if (isS3Configured()) {
      const bucket = process.env.AWS_S3_BUCKET!;
      const region = process.env.AWS_REGION!;

      await getS3Client().send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: optimized,
          ContentType: "image/webp",
        }),
      );

      return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
    }

    const localDir = path.join(process.cwd(), "public", "uploads", userId);
    await mkdir(localDir, { recursive: true });
    await writeFile(path.join(localDir, `${todoId}.webp`), optimized);

    return `/uploads/${userId}/${todoId}.webp`;
  },

  /** Deletes the stored image for a todo, on S3 or the local fallback. */
  async deleteTodoImage(userId: string, todoId: string): Promise<void> {
    const key = `todos/${userId}/${todoId}.webp`;

    if (isS3Configured()) {
      const bucket = process.env.AWS_S3_BUCKET!;

      await getS3Client().send(
        new DeleteObjectCommand({ Bucket: bucket, Key: key }),
      );

      return;
    }

    const localPath = path.join(
      process.cwd(),
      "public",
      "uploads",
      userId,
      `${todoId}.webp`,
    );
    await rm(localPath, { force: true });
  },
};
