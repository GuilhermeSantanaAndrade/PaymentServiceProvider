import express from "express";
import cors from "cors";
import variables from "dotenv";

global.SALT_KEY = "f6c845142-6542-4cA3-90f3-65e87e6761ec";
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
