import Sequelize from "./node_modules/sequelize";
import dbConfig from "./config.js";

const connection = new Sequelize(dbConfig);

export default connection;
