import pool from "../db.js";
import {
  GET_CYCLE_BY_ID,
  GET_CYCLE_CATEGORY_IDS,
  GET_TRACKED_BALANCE_SETTINGS,
  UPSERT_TRACKED_BALANCE_SETTINGS,
} from "../sql/trackedBalanceQueries.js";

const buildDefaultSettings = (cycleId, categoryIds) => ({
  cycleId,
  includeLeft: true,
  categoryIds,
  isDefault: true,
});

export const getTrackedBalanceSettings = async (cycleId) => {
  const cycleResult = await pool.query(GET_CYCLE_BY_ID, [cycleId]);

  if (!cycleResult.rows.length) {
    const error = new Error("Cycle not found.");
    error.statusCode = 404;
    throw error;
  }

  const categoryResult = await pool.query(GET_CYCLE_CATEGORY_IDS, [cycleId]);
  const allCategoryIds = categoryResult.rows.map((row) => row.id);

  const settingsResult = await pool.query(GET_TRACKED_BALANCE_SETTINGS, [
    cycleId,
  ]);

  if (!settingsResult.rows.length) {
    return buildDefaultSettings(Number(cycleId), allCategoryIds);
  }

  const saved = settingsResult.rows[0];
  const validCategoryIds = (saved.categoryIds || []).filter((id) =>
    allCategoryIds.includes(id)
  );

  return {
    cycleId: Number(saved.cycleId),
    includeLeft: Boolean(saved.includeLeft),
    categoryIds: validCategoryIds.length ? validCategoryIds : allCategoryIds,
    isDefault: false,
  };
};

export const saveTrackedBalanceSettings = async (
  cycleId,
  { includeLeft, categoryIds }
) => {
  const cycleResult = await pool.query(GET_CYCLE_BY_ID, [cycleId]);

  if (!cycleResult.rows.length) {
    const error = new Error("Cycle not found.");
    error.statusCode = 404;
    throw error;
  }

  const categoryResult = await pool.query(GET_CYCLE_CATEGORY_IDS, [cycleId]);
  const allCategoryIds = categoryResult.rows.map((row) => row.id);
  const normalizedIds = Array.from(
    new Set(
      (categoryIds || [])
        .map((id) => Number(id))
        .filter((id) => allCategoryIds.includes(id))
    )
  );

  if (!normalizedIds.length) {
    const error = new Error("Select at least one budget to track.");
    error.statusCode = 400;
    throw error;
  }

  const result = await pool.query(UPSERT_TRACKED_BALANCE_SETTINGS, [
    cycleId,
    Boolean(includeLeft),
    normalizedIds,
  ]);

  const saved = result.rows[0];

  return {
    cycleId: Number(saved.cycleId),
    includeLeft: Boolean(saved.includeLeft),
    categoryIds: saved.categoryIds || [],
    isDefault: false,
  };
};
