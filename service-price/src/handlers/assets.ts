import { redisClient } from "../database/redis.js";
import { axiosAPI } from "../api/index.js";
import { logger } from "@lovelacers/common";
import { Job } from "bullmq";

type BinanceResponse = { mins: number; price: string; closeTime: number };

export async function getAssetPriceHandler(job: Job) {
  try {
    const { symbol, base } = job.data;

    const response: any = await axiosAPI.get(`/api/v3/avgPrice?symbol=${symbol}`);

    if (response.status === 200) {
      const payload: BinanceResponse = response.data;

      const assetPrice = Number(Number(payload.price).toFixed(2));

      await redisClient.client.set(`price:${base}`, assetPrice, {
        EX: 120,
      });

      console.log(`✅${symbol}:${assetPrice}`);
    }
  } catch (err) {
    logger.error(err);
    throw err;
  }
}
