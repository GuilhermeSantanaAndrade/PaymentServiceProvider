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
    service_id: Joi.string()
      .number()
      .length(10)
      .required(),
    id_user: Joi.number().required(),
    external_sale_id: Joi.string()
      .required()
      .max(30),
    value: Joi.number()
      .required()
      .positive(),
    description: Joi.string()
      .required()
      .max(100),
    str_code_payment: Joi.string()
      .required()
      .max(30),
    card_number: Joi.string().required(),
    owner_name_card: Joi.string().required(),
    dueDate_card: Joi.string().required(),
    cvv_card: Joi.string().required()
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
