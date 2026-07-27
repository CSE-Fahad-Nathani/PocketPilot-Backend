import express from "express";

import {
  createIncome,
  getIncome,
  updateIncome,
  deleteIncome,
} from "../controllers/incomeController.js";

const router = express.Router();

router.post("/create", createIncome);

router.get("/", getIncome);

router.post("/update", updateIncome);

router.post("/delete", deleteIncome);

export default router;