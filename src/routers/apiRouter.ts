import { Router } from "express";
import { ApiController } from "../controllers/apiController";

export const getApiRouter = (apiController: ApiController) => {
  const apiRouter = Router();

  apiRouter.get("/", apiController.getPosition);
  apiRouter.post("/", apiController.postPosition);

  return apiRouter;
};
