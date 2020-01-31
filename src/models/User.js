import { Model, DataTypes } from "sequelize";

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        username: DataTypes.STRING,
        encrypted_psw: DataTypes.STRING,
        user_admin: DataTypes.BOOLEAN
      },
      {
        sequelize
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Ambient, { foreignKey: id_ambient, as: "ambient" });
  }
}

export default User;
