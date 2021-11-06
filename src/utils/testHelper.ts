import { Position } from "../types";
import { Config } from "./config";

export const getMockConfig = (): Config => {
  return {
    port: 3333,
    secretkey: "secret",
    NODE_ENV: "development",
    redis: { url: "redis://localhost:6379", ttl: 5 * 60 },
    cors: "localhost",
  };
};

/**
 * helper function to generate position data
 */
export const getMockPosition = (): Position => ({
  latitude: 55.55,
  longitude: 66.66,
});
