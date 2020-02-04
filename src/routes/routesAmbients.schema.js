import Joi from "@hapi/joi";
import { throwRefuse401 } from "../utils/responses_struct";

exports.validateGET2 = async (req, res, next) => {
  const obj = Joi.object({
    id: Joi.integer().required()
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
    name: Joi.string()
      .required()
      .min(3)
      .max(255),
    antecipate_fee: Joi.number()
      .required()
      .min(0)
      .max(100)
  });

  let input = req.body;
  const result = obj.validate(input);
  if (result.error) {
    throwRefuse401(res, result.error.message);
    return;
  } else {
    next();
  }
};
