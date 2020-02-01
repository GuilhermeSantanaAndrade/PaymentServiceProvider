import transaction from "../models/Transaction";
import payment_type from "../models/PaymentType";
import user from "../models/User";
import { prepareSuccess200, throwRefuse401 } from "../utils/responses_struct";
import uuidv4 from "uuid/v4";
import operatorsAuthorizer from "../services/operatorsAuthorizer";

class ControllerTransaction {
  findAll = async (req, res) => {
    const finds = await transaction.findAll();

    const result = prepareSuccess200(finds);
    res.json(result);
  };

  findOne = async (req, res) => {
    const query = req.query.id;
    const params = req.params.id;

    const find = await transaction.findOne({
      where: {
        guid: query || params
      }
    });

    const result = prepareSuccess200(find);
    res.json(result);
  };

  create = async (req, res) => {
    const guid = uuidv4();
    const {
      service_id,
      id_user,
      external_sale_id,
      value,
      description,
      str_code_payment,
      card_number,
      dueDate_card,
      cvv_card
    } = req.body;

    //TO-DO
    // Verificar no mongoDB se service_id já foi chamado

    const payment = await payment_type.findOne({
      where: {
        str_code: str_code_payment
      }
    });

    if (!payment) {
      throwRefuse401(
        res,
        `Não foi encontrado Tipo de Pagamento com str_code "${str_code_payment}".`
      );
      return;
    }

    const userInformed = await user.findOne({
      where: {
        id: id_user
      }
    });

    if (!userInformed) {
      throwRefuse401(res, `Não foi encontrado Usuário com id "${id_user}".`);
      return;
    }

    const cardAuthorization = await operatorsAuthorizer.authorizeCard(
      service_id,
      value,
      description,
      str_code_payment === "debit_card" ? "debit" : "credit",
      card_number,
      dueDate_card,
      cvv_card
    );

    res.json(cardAuthorization);
  };
}

export default new ControllerTransaction();
