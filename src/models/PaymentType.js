import { Model, DataTypes } from "sequelize";

class payment_type extends Model {
  static init(sequelize) {
    super.init(
      {
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        description: DataTypes.STRING(50),
        str_code: DataTypes.STRING(30),
        days_refund: DataTypes.INTEGER,
        fee: DataTypes.DOUBLE
      },
      {
        sequelize
      }
    );
  }
}

export default payment_type;
