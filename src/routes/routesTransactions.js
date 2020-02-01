// ## TRANSACTIONS ## //

import { Router } from "express";
import ControllerTransaction from "../controllers/controllerTransaction";
import { throwError } from "../utils/responses_struct";
import authService from "../services/auth-service";

const routes = Router();

routes.get("/", authService.authorizeOnlyAdmin, async (req, res, next) => {
  try {
    await ControllerTransaction.findAll(req, res);
  } catch (err) {
    throwError(res, err);
  }
});

routes.get("/:guid", authService.authorize, async (req, res, next) => {
  try {
    await ControllerTransaction.findOne(req, res);
  } catch (err) {
    throwError(res, err);
  }
});

routes.post("/", authService.authorize, async (req, res, next) => {
  try {
    await ControllerTransaction.create(req, res);
  } catch (err) {
    throwError(res, err);
  }
});

export default routes;
