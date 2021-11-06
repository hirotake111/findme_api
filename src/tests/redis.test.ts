import { config } from "../utils/config";
import { getRedisClient } from "../utils/redis";

describe("getRedisClient", () => {
  it("should return redis client", async () => {
    expect.assertions(1);
    try {
      const client = await getRedisClient(config);
      expect(client.status).toBe("ready");
    } catch (e) {
      throw e;
    }
  });

  it("should throw an error if URL is invalid", async () => {
    expect.assertions(1);
    try {
      const client = await getRedisClient({
        ...config,
        redis: { url: "xxxx", ttl: 30 },
      });
    } catch (e) {
      if (e instanceof Error)
        expect(e.message).toEqual("Connection is closed.");
    }
  });
});
