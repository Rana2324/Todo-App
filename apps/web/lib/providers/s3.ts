import { S3Client } from "@aws-sdk/client-s3";

let client: S3Client | null = null;

/** Lazily-created, cached S3 client — reads `AWS_REGION` from `process.env`. */
export function getS3Client(): S3Client {
  if (!client) {
    client = new S3Client({ region: process.env.AWS_REGION });
  }

  return client;
}
