import { request } from "express";
import { v4 as uuid, validate } from "uuid";

import { getApiController } from "../controllers/apiController";
import { PositionService } from "../services/positionService";

const mockStatus = jest.fn();
const mockSend = jest.fn();
const res = {
  status: mockStatus,
  send: mockSend,
} as any;
const next = jest.fn();

const mockGet = jest.fn();
const mockSet = jest.fn();

const mockPositionService: PositionService = {
  get: mockGet,
  set: mockSet,
};

beforeEach(() => {
  mockStatus.mockClear();
  mockStatus.mockReturnThis();
  mockSend.mockClear();
  mockSet.mockClear();
  mockSet.mockClear();
});

describe("getPosition", () => {
  let req: any;
  const { getPosition } = getApiController(mockPositionService);
  beforeEach(() => {});
  req = {
    params: { id: "9493ee0f-d324-47de-987d-67d7099ac19b" },
  } as any;

  it("should return HTTP 200 and position data ID matches", async () => {
    expect.assertions(2);
    mockGet.mockReturnValue({ latitude: 11.111, longitude: 22.222 });
    await getPosition(req, res, next);
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockSend).toHaveBeenCalledWith({
      result: "success",
      detail: { latitude: 11.111, longitude: 22.222 },
    });
  });

  it("should return HTTP 404 if ID doesn't match", async () => {
    expect.assertions(2);
    mockGet.mockReturnValue(null);
    await getPosition(req, res, next);
    expect(mockStatus).toHaveBeenCalledWith(404);
    expect(mockSend).toHaveBeenCalledWith({ result: "not found" });
  });

  it("should return HTTP 400 if ID is invalid", async () => {
    expect.assertions(2);
    const { getPosition } = getApiController(mockPositionService);
    await getPosition({ params: { id: "xxx" } } as any, res, next);
    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockSend).toHaveBeenCalledWith({
      result: "error",
      detail: "invalid ID",
    });
  });

  it("should respond HTTP 200 with a message 'code required' if record in db contains code", async () => {
    expect.assertions(2);
    mockGet.mockReturnValue({
      latitude: 11.111,
      longitude: 22.222,
      code: "asdf",
    });
    await getPosition(req, res, next);
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockSend).toHaveBeenCalledWith({ result: "code required" });
  });

  it("should return HTTP 500 if failed to get data from database", async () => {
    expect.assertions(2);
    const tmp = console.log;
    console.log = jest.fn();
    mockGet.mockImplementation(() => {
      throw new Error("database error!!!!");
    });
    await getPosition(req, res, next);
    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockSend).toHaveBeenCalledWith({
      result: "error",
      detail: "internal server error",
    });
    console.log = tmp;
  });
});

describe("getPositionByCode", () => {
  let req: any;
  const { getPositionByCode } = getApiController(mockPositionService);

  beforeEach(() => {
    req = {
      params: { id: "9493ee0f-d324-47de-987d-67d7099ac19b" },
      body: { code: "abcd" },
    };
  });

  it("should return position data if ID and code matches", async () => {
    expect.assertions(2);
    mockGet.mockReturnValue({
      latitude: 11.111,
      longitude: 22.222,
      code: "abcd",
    });
    await getPositionByCode(req, res, next);
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockSend).toHaveBeenCalledWith({
      result: "success",
      detail: { latitude: 11.111, longitude: 22.222 },
    });
  });

  it("should respond HTTP 400 if code doesn't match", async () => {
    expect.assertions(2);
    mockGet.mockReturnValue({
      latitude: 11.111,
      longitude: 22.222,
      code: "aaaa",
    });
    await getPositionByCode(req, res, next);
    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockSend).toHaveBeenCalledWith({
      result: "error",
      detail: "incorrect code provided",
    });
  });

  it("should respond HTTP 400 if ID is invalid", async () => {
    expect.assertions(2);
    const { getPositionByCode } = getApiController(mockPositionService);
    await getPositionByCode({ ...req, params: { id: "xxxx" } }, res, next);
    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockSend).toHaveBeenCalledWith({
      result: "error",
      detail: "invalid ID",
    });
  });

  it("should respond HTTP 400 if code is not provided", async () => {
    expect.assertions(2);
    const { getPositionByCode } = getApiController(mockPositionService);
    await getPositionByCode({ ...req, body: { code: null } }, res, next);
    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockSend).toHaveBeenCalledWith({
      result: "error",
      detail: "you need to provide code",
    });
  });

  it("should respond HTTP 404 if ID is not found (in the database)", async () => {
    expect.assertions(2);
    mockGet.mockReturnValue(null);
    await getPositionByCode(req, res, next);
    expect(mockStatus).toHaveBeenCalledWith(404);
    expect(mockSend).toHaveBeenCalledWith({
      result: "error",
      detail: "not found",
    });
  });

  it("should respond HTTP 500 if it gets databaase error", async () => {
    expect.assertions(2);
    const tmp = console.log;
    console.log = jest.fn();
    mockGet.mockImplementation(() => {
      throw new Error("database error!!!!");
    });
    await getPositionByCode(req, res, next);
    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockSend).toHaveBeenCalledWith({
      result: "error",
      detail: "internal server error",
    });
    console.log = tmp;
  });
});

describe("postPosition", () => {
  let req: any;
  const { postPosition } = getApiController(mockPositionService);

  beforeEach(() => {
    req = { body: { latitude: 100, longitude: 50 } } as any;
  });

  it("should return HTTP 201 (without code) if data stored successfully", async () => {
    expect.assertions(3);
    mockSet.mockReturnValue({ latitude: 100, longitude: 50 });
    await postPosition(req, res, next);
    expect(mockStatus).toHaveBeenCalledWith(201);
    expect(validate(mockSend.mock.calls[0][0].detail.id)).toBeTruthy();
    expect(mockSend.mock.calls[0][0].detail.position.latitude).toBe(100);
  });

  it("should respond HTTP 400 if HTTP payload is invalid", async () => {
    expect.assertions(2);
    mockSet.mockImplementation(() => {
      throw new Error("unknown error");
    });
    await postPosition(req, res, next);
    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockSend).toHaveBeenCalledWith({
      result: "error",
      detail: "invalid payload",
    });
  });

  it("should respond HTTP 201 if data (with code) stored successfully", async () => {
    expect.assertions(3);
    req = { body: { ...req.body, code: "abcd" } } as any;
    mockSet.mockReturnValue({ latitude: 100, longitude: 50, code: "abcd" });
    await postPosition(req, res, next);
    expect(mockStatus).toHaveBeenCalledWith(201);
    expect(mockSend.mock.calls[0][0].detail.id.length).toBe(36);
    expect(mockSend.mock.calls[0][0].detail.position.code).toBe("abcd");
  });

  it("should respond HTTP 400 if code is provided but is too short", async () => {
    expect.assertions(2);
    const req = { body: { ...request.body, code: "abc" } } as any;
    mockSet.mockReturnValue({ latitude: 100, longitude: 50, code: "xxxx" });
    await postPosition(req, res, next);
    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockSend.mock.calls[0][0]).toEqual({
      result: "error",
      detail: "code is too short",
    });
  });

  it("should respond HTTP 400 if code contains non english characters or numbers", async () => {
    expect.assertions(2);
    const req = { body: { ...request.body, code: "abcdefd;" } } as any;
    mockSet.mockReturnValue({ latitude: 100, longitude: 50, code: "xxxx" });
    await postPosition(req, res, next);
    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockSend.mock.calls[0][0]).toEqual({
      result: "error",
      detail: "code contains invalid character(s)",
    });
  });
});
