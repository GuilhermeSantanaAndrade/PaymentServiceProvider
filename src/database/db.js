import Sequelize from "sequelize";
import dbConfig from "./config.js";
import User from "../models/User.js";
import Ambient from "../models/Ambient.js";

const connection = new Sequelize(dbConfig);
User.init(connection);
Ambient.init(connection);

export default connection;
