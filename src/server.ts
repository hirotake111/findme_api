import express from "express";

import { config } from "./utils/config";

const app = express();

app.get("/", (req, res) => res.send({ status: "OK" }));

app.listen(config.port, () =>
  console.log(`✨✨ Listening on port ${config.port} ✨✨`)
);
