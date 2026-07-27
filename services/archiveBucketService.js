import pool from "../db.js";

import {
    GET_BUCKET_BY_ID,
    ARCHIVE_BUCKET,
} from "../sql/archiveBucketQueries.js";

import {
    CREATE_BUCKET_TRANSACTION,
} from "../sql/bucketTransactionQueries.js";

export const archiveBucket = async (bucketId) => {
    const bucketResult = await pool.query(
        GET_BUCKET_BY_ID,
        [bucketId]
    );

    if (!bucketResult.rows.length) {
        const error = new Error("Saving bucket not found.");
        error.statusCode = 404;
        throw error;
    }

    const bucket = bucketResult.rows[0];

    if (Number(bucket.balance) > 0) {
        const error = new Error(
            "Transfer or withdraw the remaining balance before archiving this bucket."
        );
        error.statusCode = 400;
        throw error;
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const result = await client.query(
            ARCHIVE_BUCKET,
            [bucketId]
        );

        await client.query(
            CREATE_BUCKET_TRANSACTION,
            [
                bucketId,
                "ARCHIVE",
                null,
                0.01,
                "Bucket Archived",
                null,
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