import pool from "../db.js";
import * as queries from "../sql/categoryTransferQueries.js";

export const createTransfer = async (
  cycleId,
  fromCategoryId,
  toCategoryId,
  amount,
  transferDate,
  note
) => {
  if (fromCategoryId === toCategoryId) {
    const error = new Error("From and To categories cannot be the same.");
    error.statusCode = 400;
    throw error;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const fromCategory = await client.query(
      queries.CHECK_CATEGORY_EXISTS,
      [fromCategoryId]
    );

    if (!fromCategory.rows.length) {
      const error = new Error("From category not found.");
      error.statusCode = 404;
      throw error;
    }

    const toCategory = await client.query(
      queries.CHECK_CATEGORY_EXISTS,
      [toCategoryId]
    );

    if (!toCategory.rows.length) {
      const error = new Error("To category not found.");
      error.statusCode = 404;
      throw error;
    }

    if (
      fromCategory.rows[0].cycle_id !== Number(cycleId) ||
      toCategory.rows[0].cycle_id !== Number(cycleId)
    ) {
      const error = new Error("Categories do not belong to this salary cycle.");
      error.statusCode = 400;
      throw error;
    }

    if (Number(fromCategory.rows[0].budget) < Number(amount)) {
      const error = new Error("Insufficient budget in source category.");
      error.statusCode = 400;
      throw error;
    }

    // Deduct budget from source category
    await client.query(
      queries.UPDATE_CATEGORY_BUDGET,
      [fromCategoryId, -Number(amount)]
    );

    // Add budget to destination category
    await client.query(
      queries.UPDATE_CATEGORY_BUDGET,
      [toCategoryId, Number(amount)]
    );

    // Save transfer history
    const result = await client.query(
      queries.CREATE_TRANSFER,
      [
        cycleId,
        fromCategoryId,
        toCategoryId,
        amount,
        transferDate,
        note,
      ]
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

export const getTransfers = async (cycleId) => {
  const result = await pool.query(
    queries.GET_TRANSFERS,
    [cycleId]
  );

  return result.rows;
};

export const getTransferById = async (id) => {
  const result = await pool.query(
    queries.GET_TRANSFER_BY_ID,
    [id]
  );

  if (!result.rows.length) {
    const error = new Error("Transfer not found.");
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};

export const updateTransfer = async (
  id,
  fromCategoryId,
  toCategoryId,
  amount,
  transferDate,
  note
) => {
  if (fromCategoryId === toCategoryId) {
    const error = new Error("From and To categories cannot be the same.");
    error.statusCode = 400;
    throw error;
  }

  const existing = await getTransferById(id);

  const fromCategory = await pool.query(
    queries.CHECK_CATEGORY_EXISTS,
    [fromCategoryId]
  );

  if (!fromCategory.rows.length) {
    const error = new Error("From category not found.");
    error.statusCode = 404;
    throw error;
  }

  const toCategory = await pool.query(
    queries.CHECK_CATEGORY_EXISTS,
    [toCategoryId]
  );

  if (!toCategory.rows.length) {
    const error = new Error("To category not found.");
    error.statusCode = 404;
    throw error;
  }

  if (
    fromCategory.rows[0].cycle_id !== existing.cycle_id ||
    toCategory.rows[0].cycle_id !== existing.cycle_id
  ) {
    const error = new Error("Categories do not belong to this salary cycle.");
    error.statusCode = 400;
    throw error;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Reverse old transfer
    await client.query(
      queries.UPDATE_CATEGORY_BUDGET,
      [existing.from_category_id, Number(existing.amount)]
    );

    await client.query(
      queries.UPDATE_CATEGORY_BUDGET,
      [existing.to_category_id, -Number(existing.amount)]
    );

    // Check updated source budget
    const latestFromCategory = await client.query(
      queries.CHECK_CATEGORY_EXISTS,
      [fromCategoryId]
    );

    if (Number(latestFromCategory.rows[0].budget) < Number(amount)) {
      const error = new Error("Insufficient budget in source category.");
      error.statusCode = 400;
      throw error;
    }

    // Apply new transfer
    await client.query(
      queries.UPDATE_CATEGORY_BUDGET,
      [fromCategoryId, -Number(amount)]
    );

    await client.query(
      queries.UPDATE_CATEGORY_BUDGET,
      [toCategoryId, Number(amount)]
    );

    // Update transfer history
    const result = await client.query(
      queries.UPDATE_TRANSFER,
      [
        id,
        fromCategoryId,
        toCategoryId,
        amount,
        transferDate,
        note,
      ]
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

export const deleteTransfer = async (id) => {
  const existing = await getTransferById(id);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Reverse the transfer
    await client.query(
      queries.UPDATE_CATEGORY_BUDGET,
      [existing.from_category_id, Number(existing.amount)]
    );

    await client.query(
      queries.UPDATE_CATEGORY_BUDGET,
      [existing.to_category_id, -Number(existing.amount)]
    );

    // Delete transfer history
    const result = await client.query(
      queries.DELETE_TRANSFER,
      [id]
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