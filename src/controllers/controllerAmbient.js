import ambient from "../models/Ambient";
import { prepareSuccess200 } from "../utils/responses_struct";

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

    const result = prepareSuccess200(find || inserted);

    res.json(result);
  };
}

export default new ControllerAmbient();
