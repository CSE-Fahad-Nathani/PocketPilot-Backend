import pool from "../db.js";
import { UPDATE_CYCLE_TOTALS } from "../sql/cycleTotalsQueries.js";

export const recalculateCycleTotals = async (
  cycleId,
  client = pool
) => {
  await client.query(UPDATE_CYCLE_TOTALS, [cycleId]);
};