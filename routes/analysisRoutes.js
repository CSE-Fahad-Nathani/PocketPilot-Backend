import express from "express";
import {
  getCycleAnalysis,
  getCurrentMonthFuelAnalysis,
} from "../controllers/analysisController.js";

const router = express.Router();

router.post("/cycles", getCycleAnalysis);
router.post("/fuel/current-month", getCurrentMonthFuelAnalysis);

export default router;
