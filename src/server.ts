import express from "express";
import { getApiController } from "./controllers/apiController";
import { getApiRouter } from "./routers/apiRouter";

import { config } from "./utils/config";

const app = express();
// use JSON body parser middleware
app.use(express.json());

// route for status check
app.get("/", (req, res) => res.send({ status: "OK" }));

// controllers
const apiController = getApiController(config);
// routers
const apiRouter = getApiRouter(apiController);
// add route
app.use("/api", apiRouter);

// start server
app.listen(config.port, () =>
  console.log(`✨✨ Listening on port ${config.port} ✨✨`)
);
