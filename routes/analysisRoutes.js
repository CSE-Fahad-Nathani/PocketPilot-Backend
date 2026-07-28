import express from "express";
import { getCycleAnalysis, getCurrentMonthFuelAnalysis } from "../controllers/analysisController.js";

const router = express.Router();

router.get("/cycles/:cycleId", getCycleAnalysis);
router.get("/fuel/current-month", getCurrentMonthFuelAnalysis);

export default router;