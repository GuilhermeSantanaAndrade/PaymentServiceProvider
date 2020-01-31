import routesTransactions from "./routesTransactions";
import routesPayables from "./routesPayables";
import { Router } from "express";

const mainRoutes = Router();

mainRoutes.use("/transactions", routesTransactions);
mainRoutes.use("/payables", routesPayables);

export default mainRoutes;
