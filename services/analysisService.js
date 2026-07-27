import pool from "../db.js";
import {
  GET_CYCLE_ANALYSIS,
  GET_CYCLE_INCOMES,
  GET_CYCLE_CATEGORIES,
  GET_CYCLE_EXPENSES,
  GET_CYCLE_SAVINGS,
} from "../sql/analysisQueries.js";

export const getCycleAnalysis = async (cycleId) => {
  const [
    cycleResult,
    incomeResult,
    categoryResult,
    expenseResult,
    savingResult,
  ] = await Promise.all([
    pool.query(GET_CYCLE_ANALYSIS, [cycleId]),
    pool.query(GET_CYCLE_INCOMES, [cycleId]),
    pool.query(GET_CYCLE_CATEGORIES, [cycleId]),
    pool.query(GET_CYCLE_EXPENSES, [cycleId]),
    pool.query(GET_CYCLE_SAVINGS, [cycleId]),
  ]);

  if (!cycleResult.rows.length) {
    const error = new Error("Cycle not found.");
    error.statusCode = 404;
    throw error;
  }

  return {
    ...cycleResult.rows[0],
    incomes: incomeResult.rows,
    categories: categoryResult.rows,
    expenses: expenseResult.rows,
    savings: savingResult.rows,
  };
};