import { Router } from "express";

const routes = Router();

routes.get("/", async (req, res) => {
  res.send("Transactions GET");
});

export default routes;