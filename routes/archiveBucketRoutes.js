import express from "express";

import { archiveBucket } from "../controllers/archiveBucketController.js";

const router = express.Router();

router.post("/", archiveBucket);

export default router;
