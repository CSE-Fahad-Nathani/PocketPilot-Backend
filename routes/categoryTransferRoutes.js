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

router.post("/list", getTransfers);

router.post("/get", getTransferById);

router.post("/update", updateTransfer);

router.post("/delete", deleteTransfer);

export default router;
