// ## CONFIGS ## //

import { Router } from "express";

const routes = Router();

routes.get("/", async (req, res) => {
  res.send("Configs GET");
});

export default routes;
