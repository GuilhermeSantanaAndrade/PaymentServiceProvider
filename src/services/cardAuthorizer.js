const randomer = require("../utils/functions.js");
const Joi = require("@hapi/joi");

exports.authorize = async (
  service_id,
  value,
  description,
  debit_credit,
  card_number,
  owner_name_card,
  dueDate_card,
  cvv_card
) => {
  const obj = Joi.object({
    card_number: Joi.string()
      .length(16)
      .required(),
    owner_name_card: Joi.string().required(),
    dueDate_card: Joi.string()
      .length(5)
      .required(),
    cvv_card: Joi.string()
      .length(3)
      .required()
  });

  let input = { card_number, owner_name_card, dueDate_card, cvv_card };
  const result = obj.validate(input);
  if (result.error) {
    throw result.error.message;
  }

  const nsu = randomer.minMaxRandom(100, 999999);
  const aut = randomer.minMaxRandom(1000, 9999999);
  return Promise.resolve({
    status: 200,
    message: "Authorized",
    nsu: nsu,
    aut: aut
  });
};
