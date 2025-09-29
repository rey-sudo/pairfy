import { connection } from "./redis.js";
import { logger } from "@lovelacers/common";
import { Queue } from "bullmq";

export const mediaQueue = new Queue("media-processing", {
  connection,
});

interface MediaEvent {
  id: string;
  media_group_id: string;
  agent_id: string;
  mime_type: string;
  position: number;
  filename: string;
  media_path: string;
  status: string;
  created_at: number;
  product_id: string;
}

export async function processFile(event: MediaEvent): Promise<boolean> {
  try {
    const isVideo = event.mime_type.startsWith("video/");

    const type = isVideo ? "video" : "image";
    
    console.log(process.env.HANDLER_MINIO_BUCKET); //TEST

    const job = await mediaQueue.add(
      type,
      {
        bucket: process.env.HANDLER_MINIO_BUCKET,
        file: event,
      },
      {
        jobId: event.id,
        attempts: 5,
        backoff: {
          type: "exponential",
          delay: 3000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );

    logger.info({
      service: "service-processor-consumer",
      event: "job.queued",
      message: "Job processed successfully",
      jobId: job.id,
      mediaPath: event.media_path,
      agentId: event.agent_id,
    });

    return true;
  } catch (error: any) {
    logger.error({
      service: "service-processor-consumer",
      event: "job.failed",
      message: "Job failed during processing",
      error: error.message,
      stack: error.stack,
    });

    return false;
  }
}
