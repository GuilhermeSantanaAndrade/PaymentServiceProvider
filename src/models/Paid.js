import { Model, DataTypes } from "sequelize";

class paid extends Model {
  static init(sequelize) {
    super.init(
      {
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        guid: DataTypes.STRING(60),
        id_payable: DataTypes.INTEGER,
        paid_data: DataTypes.DATE,
        paid_value: DataTypes.DOUBLE
      },
      {
        sequelize
      }
    );
  }
}

export default paid;
