import pool from "../db.js";

import {
  CREATE_SAVING_BUCKET,
  GET_SAVING_BUCKETS,
  CHECK_SAVING_BUCKET_EXISTS,
} from "../sql/savingBucketQueries.js";

export const createSavingBucket = async (
  name,
  icon,
  color
) => {
  const existingBucket = await pool.query(
    CHECK_SAVING_BUCKET_EXISTS,
    [name]
  );

  if (existingBucket.rows.length > 0) {
    const error = new Error("Saving bucket already exists.");
    error.statusCode = 400;
    throw error;
  }

  const result = await pool.query(
    CREATE_SAVING_BUCKET,
    [
      name.trim(),
      icon,
      color,
    ]
  );

  return result.rows[0];
};

export const getSavingBuckets = async () => {
  const result = await pool.query(
    GET_SAVING_BUCKETS
  );

  return result.rows;
};