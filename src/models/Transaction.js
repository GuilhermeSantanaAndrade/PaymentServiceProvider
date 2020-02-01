import { Model, DataTypes } from "sequelize";

class transaction extends Model {
  static init(sequelize) {
    super.init(
      {
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        guid: DataTypes.STRING(60),
        service_id: DataTypes.INTEGER,
        id_user: DataTypes.INTEGER,
        external_sale_id: DataTypes.STRING(30),
        value: DataTypes.DOUBLE,
        description: DataTypes.STRING(100),
        id_payment: DataTypes.INTEGER,
        sufix_card_number: DataTypes.STRING(4),
        dueDate_card: DataTypes.STRING(5),
        cvv_card: DataTypes.STRING(3)
      },
      {
        sequelize
      }
    );
  }
}

export default transaction;
