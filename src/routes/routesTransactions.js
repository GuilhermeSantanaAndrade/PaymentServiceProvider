// ## TRANSACTIONS ## //

import { Router } from "express";
import ControllerTransaction from "../controllers/controllerTransaction";
import { throwError, throwRefuse401 } from "../utils/responses_struct";
import authService from "../services/auth-service";

const routes = Router();

// query: ?username
// Usuário ADMIN pode ver todas transactions, sendo dele ou não.
// Usuário NOT-ADMIN só pode ver transaction filtrando ele próprio no query params
routes.get("/", async (req, res, next) => {
  try {
    const loggedUser = await authService.authorize(req, res, undefined);
    const usernameToFilter = req.query.username;

    if (!loggedUser) return;

    if (loggedUser.user_admin) {
      if (usernameToFilter) {
        await ControllerTransaction.findMany(req, res, usernameToFilter);
      } else {
        await ControllerTransaction.findAll(req, res, loggedUser);
      }
    } else {
      if (usernameToFilter !== loggedUser.username) {
        throwRefuse401(res, "Acesso Restrito[3].");
        return;
      }
      await ControllerTransaction.findMany(req, res, usernameToFilter);
    }
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
