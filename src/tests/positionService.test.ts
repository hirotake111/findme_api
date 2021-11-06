import IORedis, { Redis } from "ioredis";
import {
  getPositionService,
  PositionService,
} from "../services/positionService";
import { Position } from "../types";
import { getMockPosition } from "../utils/testHelper";

let client: Redis;
let service: PositionService;

// fake Redis client that always throw an error
const fakeClient = {
  set: async (key: string, payload: any) => {
    throw new Error("database error!");
  },
  get: async (key: string) => {
    throw new Error("database error");
  },
};

beforeEach(async () => {
  client = new IORedis("redis://findme-api-redis", {
    lazyConnect: true,
  });
  await client.connect();
  service = getPositionService(client);
  // flush all data in Redis server
  await client.flushall();
});

describe("positionService.set()", () => {
  it("should set data without code", async () => {
    expect.assertions(1);
    const data = getMockPosition();
    service.set("key1", data);
    expect(await client.get("key1")).toEqual(JSON.stringify(data));
  });

  it("should set data including code", async () => {
    expect.assertions(1);
    const data: Position = { ...getMockPosition(), code: "xxxx" };
    service.set("key1", data);
    expect(await client.get("key1")).toEqual(JSON.stringify(data));
  });

  it("should throw an error if database throws it", async () => {
    expect.assertions(1);
    const service = getPositionService(fakeClient as any);
    try {
      await service.set("key1", getMockPosition());
    } catch (e) {
      if (e instanceof Error) expect(e.message).toBe("database error!");
    }
  });

  it("should throw an error if database returns anything but not 'OK'", async () => {
    expect.assertions(1);
    const clientNotOk = { set: (key: string, value: any) => null };
    const service = getPositionService(clientNotOk as any);
    try {
      await service.set("key1", getMockPosition());
    } catch (e) {
      if (e instanceof Error) expect(e.message).toBe("database error");
    }
  });
});

describe("positionService.get()", () => {
  it("should return position data", async () => {
    expect.assertions(1);
    const key = "asdf";
    const data: Position = { ...getMockPosition() };
    // set data
    await client.set(key, JSON.stringify(data));
    // get data using service instance
    expect(await service.get(key)).toEqual(data);
  });

  it("should return null if key doesn't exist", async () => {
    expect.assertions(1);
    expect(await service.get("asdf")).toEqual(null);
  });

  it("should throw an error it database throws it", async () => {
    expect.assertions(1);
    const service = getPositionService(fakeClient as any);
    try {
      await service.get("key1");
    } catch (e) {
      if (e instanceof Error) expect(e.message).toBe("database error");
    }
  });
});
