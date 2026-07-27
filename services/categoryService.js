import pool from "../db.js";
import { recalculateCycleTotals } from "./cycleTotalsService.js";

import {
  CREATE_CATEGORY,
  GET_CATEGORIES,
  UPDATE_CATEGORY,
  ARCHIVE_CATEGORY,
  GET_CATEGORY_BY_ID,
  CHECK_CATEGORY_EXISTS,
  CHECK_CATEGORY_EXISTS_FOR_UPDATE,
} from "../sql/categoryQueries.js";

export const createCategory = async (
  cycleId,
  name,
  type,
  budget,
  icon,
  color
) => {
  // Check duplicate category name within the same cycle
  const existingCategory = await pool.query(CHECK_CATEGORY_EXISTS, [
    cycleId,
    name,
  ]);

  if (existingCategory.rows.length > 0) {
    const error = new Error("Category already exists.");
    error.statusCode = 400;
    throw error;
  }

  const result = await pool.query(CREATE_CATEGORY, [
    cycleId,
    name.trim(),
    type,
    budget,
    icon,
    color,
  ]);
  
  await recalculateCycleTotals(cycleId);
  
  return result.rows[0];
};

export const getCategories = async (cycleId) => {
  const result = await pool.query(GET_CATEGORIES, [cycleId]);

  return result.rows;
};

export const updateCategory = async (
  id,
  name,
  type,
  budget,
  icon,
  color
) => {
  const category = await pool.query(GET_CATEGORY_BY_ID, [id]);

  if (category.rows.length === 0) {
    const error = new Error("Category not found.");
    error.statusCode = 404;
    throw error;
  }

  const duplicate = await pool.query(CHECK_CATEGORY_EXISTS_FOR_UPDATE, [
    category.rows[0].cycle_id,
    name,
    id,
  ]);

  if (duplicate.rows.length > 0) {
    const error = new Error("Category already exists.");
    error.statusCode = 400;
    throw error;
  }

  const result = await pool.query(UPDATE_CATEGORY, [
    id,
    name.trim(),
    type,
    budget,
    icon,
    color,
  ]);
  
  await recalculateCycleTotals(category.rows[0].cycle_id);
  
  return result.rows[0];
};

export const archiveCategory = async (id) => {
  const category = await pool.query(GET_CATEGORY_BY_ID, [id]);

  if (category.rows.length === 0) {
    const error = new Error("Category not found.");
    error.statusCode = 404;
    throw error;
  }

  const result = await pool.query(ARCHIVE_CATEGORY, [id]);

await recalculateCycleTotals(category.rows[0].cycle_id);

return result.rows[0];
};


export const getCategoryById = async (id) => {
  const result = await pool.query(GET_CATEGORY_BY_ID, [id]);

  if (result.rows.length === 0) {
    const error = new Error("Category not found.");
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};