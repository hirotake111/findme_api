import { RequestHandler } from "express";
import { v4 as uuid, validate } from "uuid";

import { PositionService } from "../services/positionService";
import { Position } from "../types";

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
        // verify code
        if (code === result.code)
          return res.status(200).send({
            result: "success",
            detail: {
              latitude: result.latitude,
              longitude: result.longitude,
            },
          });
        return res.status(400).send({
          result: "error",
          detail: "incorrect code provided",
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
      // validate code
      const { code } = req.body;
      if (code) {
        if (code.length < 4)
          return res
            .status(400)
            .send({ result: "error", detail: "code is too short" });
        if (!/^[a-zA-Z]*$/.test(code))
          return res
            .status(400)
            .send({
              result: "error",
              detail: "code contains invalid character(s)",
            });
      }

      try {
        // store data to database
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
