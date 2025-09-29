import fs from 'fs/promises';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { createReadStream, existsSync, unlinkSync } from 'fs';
import { logger } from '@lovelacers/common';
import { minioClient } from '../database/minio.js';
import { uploadToSpaces } from '../utils/upload.js';
import { Readable } from 'stream';
import { Job } from 'bullmq';

const resolutions = {
  '480p': { width: 854, height: 480 },
  '720p': { width: 1280, height: 720 },
  '1080p': { width: 1920, height: 1080 },
};

const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
};

const transcodeVideo = (input: string, output: string, width: number, height: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .outputOptions([
        `-vf scale=${width}:${height}`,
        '-c:v libx264',
        '-crf 28',
        '-preset veryfast',
        '-c:a copy',
      ])
      .on('end', () => resolve())
      .on('error', reject)
      .save(output);
  });
};

export async function handleVideoJob(job: Job) {
  try {
    const { bucket, key, userId } = job.data;
    const baseName = key.split('/').pop()?.split('.')[0] || 'video';
    const tempDir = './tmp';
    const localInputPath = path.join(tempDir, `${job.id}-input.mp4`);

    await fs.mkdir(tempDir, { recursive: true });

    const inputStream = await minioClient.client.getObject(bucket, key);
    const videoBuffer = await streamToBuffer(inputStream);
    await fs.writeFile(localInputPath, videoBuffer);

    const urls: Record<string, string> = {};

    for (const [label, { width, height }] of Object.entries(resolutions)) {
      const outPath = path.join(tempDir, `${job.id}-${label}.mp4`);

      await transcodeVideo(localInputPath, outPath, width, height);

      const stream = createReadStream(outPath);
      const destKey = `products/videos/${userId}/${baseName}-${label}.mp4`;

      urls[label] = await uploadToSpaces({
        bucket,
        key: destKey,
        body: stream,
        contentType: 'video/mp4',
      });

      if (existsSync(outPath)) unlinkSync(outPath);
    }

    if (existsSync(localInputPath)) unlinkSync(localInputPath);

    // createEvent(urls)

    return { status: 'done', uploaded: urls };
  } catch (err) {
    logger.error(`Error processing video job ${job.id}:`, err);
    throw err;
  }
}
