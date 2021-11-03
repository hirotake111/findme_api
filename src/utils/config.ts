import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  secretkey: process.env.SECRETKEY || "sssshhhhhi",
};

export type Config = typeof config;
