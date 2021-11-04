import { RequestHandler } from "express";
import { v4 as uuid, validate } from "uuid";
import { Config } from "../utils/config";

export interface ApiController {
  getPosition: RequestHandler;
  postPosition: RequestHandler;
}

export const getApiController = (config: Config): ApiController => {
  return {
    getPosition: (req, res) => {
      const { id } = req.params;
      // validate id
      if (!validate(id)) {
        return res.status(400).send({ result: "error", detail: "invalid ID" });
      }
      /**
       * mock implementation
       */
      if (id === "9493ee0f-d324-47de-987d-67d7099ac19b") {
        res.status(200).send({
          result: "success",
          detail: { latidude: 100, longitude: 100 },
        });
        return;
      }
      return res.status(404).send({ result: "not found" });
    },
    postPosition: (req, res) => {
      // validate payload
      const { latitude, longitude } = req.body;
      if (
        !(
          latitude &&
          typeof latitude === "number" &&
          longitude &&
          typeof longitude === "number"
        )
      ) {
        return res.status(400).send({
          result: "error",
          detail: "invalid payload",
        });
      }
      // generate ID for the position
      const id = uuid();
      // TODO: store data to database
      // respond client
      return res.status(201).send({
        result: "success",
        detail: { id, latitude, longitude },
      });
    },
  };
};
