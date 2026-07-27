import pool from "../db.js";
import { createSaving } from "./savingService.js";
import {
  CREATE_CYCLE,
  GET_ACTIVE_CYCLE,
  GET_CYCLE_HISTORY,
  GET_CYCLE_ANALYSIS,
  VERIFY_END_CYCLE,
  END_CYCLE,
} from "../sql/cycleQueries.js";

export const createCycle = async (cycleName, startDate) => {
  const active = await getActiveCycle();

  if (active) {
    throw new Error(
      "Please end the current active cycle before creating a new one."
    );
  }

  const result = await pool.query(CREATE_CYCLE, [cycleName, startDate]);
  return result.rows[0];
};

export const getActiveCycle = async () => {
  const result = await pool.query(GET_ACTIVE_CYCLE);
  return result.rows[0] || null;
};

export const getCycleHistory = async () => {
  const result = await pool.query(GET_CYCLE_HISTORY);

  return result.rows;
};

export const getCycleAnalysis = async (cycleId) => {
  const result = await pool.query(GET_CYCLE_ANALYSIS, [cycleId]);

  if (!result.rows.length) {
    const error = new Error("Cycle not found.");
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};

export const verifyEndCycle = async (cycleId) => {
  const result = await pool.query(
    VERIFY_END_CYCLE,
    [cycleId]
  );

  if (!result.rows.length) {
    const error = new Error("Active cycle not found.");
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};

export const endCycle = async (endDate, cycleId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const verificationResult = await client.query(
      VERIFY_END_CYCLE,
      [cycleId]
    );

    if (!verificationResult.rows.length) {
      const error = new Error("Active cycle not found.");
      error.statusCode = 404;
      throw error;
    }

    const verification = verificationResult.rows[0];

    const endCycleResult = await client.query(
      END_CYCLE,
      [endDate, cycleId]
    );

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
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};