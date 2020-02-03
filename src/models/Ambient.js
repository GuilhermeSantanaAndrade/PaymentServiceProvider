import { Model, DataTypes } from "sequelize";

class ambient extends Model {
  static init(sequelize) {
    super.init(
      {
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        name: DataTypes.STRING(255),
        antecipate_fee: DataTypes.DOUBLE
      },
      {
        sequelize
      }
    );
  }
}

export default ambient;
