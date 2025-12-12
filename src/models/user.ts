import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database/sequilize.ts";

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
}
interface IUserCreationAttributes extends Optional<IUser, "id"> {}
export class User extends Model<IUser, IUserCreationAttributes> implements IUser {  declare id: string;
  declare name: string;
  declare email: string;
  declare password: string;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "users",
    modelName: "User",
  }
);