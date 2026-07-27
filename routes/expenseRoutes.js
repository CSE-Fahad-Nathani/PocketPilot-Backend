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

router.get("/", getExpenses);

router.get("/:id", getExpenseById);

router.post("/update", updateExpense);

router.post("/delete", deleteExpense);

export default router;