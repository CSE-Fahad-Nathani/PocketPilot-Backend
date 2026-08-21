import express from "express";

import { fetchBucketHistory } from "../controllers/bucketHistoryController.js";

const router = express.Router();

router.post("/history", fetchBucketHistory);

export default router;
