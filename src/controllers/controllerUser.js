import user from "../models/User";
import { prepareSuccess } from "../utils/responses_struct";
import md5 from "md5";
import authService from "../services/auth-service";

class ControllerUser {
  findAll = async (req, res) => {
    const finds = await user.findAll();

    const result = prepareSuccess(finds);
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

    const result = prepareSuccess(find);
    res.json(result);
  };

  create = async (req, res) => {
    const { username, password, user_admin, ambient_name } = req.body;

    let find = await user.findAll({
      where: {
        username: username
      }
    });

    if (find.length) {
      res.status(400).json({
        status: 400,
        message: "Usuário já existe."
      });
      return;
    }

    const inserted = await user.create({
      username: username,
      encrypted_psw: password,
      user_admin: user_admin,
      ambient_name: ambient_name
    });

    const result = prepareSuccess(inserted);

    res.json(result);
  };

  authenticate = async (req, res) => {
    const { username, password } = req.body;
    const find = await user.findOne({
      where: {
        username: username,
        encrypted_psw: password //md5(password + global.SALT_KEY)
      }
    });

    if (!find || find.length) {
      res.status(400).json({
        status: 401,
        message: "Usuário ou Senha inválidos."
      });
      return;
    }

    const token = await authService.generateToken({
      username: username,
      user_admin: find.user_admin
    });

    const result = prepareSuccess({
      token: token,
      username: username
    });

    res.json(result);
  };
}

export default new ControllerUser();
