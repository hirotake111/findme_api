import { Redis } from "ioredis";

import { Position } from "../types";
import { validatePosition } from "../utils/validators";

export interface PositionService {
  get: (key: string) => Promise<Position | null>;
  set: (key: string, payload: any) => Promise<Position>;
}

export const getPositionService = (client: Redis): PositionService => {
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
        const result = await client.set(key, JSON.stringify(data));
        if (result !== "OK") {
          throw new Error("database error");
        }
        return data;
      } catch (e) {
        throw e;
      }
    },
  };
};
