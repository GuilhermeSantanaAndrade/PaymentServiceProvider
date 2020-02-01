import Sequelize from "sequelize";
import dbConfig from "./config.js";
import User from "../models/User.js";
import Ambient from "../models/Ambient.js";
import PaymentType from "../models/PaymentType.js";
import Transaction from "../models/Transaction.js";

const connection = new Sequelize(dbConfig);
User.init(connection);
Ambient.init(connection);
PaymentType.init(connection);
Transaction.init(connection);

export default connection;
