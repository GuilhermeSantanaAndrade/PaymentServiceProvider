import { Model, DataTypes } from "sequelize";

class payable extends Model {
  static init(sequelize) {
    super.init(
      {
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        guid: DataTypes.STRING(60),
        id_transaction: DataTypes.INTEGER,
        date_to_refund_transaction: DataTypes.DATEONLY,
        status: DataTypes.STRING(10),
        gross_value: DataTypes.DOUBLE,
        fee_percent: DataTypes.DOUBLE,
        fee_value: DataTypes.DOUBLE,
        net_value: DataTypes.DOUBLE
      },
      {
        sequelize
      }
    );
  }
}

export default payable;
