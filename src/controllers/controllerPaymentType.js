import payment_type from "../models/PaymentType";
import { prepareSuccess200 } from "../utils/responses_struct";

class ControllerPaymentType {
  findAll = async (req, res) => {
    const finds = await payment_type.findAll();

    const result = prepareSuccess200(finds);
    res.json(result);
  };

  findOne = async (req, res) => {
    const query = req.query.id;
    const params = req.params.id;

    const find = await payment_type.findOne({
      where: {
        id: query || params
      }
    });

    const result = prepareSuccess200(find);
    res.json(result);
  };

  create = async (req, res) => {
    const { description, str_code, days_refund, fee } = req.body;

    let find = await payment_type.findOne({
      where: {
        str_code: str_code
      }
    });

    if (find) {
      throwRefuse401(
        res,
        `Já existe um Tipo de Pagamento para o str_code informado "${str_code}".`
      );
      return;
    }

    const inserted = await payment_type.create({
      description: description,
      str_code: str_code,
      days_refund: days_refund,
      fee: fee
    });

    const result = prepareSuccess200(inserted);

    res.json(result);
  };
}

export default new ControllerPaymentType();
