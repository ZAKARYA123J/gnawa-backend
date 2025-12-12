import sequelize from "../database/sequilize.ts";
import { User } from "./user.ts";
import { Admin } from "./Admin.ts";
import { Artist } from "./Artist.ts";
import { Booking } from "./Booking.ts";
import { Event } from "./Event.ts";
export const initDb=async()=>{
    Admin.initialize();
      Artist.initialize(sequelize);
  Event.initialize(sequelize);
  Booking.initialize(sequelize);
   const models = { Artist, Event, Booking };

  Artist.associate(models);
  Event.associate(models);
  Booking.associate(models);
  await sequelize.authenticate()
  await sequelize.sync({alter:true})
   console.log("Database connected");
}
export {User,Admin}