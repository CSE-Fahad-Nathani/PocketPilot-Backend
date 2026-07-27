import express from "express";

import {
  createTransfer,
  getTransfers,
  getTransferById,
  updateTransfer,
  deleteTransfer,
} from "../controllers/categoryTransferController.js";

const router = express.Router();

router.post("/create", createTransfer);

router.get("/", getTransfers);

router.get("/:id", getTransferById);

router.post("/update", updateTransfer);

router.post("/delete", deleteTransfer);

export default router;