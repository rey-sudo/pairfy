import { ApiGraphQLError, ERROR_CODES } from "@lovelacers/common";
import { validateParams } from "../../validators/searchProduct.js";
import { findProductsByPrompt } from "../../database/weaviate.js";

export const searchProducts = async (_: any, args: any, context: any) => {
  try {
    const parsed = validateParams.safeParse(args.searchProductsInput);

    if (!parsed.success) {
      const { fieldErrors, formErrors } = parsed.error.flatten();

      throw new ApiGraphQLError(400, "Validation failed", {
        code: ERROR_CODES.VALIDATION_ERROR,
        details: { fieldErrors, formErrors },
      });
    }

    const params = parsed.data;

    const result = await findProductsByPrompt(params.prompt, params.vectorized, params.filters);

    console.log(result.length)

    return result;
  } catch (error: any) {
    throw error;
  }
};
