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
router.post("/list", getAllSavings);
router.post("/get", getSavingById);
router.post("/update", updateSaving);
router.post("/delete", deleteSaving);

export default router;
