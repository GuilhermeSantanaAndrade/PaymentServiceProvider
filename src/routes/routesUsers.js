// ## USERS ## //

import { Router } from "express";
import ControllerUser from "../controllers/controllerUser";
import { throwError } from "../utils/responses_struct";
import authService from "../services/auth-service";

const routes = Router();

routes.get("/authenticate", async (req, res, next) => {
  try {
    await ControllerUser.authenticate(req, res, next);
  } catch (err) {
    throwError(res, err);
  }
});

export default routes;
