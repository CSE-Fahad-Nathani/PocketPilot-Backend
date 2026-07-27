import express from "express";

import {
    fetchBucketHistory,
} from "../controllers/bucketHistoryController.js";

const router = express.Router();

router.get(
    "/:id/history",
    fetchBucketHistory
);

export default router;