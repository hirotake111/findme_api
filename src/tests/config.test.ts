import { config } from "../utils/config";

it("should include key parameters", () => {
  expect(config.port).toEqual(3000);
  expect(config.secretkey).toEqual("sssshhhhhi");
  expect(config.NODE_ENV).toEqual("development");
});
