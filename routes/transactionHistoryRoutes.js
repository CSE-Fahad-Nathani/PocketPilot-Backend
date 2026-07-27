import express from "express";

import {
    fetchTransactionHistory,
} from "../controllers/transactionHistoryController.js";

const router = express.Router();

router.get(
    "/",
    fetchTransactionHistory
);

export default router;