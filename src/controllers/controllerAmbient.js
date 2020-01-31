import Ambient from "../models/Ambient";
import { prepareSuccess } from "../utils/responses_struct";

class ControllerAmbient {
  findAll = async (req, res) => {
    const finds = await Ambient.findAll();

    const result = response_struct;
    result.data = finds;
    res.json(result);
  };

  create = async (req, res) => {
    const { name } = req.body;
    let find = await Ambient.findAll({
      where: {
        name: name
      }
    });

    let inserted = undefined;
    if (!find.length) {
      inserted = await Ambient.create({
        name: name
      });
      find = undefined;
    }

    const result = prepareSuccess(find || inserted);

    res.json(result);
  };
}

export default new ControllerAmbient();
