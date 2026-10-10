import pool from "../db.js";
import {
  CREATE_SAVING,
  GET_ALL_SAVINGS,
  GET_SAVING_BY_ID,
  UPDATE_SAVING,
  DELETE_SAVING,
} from "../sql/savingQueries.js";
import { GET_ACTIVE_CYCLE } from "../sql/cycleQueries.js";


export const createSaving = async (
    savingData,
    client = pool
  ) => {
  const {
    cycleId,
    bucketId,
    type,
    title,
    amount,
    transactionDate,
    note,
  } = savingData;

  const result = await client.query(CREATE_SAVING, [
    cycleId,
    bucketId,
    type,
    title,
    amount,
    transactionDate,
    note,
  ]);

  return result.rows[0];
};

/**
 * Additive feature: create a pending DEPOSIT from extra funds.
 * Does not change cycle income/expense totals or existing savings.
 */
export const addManualFunds = async (
  userId,
  { amount, transactionDate, note, title } = {}
) => {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    const error = new Error("Enter a valid amount greater than 0.");
    error.statusCode = 400;
    throw error;
  }

  if (!transactionDate) {
    const error = new Error("Transaction date is required.");
    error.statusCode = 400;
    throw error;
  }

  const activeResult = await pool.query(GET_ACTIVE_CYCLE, [userId]);
  const active = activeResult.rows[0];

  if (!active?.id) {
    const error = new Error(
      "Start an active cycle before adding funds to savings."
    );
    error.statusCode = 400;
    throw error;
  }

  return createSaving({
    cycleId: active.id,
    bucketId: null,
    type: "DEPOSIT",
    title: String(title || "Manual top-up").trim() || "Manual top-up",
    amount: numericAmount,
    transactionDate,
    note: note?.trim() || "Added directly to pending savings.",
  });
};

export const getAllSavings = async (userId, cycleId = null) => {
  const result = await pool.query(GET_ALL_SAVINGS, [
    userId,
    cycleId ? Number(cycleId) : null,
  ]);
  return result.rows;
};

export const getSavingById = async (id) => {
  const result = await pool.query(GET_SAVING_BY_ID, [id]);

  if (!result.rows.length) {
    const error = new Error("Saving not found.");
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};

export const updateSaving = async (id, savingData) => {
  const {
    bucketId,
    type,
    title,
    amount,
    transactionDate,
    note,
  } = savingData;

  const result = await pool.query(UPDATE_SAVING, [
    bucketId,
    type,
    title,
    amount,
    transactionDate,
    note,
    id,
  ]);

  if (!result.rows.length) {
    const error = new Error("Saving not found.");
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};

export const deleteSaving = async (id) => {
  const result = await pool.query(DELETE_SAVING, [id]);

  if (!result.rows.length) {
    const error = new Error("Saving not found.");
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};