import routesTransactions from "./routesTransactions";
import routesPayables from "./routesPayables";
import routesUsers from "./routesUsers";
import routesAmbients from "./routesAmbients";
import { Router } from "express";

const mainRoutes = Router();

mainRoutes.use("/transactions", routesTransactions);
mainRoutes.use("/payables", routesPayables);
mainRoutes.use("/users", routesUsers);
mainRoutes.use("/ambients", routesAmbients);

export default mainRoutes;
