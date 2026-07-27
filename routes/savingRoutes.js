import express from "express";
import {
  createSaving,
  getAllSavings,
  getSavingById,
  updateSaving,
  deleteSaving,
} from "../controllers/savingController.js";

const router = express.Router();

router.post("/create", createSaving);

router.get("/", getAllSavings);
router.get("/:id", getSavingById);

router.put("/:id", updateSaving);

router.delete("/:id", deleteSaving);

export default router;