import Joi from "@hapi/joi";
import { throwRefuse401 } from "../../utils/responses_struct";

exports.validateGET1 = async (req, res, next) => {
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
    description: Joi.string()
      .min(1)
      .max(50)
      .required(),
    str_code: Joi.string()
      .min(1)
      .max(30)
      .required(),
    days_refund: Joi.integer()
      .min(0)
      .required(),
    fee: Joi.number()
      .min(0)
      .max(100)
      .required()
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
