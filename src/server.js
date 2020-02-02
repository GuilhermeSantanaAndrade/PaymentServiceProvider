import app from "./app";
import dbConnection from "./database/db.js";

global.dbConnection = dbConnection;
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Servidor ON (Porta ${PORT})`);
});
