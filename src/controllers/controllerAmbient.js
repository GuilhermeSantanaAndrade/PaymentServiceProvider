import ambient from "../models/Ambient";
import { prepareSuccess200, throwRefuse401 } from "../utils/responses_struct";

class ControllerAmbient {
  findAll = async (req, res) => {
    const finds = await ambient.findAll();

    const result = prepareSuccess200(finds);
    res.json(result);
  };

  findOne = async (req, res) => {
    const id = req.params.id;

    const find = await ambient.findOne({
      where: {
        id: id
      }
    });

    const result = prepareSuccess200(find);
    res.json(result);
  };

  create = async (req, res) => {
    const { name, antecipate_fee } = req.body;
    let find = await ambient.findOne({
      where: {
        name: name
      }
    });

    if (find) {
      throwRefuse401(res, `Já existe um ambiente com o nome "${name}".`);
      return;
    }

    const inserted = await ambient.create({
      name: name,
      antecipate_fee: antecipate_fee
    });

    const result = prepareSuccess200(inserted);

    res.json(result);
  };
}

export default new ControllerAmbient();
