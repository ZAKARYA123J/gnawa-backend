import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import {
  getArtists,
  getArtistById,
  createArtist,
  updateArtist,
  deleteArtist,
} from "../controllers/artistController.ts";

const router = Router();

router.get("/", getArtists);
router.get("/:id", authMiddleware, getArtistById);
router.post("/", authMiddleware, createArtist);
router.patch("/:id", authMiddleware, updateArtist);
router.delete("/:id", authMiddleware, deleteArtist);

export default router;
