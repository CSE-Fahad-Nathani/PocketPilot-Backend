import express from "express";

import {
  createCategory,
  getCategories,
  updateCategory,
  archiveCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/create", createCategory);

router.get("/", getCategories);

router.post("/update", updateCategory);

router.post("/archive", archiveCategory);

export default router;