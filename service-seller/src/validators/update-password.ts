import { z } from "zod";
import { passwordSchema } from "@lovelacers/common";

export const verifyParams = z.object({
  token: z
    .string()
    .min(100, { message: "JWT is too short" })
    .max(2000, { message: "JWT is too long" })
    .regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/, {
      message: "Invalid JWT format",
    }),

  password: passwordSchema
});

export const verifyTokenType = z.object({
  source: z.literal("service-seller"),
  role: z.literal("SELLER"),
  email: z.string().email(),
  username: z.string(),
});
