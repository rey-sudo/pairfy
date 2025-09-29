import database from "../database/client.js";
import { uploadToSpaces } from "../utils/upload.js";
import { resizeImage } from "../utils/image.js";
import { minioClient } from "../database/minio.js";
import { createEvent, logger } from "@lovelacers/common";
import { Readable } from "stream";
import { Job } from "bullmq";


export const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
  const chunks: Buffer[] = [];

  for await (const chunk of stream) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
};

export async function handleImageJob(job: Job) {
  let connection = null;

  try {
    const { bucket, file } = job.data;

    const { id, media_group_id, filename, media_path, agent_id } = file;

    console.log(bucket, media_path)

    connection = await database.client.getConnection();

    await connection.beginTransaction();

    /////////////////////////////////////////////////////////////////////// START TRANSACTION
    
    const timestamp = Date.now();

    const stream = await minioClient.client.getObject(bucket, media_path);
    const buffer = await streamToBuffer(stream);
    const resized = await resizeImage(buffer);

    const urls: Record<string, string> = {};

    for (const [size, buf] of Object.entries(resized)) {
      const originalName = filename.split(".")[0];

      const destKey = `groups/${media_group_id}/${id}-${originalName}-${size}.webp`;

      const url = await uploadToSpaces({
        bucket,
        key: destKey,
        body: buf,
        contentType: "image/webp",
      });

      urls[size] = url;
    }

    console.log(urls);

    const payload = {
      file,
      urls,
    };

    await createEvent(
      connection,
      timestamp,
      "service-processor",
      "ProcessedFile",
      JSON.stringify(payload),
      agent_id
    );

    /////////////////////////////////////////////////////////////////////// END TRANSACTION

    await connection.commit();

    logger.info({
      service: "service-processor",
      event: "job.completed",
      message: "job completed",
    });

    return { status: "done", uploaded: urls };
  } catch (error: any) {
    logger.error({
      service: "service-processor",
      event: "job.failed",
      error: error.message,
      stack: error.stack,
    });

    if (connection) await connection.rollback();

    throw error;
  } finally {
    if (connection) connection.release();
  }
}
