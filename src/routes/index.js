import routesTransactions from "./routesTransactions";
import routesPayables from "./routesPayables";
import routesUsers from "./routesUsers";
import { Router } from "express";

const mainRoutes = Router();

mainRoutes.use("/transactions", routesTransactions);
mainRoutes.use("/payables", routesPayables);
mainRoutes.use("/users", routesUsers);
mainRoutes.use("/configs", routesUsers);

export default mainRoutes;
