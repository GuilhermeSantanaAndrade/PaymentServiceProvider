import { Model, DataTypes } from "sequelize";

class user extends Model {
  static init(sequelize) {
    super.init(
      {
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        username: DataTypes.STRING,
        encrypted_psw: DataTypes.STRING,
        user_admin: DataTypes.BOOLEAN,
        id_ambient: DataTypes.INTEGER
      },
      {
        sequelize
      }
    );
  }
}

export default user;
