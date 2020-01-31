import { Model, DataTypes } from "sequelize";

class ambient extends Model {
  static init(sequelize) {
    super.init(
      {
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        name: DataTypes.STRING
      },
      {
        sequelize
      }
    );
  }
}

export default ambient;
