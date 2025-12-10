import sequelize from "../database/sequilize.ts";
export const initDb=async()=>{
  await sequelize.authenticate()
   console.log("Database connected");
}