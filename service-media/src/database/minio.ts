import { MinioWrap } from "@lovelacers/common";

export const minioClient = new MinioWrap()

export async function ensureBucketExists(client: typeof minioClient.client, bucketName: string): Promise<void> {
  const exists = await client.bucketExists(bucketName);
  if (!exists) {
    await client.makeBucket(bucketName, "");
    console.log(`🪣 Created bucket: ${bucketName}`);
  }
}