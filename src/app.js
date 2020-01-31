import express from "express";
import cors from "cors";
import variables from "dotenv";

const vars = variables.config({
  path: ".env"
});

class AppController {
  constructor() {
    this.express = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.express.use(express.json());
    this.express.use(cors());
  }

  routes() {
    // importa o arquivo principal das rotas
    import routes from "./routes/index";
    this.express.use(routes);
  }
}

export default new AppController().express;
