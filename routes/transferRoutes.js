import express from "express";

import {
    transferBetweenBuckets,
} from "../controllers/transferController.js";

const router = express.Router();

router.post("/", transferBetweenBuckets);

export default router;