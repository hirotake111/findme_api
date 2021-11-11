import { Redis } from "ioredis";

import { Position } from "../types";
import { Config } from "../utils/config";
import { validatePosition } from "../utils/validators";

export interface PositionService {
  /**
   * get value by key and return value as a Position object
   */
  get: (key: string) => Promise<Position | null>;
  set: (key: string, payload: any) => Promise<Position>;
}

export const getPositionService = (
  client: Redis,
  config: Config
): PositionService => {
  return {
    /**
     * get value by key and return value as a Position object
     */
    async get(key: string): Promise<Position | null> {
      try {
        const data = await client.get(key);
        if (!data) return null;
        // validate payload
        const position = validatePosition(JSON.parse(data));
        return position;
      } catch (e) {
        throw e;
      }
    },
    /**
     * stores data to database. If failed, throw an error
     */
    async set(key: string, payload: any): Promise<Position> {
      // validate payload
      const data = validatePosition(payload);
      try {
        // const result = await client.set(key, JSON.stringify(data));
        const pipeline = client.pipeline();
        pipeline.set(key, JSON.stringify(data));
        pipeline.expire(key, config.redis.ttl);
        const [err, _] = await pipeline.exec();
        if (err instanceof Error) {
          throw err;
        }
        return data;
      } catch (e) {
        throw e;
      }
    },
  };
};
