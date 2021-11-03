import express, { Express, Router } from "express";
import request from "supertest";

import { ApiController } from "../controllers/apiController";
import { getApiRouter } from "../routers/apiRouter";

let app: Express;
let apiRouter: Router;

const mockController: ApiController = {
  getPosition: (req, res) => res.status(200).send({ result: "success" }),
  postPosition: (req, res) => res.status(201).send({ result: "success" }),
};

beforeEach(() => {
  app = express();
  apiRouter = getApiRouter(mockController);
  app.use("/", apiRouter);
});

it("should invoke apiController.getPosition", async () => {
  expect.assertions(1);
  const res = await request(app).get("/");
  expect(res.statusCode).toBe(200);
});

it("should invoke apiController.postPosition", async () => {
  expect.assertions(1);
  const res = await request(app).post("/");
  expect(res.statusCode).toBe(201);
});
