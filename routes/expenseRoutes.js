import express from "express";

import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getExpenseById,
} from "../controllers/expenseController.js";

const router = express.Router();

router.post("/create", createExpense);

router.post("/list", getExpenses);

router.post("/get", getExpenseById);

router.post("/update", updateExpense);

router.post("/delete", deleteExpense);

export default router;
