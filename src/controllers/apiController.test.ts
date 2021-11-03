import { config } from "../utils/config";
import { getApiController } from "./apiController";

const mockStatus = jest.fn();
const mockSend = jest.fn();
const res = {
  status: mockStatus,
  send: mockSend,
} as any;
const next = jest.fn();

beforeEach(() => {
  mockStatus.mockClear();
  mockStatus.mockReturnThis();
  mockSend.mockClear();
});

describe("getPosition", () => {
  it("should return HTTP 200 with position data if ID parameter matches", () => {
    expect.assertions(2);
    const req = {
      params: { id: "9493ee0f-d324-47de-987d-67d7099ac19b" },
    } as any;
    const { getPosition } = getApiController(config);
    getPosition(req, res, next);
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockSend).toHaveBeenCalledWith({
      result: "success",
      detail: { latidude: 100, longitude: 100 },
    });
  });

  it("should return HTTP 404 if ID doesn't match", () => {
    expect.assertions(2);
    const req = {
      params: { id: "8ae7edd6-53ef-4dfc-a3b1-c7a6d45f17d5" },
    } as any;
    const { getPosition } = getApiController(config);
    getPosition(req, res, next);
    expect(mockStatus).toHaveBeenCalledWith(404);
    expect(mockSend).toHaveBeenCalledWith({ result: "not found" });
  });

  it("should return HTTP 400 if ID is invalid", () => {
    expect.assertions(2);
    const req = { params: { id: "xxxx" } } as any;
    const { getPosition } = getApiController(config);
    getPosition(req, res, next);
    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockSend).toHaveBeenCalledWith({
      result: "error",
      detail: "invalid ID",
    });
  });
});

describe("postPosition", () => {
  it("should return HTTP 201 if data stored successfully", () => {
    expect.assertions(1);
    const req = { body: { latitude: 100, longitude: 50 } } as any;
    const { postPosition } = getApiController(config);
    postPosition(req, res, next);
    expect(mockStatus).toHaveBeenCalledWith(201);
  });

  it("should return HTTP 400 if parameters are invalid", () => {
    expect.assertions(2);
    const req = { body: { latitude: 100, longitude: "50" } } as any;
    const { postPosition } = getApiController(config);
    postPosition(req, res, next);
    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockSend).toHaveBeenCalledWith({
      result: "error",
      detail: "invalid payload",
    });
  });
});
