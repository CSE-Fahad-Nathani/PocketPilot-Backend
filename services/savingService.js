import pool from "../db.js";
import {
  CREATE_SAVING,
  GET_ALL_SAVINGS,
  GET_SAVING_BY_ID,
  UPDATE_SAVING,
  DELETE_SAVING,
} from "../sql/savingQueries.js";


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