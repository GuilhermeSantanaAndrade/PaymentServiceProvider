import paid from "../models/Paid";
import payable from "../models/Payable";
import { prepareSuccess200, throwRefuse401 } from "../utils/responses_struct";
import uuidv4 from "uuid/v4";
import moment from "moment";

class ControllerPaid {
  findAll = async (req, res) => {
    const finds = await paid.findAll();

    const result = prepareSuccess200(finds);
    res.json(result);
  };

  findOne = async (req, res) => {
    const query = req.query.guid;
    const params = req.params.guid;

    const find = await paid.findOne({
      where: {
        guid: query || params
      }
    });

    const result = prepareSuccess200(find);
    res.json(result);
  };

  handleCreate = async (req, res) => {
    let { id_payable, paid_date, paid_value } = req.body;
    const result = await this.create({
      id_payable: id_payable,
      paid_date: paid_date,
      paid_value: paid_value,
      atencipate: false
    });

    res.json(result);
  };

  create = async ({ id_payable, paidDate, paid_value, antecipate = false }) => {
    const guid = uuidv4();
    const findPayable = await payable.findOne({
      where: {
        id: id_payable
      }
    });

    if (!findPayable) {
      throwRefuse401(res, `Não foi encontrado Pagável com id "${id_payable}".`);
      return;
    }

    if (!paidDate)
      paidDate = moment
        .tz(new Date(), "America/Sao_Paulo")
        .format("YYYY/MM/DD HH:mm:ss");

    const date = moment(paidDate).format("YYYY-MM-DD HH:mm:ss");
    const newPaid = await paid.create({
      guid: guid,
      id_payable: id_payable,
      paid_date: date,
      paid_value: paid_value
    });

    const status = antecipate ? global.PAID_ANTECIPATE : global.PAID;
    newPaid.status = status;
    await payable.update(
      {
        status: status
      },
      {
        where: {
          id: findPayable.id
        }
      }
    );

    const result = prepareSuccess200(newPaid);
    return result;
  };

  checkPayDate = async ({ id_payable }) => {
    const findPayable = await payable.findOne({
      where: {
        id: id_payable
      }
    });

    if (!findPayable) {
      throwRefuse401(res, `Não foi encontrado Pagável com id "${id_payable}".`);
      return;
    }

    const today = moment
      .tz(new Date().setHours(0, 0, 0, 0), "America/Sao_Paulo")
      .valueOf();
    const dateToRefundTransaction = moment
      .tz(findPayable.date_to_refund_transaction, "America/Sao_Paulo")
      .valueOf();

    let action = "";
    if (findPayable.status === global.PAID) {
      action = global.PAID;
    } else if (findPayable.status === global.WAITING_FUNDS) {
      if (today >= dateToRefundTransaction) {
        action = global.NEED_TO_PAY;
      } else {
        action = global.NEED_TO_WAIT_MORE;
      }
    } else {
      throw `Status de Pagável inválido "${findPayable.status}"`;
    }

    return {
      action: action,
      dateToRefundTransaction: moment(dateToRefundTransaction).format(
        "YYYY-MM-DD"
      )
    };
  };
}

export default new ControllerPaid();
