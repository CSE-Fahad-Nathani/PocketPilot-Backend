import express from "express";

import {
  distributeSaving,
  getPendingSavings,
} from "../controllers/savingAllocationController.js";

const router = express.Router();

router.post("/distribute", distributeSaving);
router.post("/pending", getPendingSavings);

export default router;
