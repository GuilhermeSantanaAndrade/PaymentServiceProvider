import { Model, DataTypes } from "sequelize";

class service_request extends Model {
  static init(sequelize) {
    super.init(
      {
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        informed_service_id: DataTypes.STRING(10)
      },
      {
        sequelize
      }
    );
  }
}

export default service_request;
