import { productIdSchema } from "@lovelacers/common";
import { z } from "zod";

export const verifyParams = z.object({
  id: productIdSchema
});