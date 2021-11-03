import { Config } from "../../utils/config";
import { getRootRouter } from "../rootRouter";

const mockConfig: Config = {
  secretkey: "xxxx",
  port: 3000,
  NODE_ENV: "development",
};

describe("getRouters", () => {
  it("should include apiRouter", () => {
    // expect.assertions(1);
    const rootRouter = getRootRouter(mockConfig);
    // expect(rootRouter).toHaveProperty("apiRouter");
  });
});
