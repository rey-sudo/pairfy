import { z } from "zod";
import { emailSchema, passwordSchema, usernameSchema } from "@lovelacers/common";

export const createSellerSchema = z.strictObject({
  email: emailSchema,

  username: usernameSchema,

  password: passwordSchema,

  terms_accepted: z.literal(true).refine((val) => val === true, {
    message: "Terms must be accepted",
  }),

  country: z
    .string()
    .length(2, "Country must be a valid ISO 3166-1 alpha-2 code")
    .toUpperCase()
    .refine((val) => val === "US", {
      message: "Country must be 'US'",
    }),
});
