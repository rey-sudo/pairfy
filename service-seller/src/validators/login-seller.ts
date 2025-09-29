import { z } from "zod";
import { emailSchema, passwordSchema, hexRegex } from "@lovelacers/common";

export const loginSellerSchema = z.strictObject({
  email:emailSchema,

  password: passwordSchema,

  signature: z.object({
    key: z
      .string()
      .min(64, "Key must be at least 64 hex characters")
      .max(512, "Key too long")
      .regex(hexRegex, "Key must be a valid hex string"),

    signature: z
      .string()
      .min(64, "Signature must be at least 64 hex characters")
      .max(2048, "Signature too long")
      .regex(hexRegex, "Signature must be a valid hex string"),
  }),
  address: z
    .string()
    .min(64, "Address must be at least 64 hex characters")
    .max(256, "Address too long")
    .regex(hexRegex, "Address must be a valid hex string"),

  wallet_name: z
    .string()
    .min(2, "Wallet name is too short")
    .max(50, "Wallet name is too long")
    .regex(/^[a-zA-Z0-9_\-]+$/, {
      message:
        "Wallet name must contain only letters, numbers, hyphens, or underscores",
    })
})
