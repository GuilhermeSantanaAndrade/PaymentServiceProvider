import user from "../models/User";
import ambient from "../models/Ambient";
import { prepareSuccess200, throwRefuse401 } from "../utils/responses_struct";
import md5 from "md5";
import authService from "../services/auth-service";

class ControllerUser {
  findAll = async (req, res) => {
    const finds = await user.findAll();

    const result = prepareSuccess200(finds);
    res.json(result);
  };

  findOne = async (req, res) => {
    const query = req.query.id;
    const params = req.params.id;

    const find = await user.findOne({
      where: {
        id: query || params
      }
    });

    const result = prepareSuccess200(find);
    res.json(result);
  };

  create = async (req, res) => {
    let { username, key, user_admin, ambient_name } = req.body;

    let find = await user.findAll({
      where: {
        username: username
      }
    });

    if (find.length) {
      throwRefuse401(res, "Usuário já existe.");
      return;
    }

    key = await authService.decodeBase64(key);

    const find_amb = await ambient.findOne({
      where: { name: ambient_name || "" }
    });

    if (!find_amb) {
      throwRefuse401(res, `Nome de ambiente "${ambient_name}" inválido.`);
      return;
    }

    let inserted = await user.create({
      username: username,
      encrypted_psw: md5(key + global.SALT_KEY),
      user_admin: user_admin || false,
      id_ambient: find_amb.id
    });

    inserted.encrypted_psw = undefined;
    const result = prepareSuccess200(inserted);

    res.json(result);
  };

  authenticate = async (req, res) => {
    let { username, key } = req.body;

    key = await authService.decodeBase64(key);

    const find = await user.findOne({
      where: {
        username: username,
        encrypted_psw: md5(key + global.SALT_KEY)
      }
    });

    if (!find || find.length) {
      throwRefuse401(res, "Usuário ou Senha inválidos.");
      return;
    }

    const token = await authService.generateToken({
      username: username,
      user_admin: find.user_admin
    });

    const result = prepareSuccess200({
      token: token,
      username: username
    });

    res.json(result);
  };
}

export default new ControllerUser();
