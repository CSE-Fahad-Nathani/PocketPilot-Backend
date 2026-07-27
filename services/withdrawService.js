import pool from "../db.js";

import {
    GET_BUCKET_BY_ID,
    UPDATE_BUCKET_BALANCE,
} from "../sql/withdrawQueries.js";

import {
    CREATE_BUCKET_TRANSACTION,
} from "../sql/bucketTransactionQueries.js";

export const withdrawFromBucket = async (
    bucketId,
    amount,
    title,
    note
) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const bucketResult = await client.query(
            GET_BUCKET_BY_ID,
            [bucketId]
        );

        if (!bucketResult.rows.length) {
            const error = new Error("Saving bucket not found.");
            error.statusCode = 404;
            throw error;
        }

        const bucket = bucketResult.rows[0];

        if (Number(bucket.balance) < Number(amount)) {
            const error = new Error(
                "Insufficient bucket balance."
            );
            error.statusCode = 400;
            throw error;
        }

        const updatedBucket = await client.query(
            UPDATE_BUCKET_BALANCE,
            [
                bucketId,
                amount,
            ]
        );

        await client.query(
            CREATE_BUCKET_TRANSACTION,
            [
                bucketId,
                "WITHDRAWAL",
                null,
                amount,
                title,
                note,
            ]
        );

        await client.query("COMMIT");

        return updatedBucket.rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};