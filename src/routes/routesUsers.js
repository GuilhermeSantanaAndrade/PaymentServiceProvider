// ## USERS ## //

import { Router } from "express";
import ControllerUser from "../controllers/controllerUser";
import { throwError } from "../utils/responses_struct";
import authService from "../services/auth-service";
import input from "./routesTransactions.schema";

const routes = Router();

routes.post("/authenticate", input.validatePOST1, async (req, res, next) => {
  try {
    await ControllerUser.authenticate(req, res, next);
  } catch (err) {
    throwError(res, err);
  }
});

routes.get("/", authService.authorizeOnlyAdmin, async (req, res, next) => {
  try {
    await ControllerUser.findAll(req, res);
  } catch (err) {
    throwError(res, err);
  }
});

routes.get(
  "/:id",
  authService.authorizeOnlyAdmin,
  input.validateGET1,
  async (req, res, next) => {
    try {
      await ControllerUser.findOne(req, res);
    } catch (err) {
      throwError(res, err);
    }
  }
);

routes.post(
  "/",
  authService.authorizeOnlyAdmin,
  input.validatePOST2,
  async (req, res, next) => {
    try {
      await ControllerUser.create(req, res);
    } catch (err) {
      throwError(res, err);
    }
  }
);

export default routes;
