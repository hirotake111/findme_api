import { Position } from "../types";
import { getMockPosition } from "../utils/testHelper";
import { validatePosition } from "../utils/validators";

describe("positionValidator", () => {
  it("should validate payload without code successfully", () => {
    expect.assertions(1);
    const data = getMockPosition();
    expect(validatePosition(data)).toEqual(data);
  });

  it("should validate payload with code successfully", () => {
    expect.assertions(1);
    const data: Position = { ...getMockPosition(), code: "abcd" };
    expect(validatePosition(data)).toEqual(data);
  });

  it("should throw an error if latitude is invalid", () => {
    expect.assertions(1);
    try {
      validatePosition({ longitude: 33.333 });
    } catch (e) {
      if (e instanceof Error)
        expect(e.message).toEqual("invalid value in latitude: undefined");
    }
  });

  it("should throw an error if longitude is invalid", () => {
    expect.assertions(1);
    try {
      validatePosition({ latitude: 33.333 });
    } catch (e) {
      if (e instanceof Error)
        expect(e.message).toEqual("invalid value in longitude: undefined");
    }
  });

  it("should throw an error if code is not string", () => {
    expect.assertions(1);
    try {
      validatePosition({ latitude: 22.222, longitude: 33.333, code: 123 });
    } catch (e) {
      if (e instanceof Error)
        expect(e.message).toEqual("invalid value in code: 123");
    }
  });
});
