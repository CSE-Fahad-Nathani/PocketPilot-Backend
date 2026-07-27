import express from "express";
import { getCycleAnalysis } from "../controllers/analysisController.js";

const router = express.Router();

router.get("/cycles/:cycleId", getCycleAnalysis);

export default router;