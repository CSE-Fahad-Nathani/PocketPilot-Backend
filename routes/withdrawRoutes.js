import express from "express";

import {
    withdrawFromBucket,
} from "../controllers/withdrawController.js";

const router = express.Router();

router.post("/", withdrawFromBucket);

export default router;