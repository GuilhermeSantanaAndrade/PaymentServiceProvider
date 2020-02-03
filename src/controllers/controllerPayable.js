import transaction from "../models/Transaction";
import payable from "../models/Payable";
import controllerPaid from "../controllers/controllerPaid";
import user from "../models/User";
import payment_type from "../models/PaymentType";
import { prepareSuccess200, throwRefuse401 } from "../utils/responses_struct";
import uuidv4 from "uuid/v4";
import controllerPaid from "./controllerPaid";
import moment from "moment";
import Sequelize from "sequelize";

class ControllerPayable {
  findAll = async (req, res) => {
    const finds = await payable.findAll();

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

    const finds = await global.dbConnection.query(
      `SELECT 
      "payable".*
     FROM "payables" AS "payable" 
     INNER JOIN "transactions" as "transaction" ON "transaction"."id" = "payable"."id_transaction"
     WHERE "transaction"."id_user" = ${userInformed.id}`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const result = prepareSuccess200(finds);
    res.json(result);
  };

  findAvaible_x_waiting = async (req, res, usernameToFilter) => {
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

    const finds = await global.dbConnection.query(
      `SELECT 
      "payable"."id", 
      "payable"."status", 
      "payable"."net_value"
     FROM "payables" AS "payable" 
     INNER JOIN "transactions" as "transaction" ON "transaction"."id" = "payable"."id_transaction"
     WHERE "transaction"."id_user" = ${userInformed.id}`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const paids = finds
      .filter(
        item =>
          item.status === global.PAID || item.status === global.PAID_ANTECIPATE
      )
      .reduce((sum, item) => sum + item.net_value, 0);
    const waiting_funds = finds
      .filter(item => item.status === global.WAITING_FUNDS)
      .reduce((sum, item) => sum + item.net_value, 0);

    const result = prepareSuccess200({
      avaible: paids,
      waiting_funds: waiting_funds
    });
    res.json(result);
  };

  findOne = async (req, res) => {
    const query = req.query.guid;
    const params = req.params.guid;

    const find = await payable.findOne({
      where: {
        guid: query || params
      }
    });

    const result = prepareSuccess200(find);
    res.json(result);
  };

  handleCreate = async (req, res) => {
    let { id_transaction, id_payment, gross_value } = req.body;
    const result = await this.create({
      id_transaction,
      id_payment,
      gross_value
    });

    res.json(result);
  };

  create = async ({ id_transaction, id_payment, gross_value }) => {
    const guid = uuidv4();

    const payment = await payment_type.findOne({
      where: {
        id: id_payment
      }
    });

    if (!payment) {
      throwRefuse401(
        res,
        `Não foi encontrado Tipo de Pagamento com id "${id_payment}".`
      );
      return;
    }

    const transac = await transaction.findOne({
      where: {
        id: id_transaction
      }
    });

    if (!transac) {
      throwRefuse401(
        res,
        `Não foi encontrado transação com id "${id_transaction}".`
      );
      return;
    }

    const today = moment

      .tz(new Date().setHours(0, 0, 0, 0), "America/Sao_Paulo")
      .format("YYYY/MM/DD HH:mm:mm");
    const dateToRefundTransaction = moment
      .tz(new Date().setHours(0, 0, 0, 0), "America/Sao_Paulo")
      .add(payment.days_refund, "days")
      .format("YYYY/MM/DD HH:mm:mm");

    const fee_value = (payment.fee / 100) * gross_value;

    const newPayable = await payable.create({
      guid: guid,
      id_transaction: id_transaction,
      date_to_refund_transaction: dateToRefundTransaction,
      status: global.WAITING_FUNDS,
      gross_value: gross_value,
      fee_percent: payment.fee,
      fee_value: fee_value,
      net_value: gross_value - fee_value
    });

    // checks the need to pay now
    const checkPayNeed = await controllerPaid.checkPayDate({
      id_payable: newPayable.id
    });

    if (checkPayNeed.action === global.NEED_TO_PAY) {
      const newPaid = await controllerPaid.create({
        id_payable: newPayable.id,
        paidDate: today,
        paid_value: newPayable.net_value
      });

      newPayable.status = newPaid.data.status;
    }

    const result = prepareSuccess200(newPayable);
    return result;
  };

  checkRefunds = async () => {
    const now = moment
      .tz(new Date(), "America/Sao_Paulo")
      .format("YYYY/MM/DD HH:mm:mm");

    const Op = Sequelize.Op;
    let refundsList = await payable.findAll({
      where: {
        status: global.WAITING_FUNDS,
        date_to_refund_transaction: {
          [Op.lte]: now
        }
      }
    });

    refundsList = refundsList.map(item => {
      return {
        id: item.id,
        date_to_refund_transaction: item.date_to_refund_transaction,
        value: item.net_value
      };
    });

    const result = prepareSuccess200(refundsList);
    return result;
  };

  antecipate = async (req, res) => {
    const guid = req.params.guid;
    const now = moment
      .tz(new Date(), "America/Sao_Paulo")
      .format("YYYY/MM/DD HH:mm:mm");

    let find = await global.dbConnection.query(
      `SELECT 
    "payable"."id", 
    "payable"."status", 
    "payable"."net_value",
    "ambient"."antecipate_fee"
   FROM "payables" AS "payable" 
   INNER JOIN "transactions" as "transaction" ON "transaction"."id" = "payable"."id_transaction"
   INNER JOIN "users" as "user" ON "user"."id" = "transaction"."id_user"
   INNER JOIN "ambients" as "ambient" ON "ambient"."id" = "user"."id_ambient"
   WHERE "payable"."guid" = '${guid}'
   `,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!find.length) {
      throwRefuse401(res, `Não foi encontrado Pagável com guid "${guid}".`);
      return;
    }

    find = find[0];

    if (find.status !== global.WAITING_FUNDS) {
      throwRefuse401(
        res,
        `Pagável não encontra-se disponível para antecipação.`
      );
      return;
    }

    const beforeValue = find.net_value;
    const feeValue = (find.antecipate_fee / 100) * beforeValue;
    const refundNetValue = beforeValue - feeValue;

    const newPaid = await controllerPaid.create({
      id_payable: find.id,
      paidDate: now,
      paid_value: refundNetValue,
      antecipate: true
    });

    find.status = global.PAID_ANTECIPATE;

    const result = prepareSuccess200({
      paid_guid: newPaid.data.guid,
      status: find.status,
      paid_date: newPaid.data.paid_date,
      before_value: beforeValue,
      discounted_value: feeValue,
      refunded_value: refundNetValue
    });
    res.json(result);
  };
}

export default new ControllerPayable();
