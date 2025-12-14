// @deno-types="npm:@types/express"
import { Router } from "express";
import {
  getEvents,
  createEvent,
  deleteEvent,
} from "../controllers/eventController.ts";
import { authMiddleware } from "../middlewares/auth.middleware.ts";

const router = Router();

router.get("/", getEvents);
router.post("/create", authMiddleware, createEvent);
router.delete("/delete/:id", authMiddleware, deleteEvent);

export default router;
