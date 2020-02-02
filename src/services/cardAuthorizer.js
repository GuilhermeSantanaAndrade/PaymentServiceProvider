const randomer = require("../utils/functions.js");

exports.authorize = async (
  service_id,
  value,
  description,
  debit_credit,
  card_number,
  dueDate_card,
  cvv_card
) => {
  const nsu = randomer.minMaxRandom(100, 999999);
  const aut = randomer.minMaxRandom(1000, 9999999);
  return Promise.resolve({
    status: 200,
    message: "Authorized",
    nsu: nsu,
    aut: aut
  });
};
