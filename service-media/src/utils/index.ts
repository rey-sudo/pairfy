import { logger } from "@lovelacers/common";

export const catchError = (error?: any) => {
  logger.error(`EXIT=>${error}`);

  return process.exit(1);
};


export function generateMediaUrl(
  mediaGroupId: string,
  fileId: string,
  filename: string,
  size: "thumbnail" | "small" | "medium" | "large",
   extension: "webp" | "mp4"
): string {
  const originalName = filename.split(".")[0];

  return `groups/${mediaGroupId}/${fileId}-${originalName}-${size}.${extension}`;
}