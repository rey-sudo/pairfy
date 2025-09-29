import { productIdSchema } from "@lovelacers/common";
import { z } from "zod";

export const pendingEndpointSchema = z.strictObject({
  product_id: productIdSchema,
  order_units: z
    .number()
    .int({ message: "Must be an integer" })
    .positive({ message: "Must be a positive number" })
    .min(1, { message: "Minimum allowed is 1" })
    .max(100, { message: "Maximum allowed is 100" }),
  asset: z
    .enum(["ADA"])
    .refine((val) => !!val, {
      message: "Asset must be one of ADA",
    })
});
