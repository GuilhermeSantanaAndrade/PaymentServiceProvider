import ambient from "../models/Ambient";
import { prepareSuccess200, throwRefuse401 } from "../utils/responses_struct";

class ControllerAmbient {
  findAll = async (req, res) => {
    const finds = await ambient.findAll();

    const result = prepareSuccess200(finds);
    res.json(result);
  };

  findOne = async (req, res) => {
    const query = req.query.id;
    const params = req.params.id;

    const find = await ambient.findOne({
      where: {
        id: query || params
      }
    });

    const result = prepareSuccess200(find);
    res.json(result);
  };

  create = async (req, res) => {
    const { name } = req.body;
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
      name: name
    });

    const result = prepareSuccess200(inserted);

    res.json(result);
  };
}

export default new ControllerAmbient();
