// ## AMBIENTS ## //

import { Router } from "express";
import ControllerAmbient from "../controllers/controllerAmbient";
import { throwError } from "../utils/responses_struct";

const routes = Router();

routes.get("/", async (req, res) => {
  try {
    await ControllerAmbient.findAll(req, res);
  } catch (err) {
    throwError(res, err);
  }
});

routes.get("/:id?", async (req, res) => {
  try {
    await ControllerAmbient.findOne(req, res);
  } catch (err) {
    throwError(res, err);
  }
});

routes.post("/", async (req, res) => {
  try {
    await ControllerAmbient.create(req, res);
  } catch (err) {
    throwError(res, err);
  }
});

export default routes;
