import { ApiGraphQLError, ERROR_CODES } from "@lovelacers/common";
import { redisBooks } from "../../database/redis.js";
import { getBookSchema } from "../../validators/getBook.js";

export const getBook = async (_: any, args: any, context: any) => {
  
  try {
    const validateParams = getBookSchema.safeParse(args.getBookInput);

    if (!validateParams.success) {
      throw new ApiGraphQLError(
        400,
        `Invalid params ${JSON.stringify(validateParams.error.flatten())}`,
        {
          code: ERROR_CODES.VALIDATION_ERROR,
        }
      );
    }

    const params = validateParams.data;

    console.log(params); //TEST

    const result = await redisBooks.client.get(params.id);

    if (!result) {
      throw new Error("NO_BOOK");
    }

    return {
      success: true,
      message: 'OK',
      data: JSON.parse(result),
    };
  } catch (err: any) {
    throw err
  }
};
