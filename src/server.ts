import express from "express";
import { getApiController } from "./controllers/apiController";
import { getApiRouter } from "./routers/apiRouter";
import { getPositionService } from "./services/positionService";

import { config } from "./utils/config";
import { getRedisClient } from "./utils/redis";

const app = express();
// use JSON body parser middleware
app.use(express.json());

// route for status check
app.get("/", (req, res) => res.send({ status: "OK" }));

(async () => {
  // redis client
  const redisClient = await getRedisClient(config);
  // services
  const positionService = getPositionService(redisClient, config);
  // controllers
  const apiController = getApiController(positionService);
  // routers
  const apiRouter = getApiRouter(apiController);
  // add route
  app.use("/api", apiRouter);

  // start server
  app.listen(config.port, () =>
    console.log(`✨✨ Listening on port ${config.port} ✨✨`)
  );
})();
