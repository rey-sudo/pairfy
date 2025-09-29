import {logger} from "@lovelacers/common";

const catchError = (error?: any) => {
  logger.error(`EXIT=>${error}`);

  return process.exit(1);
};

export { catchError };
