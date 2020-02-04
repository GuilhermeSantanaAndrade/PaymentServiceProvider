import app from "./app";
import dbConnection from "./database/db.js";
import controllerPayable from "./controllers/controllerPayable";
import controllerPaid from "./controllers/controllerPaid";
import controllerServiceRequest from "./controllers/controllerServiceRequest";

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Servidor ON (Porta ${PORT})`);
});

// TIMER FUNCTIONS //

const _timeToCheck = 60000 * 5;

async function checkRefunds() {
  const refundsList = await controllerPayable.checkRefunds();

  refundsList.data.map(item => {
    controllerPaid.create({
      id_payable: item.id,
      paidDate: undefined,
      paid_value: item.value
    });
  });
}

async function deleteServicesIdLast24Hours() {
  controllerServiceRequest.deleteLast24hours();
}

async function processTimer(timeToCheck = 60000) {
  setTimeout(async function() {
    checkRefunds();
    deleteServicesIdLast24Hours();

    processTimer(_timeToCheck);
  }, timeToCheck);
}
processTimer(_timeToCheck);
