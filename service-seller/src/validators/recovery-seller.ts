import { z } from "zod";
import { emailSchema } from "@lovelacers/common";

export const recoverySellerSchema = z.object({
  email: emailSchema
});