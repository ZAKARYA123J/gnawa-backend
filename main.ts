import express,{Request,Response,Next} from "express"
import { env } from "./configue.ts"
import { initDb } from "./src/models/index.ts"
const app = express()
 await initDb()
 app.use((req:Request, _res:Response, next:Next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.listen(env.PORT,()=>{
 
  console.log("server running http://0.0.0.0:3000")
})