import express from "express";
import {
  createCycle,
  getActiveCycle,
  getCycleHistory,
  verifyEndCycle,
  endCycle,
} from "../controllers/cycleController.js";
import {
  getTrackedBalanceSettings,
  saveTrackedBalanceSettings,
} from "../controllers/trackedBalanceController.js";

const router = express.Router();

router.post("/create", createCycle);
router.post("/active", getActiveCycle);
router.post("/history", getCycleHistory);
router.post("/tracked-balance", getTrackedBalanceSettings);
router.post("/tracked-balance/save", saveTrackedBalanceSettings);
router.post("/verify-end", verifyEndCycle);
router.post("/end", endCycle);

export default router;
