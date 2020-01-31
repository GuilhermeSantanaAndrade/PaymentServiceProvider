// ## PAYABLES ## //

import { Router } from "express";

const routes = Router();

routes.get("/", async (req, res) => {
  res.send("Payables GET");
});

export default routes;
