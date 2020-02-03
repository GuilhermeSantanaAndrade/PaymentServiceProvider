import transaction from "../models/Transaction";
import controllerPayable from "../controllers/controllerPayable";
import payment_type from "../models/PaymentType";
import user from "../models/User";
import { prepareSuccess200, throwRefuse401 } from "../utils/responses_struct";
import uuidv4 from "uuid/v4";
import cardAuthorizer from "../services/cardAuthorizer";
import authService from "../services/auth-service";

class ControllerTransaction {
  findAll = async (req, res, userInfos) => {
    const finds = await transaction.findAll();

    const result = prepareSuccess200(finds);
    res.json(result);
  };

  findMany = async (req, res, usernameToFilter) => {
    const userInformed = await user.findOne({
      where: {
        username: usernameToFilter
      }
    });

    if (!userInformed) {
      throwRefuse401(
        res,
        `Não foi encontrado Usuário com o nome "${usernameToFilter}".`
      );
      return;
    }

    const finds = await transaction.findAll({
      where: {
        id_user: userInformed.id
      }
    });

    const result = prepareSuccess200(finds);
    res.json(result);
  };

  findOne = async (req, res) => {
    const query = req.query.guid;
    const params = req.params.guid;

    const find = await transaction.findOne({
      where: {
        guid: query || params
      }
    });

    const result = prepareSuccess200(find);
    res.json(result);
  };

  create = async (req, res) => {
    let {
      service_id,
      id_user,
      external_sale_id,
      value,
      description,
      str_code_payment,
      card_number,
      owner_name_card,
      dueDate_card,
      cvv_card
    } = req.body;

    //TO-DO
    // Verificar no mongoDB se service_id já foi chamado

    const guid = uuidv4();
    card_number = await authService.decodeBase64(card_number);
    dueDate_card = await authService.decodeBase64(dueDate_card);
    cvv_card = await authService.decodeBase64(cvv_card);
    owner_name_card = await authService.decodeBase64(owner_name_card);

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

    const cardAuthorization = await cardAuthorizer.authorize(
      service_id,
      value,
      description,
      str_code_payment === "debit_card" ? "debit" : "credit",
      card_number,
      owner_name_card,
      dueDate_card,
      cvv_card
    );

    const newTransaction = await transaction.create({
      guid: guid,
      service_id: service_id,
      id_user: id_user,
      external_sale_id: external_sale_id,
      value: value,
      description: description,
      id_payment: payment.id,
      sufix_card_number: card_number.substr(card_number.length - 4),
      owner_name_card: owner_name_card,
      dueDate_card: dueDate_card,
      cvv_card: cvv_card
    });

    let resPayable = await controllerPayable.create({
      id_transaction: newTransaction.id,
      id_payment: payment.id,
      gross_value: value
    });
    resPayable = resPayable.data;

    const data = {
      nsu: cardAuthorization.nsu,
      aut: cardAuthorization.aut,
      transactionGuid: guid,
      payableGuid: resPayable.guid,
      date_to_refund_transaction: resPayable.date_to_refund_transaction,
      status_refund: resPayable.status,
      fee_percent: resPayable.fee_percent,
      fee_value: resPayable.fee_value,
      net_value: resPayable.net_Value
    };

    const result = prepareSuccess200(data);
    res.json(result);
  };
}

export default new ControllerTransaction();
