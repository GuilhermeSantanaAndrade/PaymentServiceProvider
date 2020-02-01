import ambient from "../models/Ambient";
import { prepareSuccess } from "../utils/responses_struct";

class ControllerAmbient {
  findAll = async (req, res) => {
    const finds = await ambient.findAll();

    const result = prepareSuccess(finds);
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

    const result = prepareSuccess(find);
    res.json(result);
  };

  create = async (req, res) => {
    const { name } = req.body;
    let find = await ambient.findAll({
      where: {
        name: name
      }
    });

    let inserted = undefined;
    if (!find.length) {
      inserted = await ambient.create({
        name: name
      });
      find = undefined;
    }

    const result = prepareSuccess(find || inserted);

    res.json(result);
  };
}

export default new ControllerAmbient();
