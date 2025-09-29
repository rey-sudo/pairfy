import { logger } from "@lovelacers/common";

export const catchError = (error: any) => {
  logger.error(`EXIT=>${error}`);

  return process.exit(1);
};



