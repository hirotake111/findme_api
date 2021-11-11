import { Router } from "express";
import { ApiController } from "../controllers/apiController";

export const getApiRouter = (apiController: ApiController) => {
  const apiRouter = Router();

  apiRouter.get("/:id", apiController.getPosition);
  apiRouter.post("/:id", apiController.getPositionByCode);
  apiRouter.post("/", apiController.postPosition);

  return apiRouter;
};
