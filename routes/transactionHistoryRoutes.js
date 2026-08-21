import express from "express";

import { fetchTransactionHistory } from "../controllers/transactionHistoryController.js";

const router = express.Router();

router.post("/list", fetchTransactionHistory);

export default router;
