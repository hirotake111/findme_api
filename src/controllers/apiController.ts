import { RequestHandler } from "express";
import { v4 as uuid, validate } from "uuid";
import { PositionService } from "../services/positionService";
import { Position } from "../types";
import { Config } from "../utils/config";
import { validatePosition } from "../utils/validators";

export interface ApiController {
  getPosition: RequestHandler;
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
        if (!code) {
          // code is required but not provided by user
          return res.status(200).send({ result: "code required" });
        }
        if (result.code === code) {
          // code is required and provided code matches
          return res.status(200).send({
            result: "success",
            detail: { latitude: result.latitude, longitude: result.longitude },
          });
        }
        // provided code does not match
        return res.status(400).send({
          result: "bad request",
          detail: "code does not match",
        });
      } catch (e) {
        console.log(e);
        return res.status(500).send({ result: "internal server error" });
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
