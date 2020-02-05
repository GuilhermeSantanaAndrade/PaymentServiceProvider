import service_request from "../models/ServiceRequest";
import { prepareSuccess200, throwRefuse401, throwError } from "../utils/responses_struct";
import moment from "moment";
import Sequelize from "sequelize";

class ServiceRequest {
  checkAlreadyExists = async (req, res, next) => {
    try {
      const find = await service_request.findOne({
        where: {
          informed_service_id: req.body.service_id
        }
      });

      if (find) {
        throwRefuse401(res, "service_id já utilizado.");
      } else {
        next();
      }
    } catch (err) {
      throwError(res, err);
    }
  };

  deleteLast24hours = async (req, res) => {
    await global.dbConnection.query(
      `DELETE
        FROM "service_requests"
        WHERE "createdAt" <= (NOW() - interval '24 hour')`,
      { type: Sequelize.QueryTypes.DELETE }
    );
  };

  create = async (req, res, next) => {
    try {
      const service_id = req.body.service_id;
      await service_request.create({
        informed_service_id: service_id
      });

      next();
    } catch (err) {
      throwError(res, err);
    }
  };
}

export default new ServiceRequest();
