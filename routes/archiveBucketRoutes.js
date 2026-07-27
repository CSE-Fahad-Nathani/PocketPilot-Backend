import express from "express";

import {
    archiveBucket,
} from "../controllers/archiveBucketController.js";

const router = express.Router();

router.patch("/:id", archiveBucket);

export default router;