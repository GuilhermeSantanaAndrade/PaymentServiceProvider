// ## AMBIENTS ## //

import { Router } from "express";
import ControllerAmbient from "../controllers/controllerAmbient";
import { throwError } from "../utils/responses_struct";
import authService from "../services/auth-service";

const routes = Router();

routes.get("/", authService.authorizeOnlyAdmin, async (req, res, next) => {
  try {
    await ControllerAmbient.findAll(req, res);
  } catch (err) {
    throwError(res, err);
  }
});

routes.get("/:id", authService.authorizeOnlyAdmin, async (req, res, next) => {
  try {
    await ControllerAmbient.findOne(req, res);
  } catch (err) {
    throwError(res, err);
  }
});

routes.post("/", authService.authorizeOnlyAdmin, async (req, res, next) => {
  try {
    await ControllerAmbient.create(req, res);
  } catch (err) {
    throwError(res, err);
  }
});

export default routes;
