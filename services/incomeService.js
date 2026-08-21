import pool from "../db.js";

import {
  CREATE_INCOME,
  GET_INCOME,
  GET_INCOME_BY_ID,
  UPDATE_INCOME,
  DELETE_INCOME,
} from "../sql/incomeQueries.js";

import { recalculateCycleTotals } from "./cycleTotalsService.js";

export const createIncome = async (
  cycleId,
  type,
  amount,
  incomeDate,
  note
) => {
  const result = await pool.query(CREATE_INCOME, [
    cycleId,
    type.trim(),
    amount,
    incomeDate,
    note,
  ]);
  
  await recalculateCycleTotals(cycleId);
  
  return result.rows[0];
};

export const getIncome = async (cycleId) => {
  const result = await pool.query(GET_INCOME, [cycleId]);

  return result.rows;
};

export const getIncomeById = async (id) => {
  const result = await pool.query(GET_INCOME_BY_ID, [id]);

  if (result.rows.length === 0) {
    const error = new Error("Income not found.");
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};

export const updateIncome = async (
  id,
  type,
  amount,
  incomeDate,
  note
) => {
  const income = await pool.query(GET_INCOME_BY_ID, [id]);

  if (income.rows.length === 0) {
    const error = new Error("Income not found.");
    error.statusCode = 404;
    throw error;
  }

  const result = await pool.query(UPDATE_INCOME, [
    id,
    type.trim(),
    amount,
    incomeDate,
    note,
  ]);
  
  await recalculateCycleTotals(
    income.rows[0].cycle_id
  );
  
  return result.rows[0];
};

export const deleteIncome = async (id) => {
  const income = await pool.query(GET_INCOME_BY_ID, [id]);

  if (income.rows.length === 0) {
    const error = new Error("Income not found.");
    error.statusCode = 404;
    throw error;
  }

  const result = await pool.query(DELETE_INCOME, [id]);

  await recalculateCycleTotals(
    income.rows[0].cycle_id
  );

  return result.rows[0];
};