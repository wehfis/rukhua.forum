import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env, isS3Configured } from "@/lib/env";

const allowedPrefixes = ["posts/", "documents/", "uploads/", "avatars/"] as const;

export type UploadPrefix = (typeof allowedPrefixes)[number];

let cachedClient: S3Client | null = null;

function getS3Client() {
  if (!isS3Configured()) {
    return null;
  }

  if (!cachedClient) {
    cachedClient = new S3Client({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY!
      }
    });
  }

  return cachedClient;
}

export function assertAllowedObjectKey(key: string) {
  const isAllowed = allowedPrefixes.some((prefix) => key.startsWith(prefix));

  if (!isAllowed || key.includes("..")) {
    throw new Error("Unsupported upload path.");
  }
}

export function getAssetUrl(key: string) {
  const base =
    env.NEXT_PUBLIC_ASSET_BASE_URL ||
    env.AWS_S3_PUBLIC_BASE_URL ||
    (env.AWS_S3_BUCKET && env.AWS_REGION
      ? `https://${env.AWS_S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com`
      : "");

  return base ? `${base.replace(/\/$/, "")}/${key.replace(/^\//, "")}` : key;
}

export async function createPresignedUploadUrl({
  key,
  contentType
}: {
  key: string;
  contentType: string;
}) {
  assertAllowedObjectKey(key);

  const client = getS3Client();

  if (!client || !env.AWS_S3_BUCKET) {
    throw new Error("S3 is not configured.");
  }

  const command = new PutObjectCommand({
    Bucket: env.AWS_S3_BUCKET,
    Key: key,
    ContentType: contentType
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 60 * 5 });

  return {
    uploadUrl,
    publicUrl: getAssetUrl(key),
    key
  };
}
