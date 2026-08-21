import express from "express";

import {
  createSavingBucket,
  getSavingBuckets,
} from "../controllers/savingBucketController.js";

const router = express.Router();

router.post("/create", createSavingBucket);
router.post("/list", getSavingBuckets);

export default router;
