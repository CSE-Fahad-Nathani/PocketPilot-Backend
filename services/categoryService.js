import pool from "../db.js";
import { recalculateCycleTotals } from "./cycleTotalsService.js";

import {
  CREATE_CATEGORY,
  CREATE_CATEGORY_WITH_SORT,
  GET_CATEGORIES,
  GET_CATEGORIES_BY_IDS,
  UPDATE_CATEGORY,
  ARCHIVE_CATEGORY,
  GET_CATEGORY_BY_ID,
  CHECK_CATEGORY_EXISTS,
  CHECK_CATEGORY_EXISTS_FOR_UPDATE,
} from "../sql/categoryQueries.js";
import { GET_CYCLE_BY_ID } from "../sql/trackedBalanceQueries.js";

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

export const importCategoriesFromCycle = async (
  targetCycleId,
  sourceCycleId,
  categoryIds
) => {
  if (Number(targetCycleId) === Number(sourceCycleId)) {
    const error = new Error("Source and target cycles must be different.");
    error.statusCode = 400;
    throw error;
  }

  const [targetCycle, sourceCycle] = await Promise.all([
    pool.query(GET_CYCLE_BY_ID, [targetCycleId]),
    pool.query(GET_CYCLE_BY_ID, [sourceCycleId]),
  ]);

  if (!targetCycle.rows.length) {
    const error = new Error("Target cycle not found.");
    error.statusCode = 404;
    throw error;
  }

  if (!sourceCycle.rows.length) {
    const error = new Error("Source cycle not found.");
    error.statusCode = 404;
    throw error;
  }

  const normalizedIds = Array.from(
    new Set(
      (categoryIds || [])
        .map((id) => Number(id))
        .filter((id) => Number.isInteger(id) && id > 0)
    )
  );

  if (!normalizedIds.length) {
    const error = new Error("Select at least one budget to import.");
    error.statusCode = 400;
    throw error;
  }

  const sourceResult = await pool.query(GET_CATEGORIES_BY_IDS, [
    sourceCycleId,
    normalizedIds,
  ]);

  if (!sourceResult.rows.length) {
    const error = new Error("No matching budgets found in the previous cycle.");
    error.statusCode = 404;
    throw error;
  }

  const existing = await pool.query(GET_CATEGORIES, [targetCycleId]);
  const existingNames = new Set(
    existing.rows.map((row) => String(row.name).toLowerCase())
  );

  const created = [];
  let skipped = 0;

  for (const category of sourceResult.rows) {
    const nameKey = String(category.name).toLowerCase();

    if (existingNames.has(nameKey)) {
      skipped += 1;
      continue;
    }

    const result = await pool.query(CREATE_CATEGORY_WITH_SORT, [
      targetCycleId,
      category.name,
      category.type,
      category.budget,
      category.icon || "",
      category.color || "",
      category.sort_order || 0,
    ]);

    existingNames.add(nameKey);
    created.push(result.rows[0]);
  }

  if (created.length) {
    await recalculateCycleTotals(targetCycleId);
  }

  if (!created.length) {
    const error = new Error(
      skipped
        ? "All selected budgets already exist in this cycle."
        : "No budgets were imported."
    );
    error.statusCode = 400;
    throw error;
  }

  return {
    imported: created,
    importedCount: created.length,
    skippedCount: skipped,
  };
};