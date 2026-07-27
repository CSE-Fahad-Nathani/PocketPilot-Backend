import pool from "../db.js";

import {
    GET_BUCKET_BY_ID,
    DEBIT_BUCKET,
    CREDIT_BUCKET,
} from "../sql/transferQueries.js";

import {
    CREATE_BUCKET_TRANSACTION,
} from "../sql/bucketTransactionQueries.js";

export const transferBetweenBuckets = async (
    fromBucketId,
    toBucketId,
    amount,
    note
) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        if (fromBucketId === toBucketId) {
            const error = new Error(
                "Source and destination buckets cannot be the same."
            );
            error.statusCode = 400;
            throw error;
        }

        const fromResult = await client.query(
            GET_BUCKET_BY_ID,
            [fromBucketId]
        );

        const toResult = await client.query(
            GET_BUCKET_BY_ID,
            [toBucketId]
        );

        if (!fromResult.rows.length || !toResult.rows.length) {
            const error = new Error("Bucket not found.");
            error.statusCode = 404;
            throw error;
        }

        const fromBucket = fromResult.rows[0];
        const toBucket = toResult.rows[0];

        if (Number(fromBucket.balance) < Number(amount)) {
            const error = new Error(
                "Insufficient bucket balance."
            );
            error.statusCode = 400;
            throw error;
        }

        await client.query(
            DEBIT_BUCKET,
            [fromBucketId, amount]
        );

        await client.query(
            CREDIT_BUCKET,
            [toBucketId, amount]
        );

        await client.query(
            CREATE_BUCKET_TRANSACTION,
            [
                fromBucketId,
                "TRANSFER_OUT",
                toBucketId,
                amount,
                `Transfer to ${toBucket.name}`,
                note,
            ]
        );

        await client.query(
            CREATE_BUCKET_TRANSACTION,
            [
                toBucketId,
                "TRANSFER_IN",
                fromBucketId,
                amount,
                `Transfer from ${fromBucket.name}`,
                note,
            ]
        );

        await client.query("COMMIT");

        return {
            fromBucketId,
            toBucketId,
            amount,
        };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};