import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  secretkey: process.env.SECRETKEY || "sssshhhhhi",
  NODE_ENV: process.env.NODE_ENV || "development",
  redis: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
  },
};

export type Config = typeof config;
