// @deno-types="npm:@types/express"
import express, { Request, Response, NextFunction } from "express";
// @deno-types="npm:@types/cors"
import cors from "cors";
import { env } from "./configue.ts";
import { initDb } from "./src/models/index.ts";
import authRoutes from "./src/routes/authRoutes.ts";
import eventRoutes from "./src/routes/eventRoutes.ts";
import artistRoutes from "./src/routes/artistRoutes.ts";

const app = express();

app.use(cors());
app.use(express.json());

await initDb();

app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use("/artists", artistRoutes);

app.listen(env.PORT, () => {
  console.log(`server running http://0.0.0.0:${env.PORT}`);
});