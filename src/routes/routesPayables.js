// ## PAYABLES ## //

import { Router } from "express";
import ControllerPayable from "../controllers/controllerPayable";
import { throwError, throwRefuse401 } from "../utils/responses_struct";
import authService from "../services/auth-service";
import input from "./schemas/routesPayables.schema";

const routes = Router();

// Usuário ADMIN pode ver todos pagáveis, sendo dele ou não.
// Usuário NOT-ADMIN só pode ver pagáveis filtrando ele próprio no query params
routes.get("/", input.validateGET1, async (req, res, next) => {
  try {
    const loggedUser = await authService.authorize(req, res, undefined);
    const usernameToFilter = req.query.username;

    if (!loggedUser) return;

    if (loggedUser.user_admin) {
      if (usernameToFilter) {
        await ControllerPayable.findMany(req, res, usernameToFilter);
      } else {
        await ControllerPayable.findAll(req, res, loggedUser);
      }
    } else {
      if (usernameToFilter !== loggedUser.username) {
        throwRefuse401(res, "Acesso Restrito[3].");
        return;
      }
      await ControllerPayable.findMany(req, res, usernameToFilter);
    }
  } catch (err) {
    throwError(res, err);
  }
});

routes.get("/funds", input.validateGET1, async (req, res) => {
  try {
    const loggedUser = await authService.authorize(req, res, undefined);
    const usernameToFilter = req.query.username;

    if (!loggedUser) return;

    if (!usernameToFilter) {
      throwRefuse401(
        res,
        "Necessário informar o usuário da busca. [query param: username]"
      );
      return;
    }

    if (loggedUser.user_admin) {
      if (usernameToFilter) {
        await ControllerPayable.findAvaible_x_waiting(
          req,
          res,
          usernameToFilter
        );
      }
    } else {
      if (usernameToFilter !== loggedUser.username) {
        throwRefuse401(res, "Acesso Restrito[3].");
        return;
      }
      await ControllerPayable.findAvaible_x_waiting(req, res, usernameToFilter);
    }
  } catch (err) {
    throwError(res, err);
  }
});

routes.get(
  "/:guid",
  authService.authorize,
  input.validateGET2,
  async (req, res, next) => {
    try {
      await ControllerPayable.findOne(req, res);
    } catch (err) {
      throwError(res, err);
    }
  }
);

routes.post("/:guid/antecipate", input.validatePOST1, async (req, res) => {
  try {
    await ControllerPayable.antecipate(req, res);
  } catch (err) {
    throwError(res, err);
  }
});

export default routes;
