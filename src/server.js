import app from "./app";
import dbConnection from "./database/db.js";
import controllerPayable from "./controllers/controllerPayable";
import controllerPaid from "./controllers/controllerPaid";

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Servidor ON (Porta ${PORT})`);
});

const _timeToCheck = 60000 * 5;

async function checkRefunds(timeToCheck = 60000) {
  setTimeout(async function() {
    const refundsList = await controllerPayable.checkRefunds();

    refundsList.data.map(item => {
      controllerPaid.create({
        id_payable: item.id,
        paidDate: undefined,
        paid_value: item.value
      });
    });
    checkRefunds(_timeToCheck);
  }, timeToCheck);
}
checkRefunds(_timeToCheck);
