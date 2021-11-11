import express, { Express, Router } from "express";
import request from "supertest";
import { v4 as uuid } from "uuid";

import { ApiController } from "../controllers/apiController";
import { getApiRouter } from "../routers/apiRouter";

let app: Express;
let apiRouter: Router;

const mockController: ApiController = {
  getPosition: (req, res) => res.status(200).send({ id: req.params.id }),
  getPositionByCode: (req, res) => res.status(200).send(req.body),
  postPosition: (req, res) => res.status(201).send(req.body),
};

beforeEach(() => {
  app = express();
  app.use(express.json());
  apiRouter = getApiRouter(mockController);
  app.use("/", apiRouter);
});

it("should invoke apiController.getPosition, with id", async () => {
  expect.assertions(2);
  const id = uuid();
  const res = await request(app).get(`/${id}`);
  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual({ id });
});

it("should invoke apiController.getPositionByCode", async () => {
  expect.assertions(1);
  const res = await request(app).post("/xxxx").send({ code: "xxx" });
  expect(res.body).toEqual({ code: "xxx" });
});

it("should invoke apiController.postPosition", async () => {
  expect.assertions(2);
  const res = await request(app).post("/").send({ latitude: 1, longitude: 2 });
  expect(res.statusCode).toBe(201);
  expect(res.body).toEqual({ latitude: 1, longitude: 2 });
});
