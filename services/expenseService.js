import pool from "../db.js";

import {
  CREATE_EXPENSE,
  GET_EXPENSES,
  GET_EXPENSE_BY_ID,
  UPDATE_EXPENSE,
  DELETE_EXPENSE,
  CHECK_CATEGORY_EXISTS,
} from "../sql/expenseQueries.js";

import { recalculateCycleTotals } from "./cycleTotalsService.js";

export const createExpense = async (
  cycleId,
  categoryId,
  expenseDate,
  amount,
  reason,
  note,
  extraData = {}
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const category = await client.query(CHECK_CATEGORY_EXISTS, [
      categoryId,
    ]);

    if (category.rows.length === 0) {
      const error = new Error("Category not found.");
      error.statusCode = 404;
      throw error;
    }

    if (Number(category.rows[0].cycle_id) !== Number(cycleId)) {
      const error = new Error("Category does not belong to this cycle.");
      error.statusCode = 400;
      throw error;
    }

    const expense = await client.query(CREATE_EXPENSE, [
      cycleId,
      categoryId,
      expenseDate,
      amount,
      reason.trim(),
      note,
      JSON.stringify(extraData),
    ]);

    await recalculateCycleTotals(cycleId, client);

    await client.query("COMMIT");

    return expense.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const getExpenses = async (cycleId) => {
  const result = await pool.query(GET_EXPENSES, [cycleId]);

  return result.rows;
};

export const getExpenseById = async (id) => {
  const result = await pool.query(GET_EXPENSE_BY_ID, [id]);

  if (result.rows.length === 0) {
    const error = new Error("Expense not found.");
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};

export const updateExpense = async (
  id,
  categoryId,
  expenseDate,
  amount,
  reason,
  note,
  extraData = {}
) => {
  const existing = await getExpenseById(id);

  const category = await pool.query(CHECK_CATEGORY_EXISTS, [
    categoryId,
  ]);

  if (category.rows.length === 0) {
    const error = new Error("Category not found.");
    error.statusCode = 404;
    throw error;
  }

  if (
    Number(category.rows[0].cycle_id) !==
    Number(existing.cycle_id)
  ) {
    const error = new Error("Category does not belong to this cycle.");
    error.statusCode = 400;
    throw error;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(UPDATE_EXPENSE, [
      id,
      categoryId,
      expenseDate,
      amount,
      reason.trim(),
      note,
      JSON.stringify(extraData),
    ]);

    await recalculateCycleTotals(
      existing.cycle_id,
      client
    );

    await client.query("COMMIT");

    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const deleteExpense = async (id) => {
  const existing = await getExpenseById(id);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(DELETE_EXPENSE, [id]);

    await recalculateCycleTotals(
      existing.cycle_id,
      client
    );

    await client.query("COMMIT");

    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};