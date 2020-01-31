// ## USERS ## //

import { Router } from "express";

const routes = Router();

routes.get("/", async (req, res) => {
  res.send("Users GET");
});

export default routes;
