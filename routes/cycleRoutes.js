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
router.get("/active", getActiveCycle);
router.get("/history", getCycleHistory);
router.get("/:cycleId/tracked-balance", getTrackedBalanceSettings);
router.put("/:cycleId/tracked-balance", saveTrackedBalanceSettings);


router.post("/verify-end", verifyEndCycle);
router.post("/end", endCycle);

export default router;