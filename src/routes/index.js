import routesTransactions from "./routesTransactions";
import routesPayables from "./routesPayables";
import routesUsers from "./routesUsers";
import routesAmbients from "./routesAmbients";
import routesPaymentTypes from "./routesPaymentTypes";
import { Router } from "express";

const mainRoutes = Router();

mainRoutes.use("/transactions", routesTransactions);
mainRoutes.use("/payables", routesPayables);
mainRoutes.use("/users", routesUsers);
mainRoutes.use("/ambients", routesAmbients);
mainRoutes.use("/payment_types", routesPaymentTypes);
mainRoutes.get("/", (req, res, next) => {
  res.send(
    "Bem vindo! Siga o documentação da API em https://github.com/GuilhermeSantanaAndrade/PaymentServiceProvider"
  );
});

export default mainRoutes;
