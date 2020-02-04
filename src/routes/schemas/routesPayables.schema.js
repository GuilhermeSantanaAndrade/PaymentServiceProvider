import Joi from "@hapi/joi";
import { throwRefuse401 } from "../../utils/responses_struct";

exports.validateGET1 = async (req, res, next) => {
  const obj = Joi.object({
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(25)
  });

  let input = { username: req.query.username };
  const result = obj.validate(input);
  if (result.error) {
    throwRefuse401(res, result.error.message);
    return;
  } else {
    next();
  }
};

exports.validateGET2 = async (req, res, next) => {
  const obj = Joi.object({
    guid: Joi.string()
      .length(36)
      .required()
  });

  let input = req.params;
  const result = obj.validate(input);
  if (result.error) {
    throwRefuse401(res, result.error.message);
    return;
  } else {
    next();
  }
};

exports.validatePOST1 = async (req, res, next) => {
  const obj = Joi.object({
    guid: Joi.string()
      .length(36)
      .required()
  });

  let input = req.params;
  const result = obj.validate(input);
  if (result.error) {
    throwRefuse401(res, result.error.message);
    return;
  } else {
    next();
  }
};
