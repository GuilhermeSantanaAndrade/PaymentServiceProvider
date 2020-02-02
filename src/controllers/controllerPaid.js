import paid from "../models/Paid";
import payable from "../models/Payable";
import { prepareSuccess200, throwRefuse401 } from "../utils/responses_struct";
import uuidv4 from "uuid/v4";
import authService from "../services/auth-service";

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
      id_payable,
      paid_date,
      paid_value
    });

    res.json(result);
  };

  create = async ({ id_payable, paid_date, paid_value }) => {
    const guid = uuidv4();
  };

  checkPayDate = async ({ id_payable, paid_date, paid_value }) => {
    const findPayable = await payable.findOne({
      where: {
        id: id_payable
      }
    });

    if (!findPayable) {
      throwRefuse401(res, `Não foi encontrado Pagável com id "${id_payable}".`);
      return;
    }

    const today = new Date().setHours(0, 0, 0, 0);
    const dateToRefundTransaction = new Date(
      findPayable.date_to_refund_transaction
    );

    console.log(dateToRefundTransaction);
    console.log(new Date(dateToRefundTransaction).toString());

    let action = "";
    if (findPayable.status === global.PAID) {
      action = global.PAID;
    } else if (findPayable.status === global.WAITING_FUNDS) {
      if (today >= dateToRefundTransaction) {
        action = global.NEED_TO_REFUND;
      } else {
        action = global.NEED_TO_WAIT_MORE;
      }
    } else {
      throw `Status de Pagável inválido "${findPayable.status}"`;
    }

    return {
      action: action,
      dateToRefundTransaction: dateToRefundTransaction
    };
  };
}

export default new ControllerPaid();
