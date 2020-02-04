// ## PAYMENT_TYPES ## //

import { Router } from "express";
import ControllerPaymentType from "../controllers/controllerPaymentType";
import { throwError } from "../utils/responses_struct";
import authService from "../services/auth-service";
import input from "./schemas/routesPaymentTypes.schema";

const routes = Router();

routes.get("/", authService.authorizeOnlyAdmin, async (req, res, next) => {
  try {
    await ControllerPaymentType.findAll(req, res);
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
      await ControllerPaymentType.findOne(req, res);
    } catch (err) {
      throwError(res, err);
    }
  }
);

routes.post(
  "/",
  authService.authorizeOnlyAdmin,
  input.validatePOST1,
  async (req, res, next) => {
    try {
      await ControllerPaymentType.create(req, res);
    } catch (err) {
      throwError(res, err);
    }
  }
);

export default routes;
