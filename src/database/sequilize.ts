import {Sequelize} from "sequelize"
import { env } from "../../configue.ts"
const sequelize =new Sequelize(
    env.DATABASE_NAME,
    'ocean_dev1',
    env.DATABASE_PASSWORD,
     {
    host: "127.0.0.1",
    dialect: "postgres",
    logging: true,
  }
)
export default sequelize