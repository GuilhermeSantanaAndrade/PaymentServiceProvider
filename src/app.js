import express from "express";
import cors from "cors";
import variables from "dotenv";
import global from "./globals";
import dbConnection from "./database/db.js";

variables.config({
  path: ".env"
});

class AppController {
  constructor() {
    this.express = express();
    this.middlewares();
    this.routes();
    this.handle404();
  }

  middlewares() {
    this.express.use(express.json());
    this.express.use(cors());
  }

  routes() {
    import routes from "./routes/index";
    this.express.use(routes);
  }

  handle404() {
    this.express.use(function(req, res, next) {
      res.status("404").json({ status: 404, message: "URL não encontrada." });
      next();
    });
  }
}

export default new AppController().express;
