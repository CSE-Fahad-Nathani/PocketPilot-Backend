import pool from "../db.js";

export const requireUserId = (body = {}) => {
  const userId = Number(body.userId);

  if (!Number.isInteger(userId) || userId <= 0) {
    const error = new Error("userId is required.");
    error.statusCode = 400;
    throw error;
  }

  return userId;
};

export const assertCycleOwnedByUser = async (userId, cycleId) => {
  const id = Number(cycleId);

  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error("Cycle ID is required.");
    error.statusCode = 400;
    throw error;
  }

  const result = await pool.query(
    `SELECT id
     FROM salary_cycles
     WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );

  if (!result.rows.length) {
    const error = new Error("Access denied.");
    error.statusCode = 403;
    throw error;
  }

  return id;
};

export const assertBucketOwnedByUser = async (userId, bucketId) => {
  const id = Number(bucketId);

  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error("Bucket ID is required.");
    error.statusCode = 400;
    throw error;
  }

  const result = await pool.query(
    `SELECT id
     FROM saving_buckets
     WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );

  if (!result.rows.length) {
    const error = new Error("Access denied.");
    error.statusCode = 403;
    throw error;
  }

  return id;
};
