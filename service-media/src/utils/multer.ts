import multer from "multer";
import { fileTypeFromBuffer } from "file-type";
import { imageSize } from "image-size";
import path from "path";
import type { Request, Response, NextFunction } from "express";
import filenamify from "filenamify";
import ffmpeg from "fluent-ffmpeg";
import { PassThrough } from "stream";
import { ApiError, ERROR_CODES } from "@lovelacers/common";

const allowedMimes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

const validExtRegex = /\.(jpg|jpeg|png|webp|mp4|webm|mov)$/i;

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    const isValid =
      allowedMimes.includes(file.mimetype) &&
      validExtRegex.test(file.originalname) &&
      file.fieldname === "files";
    cb(null, isValid);
  },
}).array("files", 11);

function isMaliciousName(name: string): boolean {
  return (
    /(\.\.|\/|\\|\0)/.test(name) ||
    name.split(".").length > 2 ||
    /\s+\.(exe|bat|cmd)$/i.test(name)
  );
}

function sanitizeFilename(filename: string): string {
  return filenamify(path.basename(filename.normalize("NFKC")), {
    replacement: "_",
  });
}

function getVideoDimensions(
  buffer: Buffer
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const stream = new PassThrough();
    stream.end(buffer);
    ffmpeg(stream).ffprobe((err, data) => {
      if (err) return reject(err);
      const streamInfo = data.streams.find((s) => s.width && s.height);
      if (!streamInfo) return reject(new Error("No video resolution found"));
      resolve({ width: streamInfo.width!, height: streamInfo.height! });
    });
  });
}

function validateImage(file: Express.Multer.File): string | null {
  if (file.size > 5 * 1024 * 1024)
    return `Image exceeds 5MB: ${file.originalname}`;

  try {
    const { width, height } = imageSize(file.buffer);
    if (!width || !height)
      return `Cannot determine dimensions: ${file.originalname}`;
    if (width < 500 || height < 500 || width > 5000 || height > 5000)
      return `Invalid image dimensions in ${file.originalname}: ${width}x${height}`;
  } catch {
    return `Corrupt image: ${file.originalname}`;
  }

  return null;
}

async function validateVideo(
  file: Express.Multer.File
): Promise<string | null> {
  if (file.size > 100 * 1024 * 1024)
    return `Video exceeds 100MB: ${file.originalname}`;

  try {
    const { width, height } = await getVideoDimensions(file.buffer);
    if (width < 240 || height < 240 || width > 7680 || height > 4320)
      return `Invalid video resolution in ${file.originalname}: ${width}x${height}`;
  } catch {
    return `Failed to analyze video: ${file.originalname}`;
  }

  return null;
}

export default async function validatedUpload(
  req: Request,
  res: Response,
  next: NextFunction
) {
  upload(req, res, async (err) => {
    if (err) {
      return next(
        new ApiError(400, err.message, {
          code: ERROR_CODES.VALIDATION_ERROR,
        })
      );
    }

    const files = req.files as Express.Multer.File[];

    if (!files?.length) {
      return next(
        new ApiError(400, "No valid files uploaded", {
          code: ERROR_CODES.VALIDATION_ERROR,
        })
      );
    }

    const imageCount = files.filter((f) =>
      f.mimetype.startsWith("image/")
    ).length;
    
    const videoCount = files.filter((f) =>
      f.mimetype.startsWith("video/")
    ).length;


    if (imageCount < 1) {
      return next(
        new ApiError(
          400,
          `At least one image is required.`,
          {
            code: ERROR_CODES.VALIDATION_ERROR,
          }
        )
      );
    }
    

    if (imageCount > 10) {
      return next(
        new ApiError(
          400,
          `Maximum of 10 images allowed. You uploaded ${imageCount}.`,
          {
            code: ERROR_CODES.VALIDATION_ERROR,
          }
        )
      );
    }

    if (videoCount > 1) {
      return next(
        new ApiError(400, `Only 1 video allowed. You uploaded ${videoCount}.`, {
          code: ERROR_CODES.VALIDATION_ERROR,
        })
      );
    }

    for (const file of files) {
      if (isMaliciousName(file.originalname)) {
        return next(
          new ApiError(
            400,
            `Invalid or spoofed filename: ${file.originalname}`,
            {
              code: ERROR_CODES.VALIDATION_ERROR,
            }
          )
        );
      }

      file.originalname = sanitizeFilename(file.originalname);

      const detected = await fileTypeFromBuffer(file.buffer);
      if (!detected) {
        return next(
          new ApiError(400, `Cannot detect file type: ${file.originalname}`, {
            code: ERROR_CODES.VALIDATION_ERROR,
          })
        );
      }

      const { mime, ext } = detected;
      if (file.mimetype !== mime) {
        return next(
          new ApiError(
            400,
            `MIME mismatch in ${file.originalname} (declared: ${file.mimetype}, actual: ${mime})`,
            {
              code: ERROR_CODES.VALIDATION_ERROR,
            }
          )
        );
      }

      if (!validExtRegex.test(`.${ext}`)) {
        return next(
          new ApiError(
            400,
            `Invalid extension detected in ${file.originalname}`,
            {
              code: ERROR_CODES.VALIDATION_ERROR,
            }
          )
        );
      }

      if (file.size < 1024) {
        return next(
          new ApiError(
            400,
            `File too small to be valid: ${file.originalname}`,
            {
              code: ERROR_CODES.VALIDATION_ERROR,
            }
          )
        );
      }

      const typeError = mime.startsWith("image/")
        ? validateImage(file)
        : mime.startsWith("video/")
        ? await validateVideo(file)
        : `Unsupported file type: ${mime}`;

      if (typeError) {
        return next(
          new ApiError(400, typeError, {
            code: ERROR_CODES.VALIDATION_ERROR,
          })
        );
      }
    }

    next();
  });
}
