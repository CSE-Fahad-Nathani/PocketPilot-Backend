import pool from "../db.js";

import {
    GET_BUCKET_BY_ID,
} from "../sql/archiveBucketQueries.js";

import {
    GET_BUCKET_HISTORY,
} from "../sql/bucketTransactionQueries.js";

export const getBucketHistory = async (bucketId) => {
    const bucketResult = await pool.query(
        GET_BUCKET_BY_ID,
        [bucketId]
    );

    if (!bucketResult.rows.length) {
        const error = new Error("Saving bucket not found.");
        error.statusCode = 404;
        throw error;
    }

    const historyResult = await pool.query(
        GET_BUCKET_HISTORY,
        [bucketId]
    );

    return historyResult.rows;
};