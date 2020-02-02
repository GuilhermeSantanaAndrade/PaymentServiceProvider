import transaction from "../models/Transaction";
import payable from "../models/Payable";
import payment_type from "../models/PaymentType";
import { prepareSuccess200, throwRefuse401 } from "../utils/responses_struct";
import uuidv4 from "uuid/v4";
import controllerPaid from "./controllerPaid";
import moment from "moment";

class ControllerPayable {
  findAll = async (req, res) => {
    const finds = await payable.findAll();

    const result = prepareSuccess200(finds);
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
}

export default new ControllerPayable();
