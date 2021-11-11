import { RequestHandler } from "express";
import { v4 as uuid, validate } from "uuid";
import { PositionService } from "../services/positionService";
import { Position } from "../types";
import { Config } from "../utils/config";
import { validatePosition } from "../utils/validators";

export interface ApiController {
  getPosition: RequestHandler;
  getPositionByCode: RequestHandler;
  postPosition: RequestHandler;
}

export const getApiController = (service: PositionService): ApiController => {
  return {
    getPosition: async (req, res) => {
      const { id } = req.params;
      const code = req.query?.code;
      // validate id
      if (!validate(id)) {
        return res.status(400).send({ result: "error", detail: "invalid ID" });
      }
      try {
        // get position data from database
        const result = await service.get(id);
        if (!result) return res.status(404).send({ result: "not found" });

        if (!result.code) {
          // code is not required -> send position data to user
          return res.status(200).send({
            result: "success",
            detail: { latitude: result.latitude, longitude: result.longitude },
          });
        }
        // code is required but not provided by user
        return res.status(200).send({ result: "code required" });
      } catch (e) {
        console.log(e);
        return res
          .status(500)
          .send({ result: "error", detail: "internal server error" });
      }
    },

    getPositionByCode: async (req, res) => {
      // get ID and code
      const { id } = req.params;
      const { code } = req.body;
      // validate ID and code
      if (!(id && validate(id)))
        return res.status(400).send({ result: "error", detail: "invalid ID" });
      if (!code)
        return res
          .status(400)
          .send({ result: "error", detail: "you need to provide code" });
      // get data from database
      try {
        const result = await service.get(id);
        // if data is not found in the datatabase, respond 404
        if (!result)
          return res.status(404).send({ result: "error", detail: "not found" });
        // respond data
        res.status(200).send({
          result: "success",
          detail: {
            latitude: result.latitude,
            longitude: result.longitude,
            code: result.code,
          },
        });
      } catch (e) {
        console.log(e);
        return res
          .status(500)
          .send({ result: "error", detail: "internal server error" });
      }
    },

    postPosition: async (req, res) => {
      // generate ID for the position
      let position: Position;
      const id = uuid();
      // store data to database
      try {
        position = await service.set(id, req.body);
      } catch (e) {
        return res
          .status(400)
          .send({ result: "error", detail: "invalid payload" });
      }
      // respond client
      return res.status(201).send({
        result: "success",
        detail: { id, position },
      });
    },
  };
};
