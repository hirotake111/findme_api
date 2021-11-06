import IORedis, { Redis } from "ioredis";
import { Config } from "./config";

/**
 * returns Redis client after connecting  to Redis server
 */
export const getRedisClient = async (config: Config): Promise<Redis> => {
  try {
    const client = new IORedis(config.redis.url, { lazyConnect: true });
    await client.connect();
    return client;
  } catch (e) {
    throw e;
  }
};
