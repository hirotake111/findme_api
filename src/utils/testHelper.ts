import { Config } from "./config";

export const getMockConfig = (): Config => {
  return {
    port: 3333,
    secretkey: "secret",
    NODE_ENV: "development",
  };
};
