import pool from "../db.js";
import { createSaving } from "./savingService.js";
import { recalculateCycleTotals } from "./cycleTotalsService.js";
import { UNASSIGNED_LEFT_CATEGORY } from "../constants/categoryConstants.js";
import {
  CREATE_CYCLE,
  GET_ACTIVE_CYCLE,
  GET_CYCLE_HISTORY,
  GET_CYCLE_ANALYSIS,
  VERIFY_END_CYCLE,
  END_CYCLE,
} from "../sql/cycleQueries.js";
import {
  CHECK_CATEGORY_EXISTS,
  CREATE_CATEGORY,
} from "../sql/categoryQueries.js";

export const createCycle = async (userId, cycleName, startDate) => {
  const active = await getActiveCycle(userId);

  if (active) {
    const error = new Error(
      "Please end the current active cycle before creating a new one."
    );
    error.statusCode = 400;
    throw error;
  }

  const result = await pool.query(CREATE_CYCLE, [
    userId,
    cycleName,
    startDate,
  ]);
  return result.rows[0];
};

export const getActiveCycle = async (userId) => {
  const result = await pool.query(GET_ACTIVE_CYCLE, [userId]);
  return result.rows[0] || null;
};

export const getCycleHistory = async (userId) => {
  const result = await pool.query(GET_CYCLE_HISTORY, [userId]);
  return result.rows;
};

export const getCycleAnalysis = async (userId, cycleId) => {
  const result = await pool.query(GET_CYCLE_ANALYSIS, [cycleId, userId]);

  if (!result.rows.length) {
    const error = new Error("Access denied.");
    error.statusCode = 403;
    throw error;
  }

  return result.rows[0];
};

export const verifyEndCycle = async (userId, cycleId) => {
  const result = await pool.query(VERIFY_END_CYCLE, [cycleId, userId]);

  if (!result.rows.length) {
    const error = new Error("Access denied.");
    error.statusCode = 403;
    throw error;
  }

  const row = result.rows[0];
  const unassignedLeft = Math.max(
    0,
    Number(row.total_income || 0) - Number(row.planned_budget || 0)
  );

  return {
    ...row,
    unassigned_left: unassignedLeft,
  };
};

export const endCycle = async (userId, endDate, cycleId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const verificationResult = await client.query(VERIFY_END_CYCLE, [
      cycleId,
      userId,
    ]);

    if (!verificationResult.rows.length) {
      const error = new Error("Access denied.");
      error.statusCode = 403;
      throw error;
    }

    const verification = verificationResult.rows[0];
    const unassignedLeft = Math.max(
      0,
      Number(verification.total_income || 0) -
        Number(verification.planned_budget || 0)
    );

    if (unassignedLeft > 0) {
      const existing = await client.query(CHECK_CATEGORY_EXISTS, [
        cycleId,
        UNASSIGNED_LEFT_CATEGORY.name,
      ]);

      if (!existing.rows.length) {
        await client.query(CREATE_CATEGORY, [
          cycleId,
          UNASSIGNED_LEFT_CATEGORY.name,
          UNASSIGNED_LEFT_CATEGORY.type,
          unassignedLeft,
          UNASSIGNED_LEFT_CATEGORY.icon,
          UNASSIGNED_LEFT_CATEGORY.color,
        ]);
        await recalculateCycleTotals(cycleId, client);
      }
    }

    const endCycleResult = await client.query(END_CYCLE, [
      endDate,
      cycleId,
      userId,
    ]);

    if (Number(verification.total_saved) > 0) {
      await createSaving(
        {
          cycleId,
          bucketId: null,
          type: "DEPOSIT",
          title: `${verification.cycle_name} Savings`,
          amount: verification.total_saved,
          transactionDate: endDate,
          note: "Auto-generated when cycle ended.",
        },
        client
      );
    }

    await client.query("COMMIT");

    return {
      ...endCycleResult.rows[0],
      total_saved: verification.total_saved,
      unassigned_left: unassignedLeft,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
