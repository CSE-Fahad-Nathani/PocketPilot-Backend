import pool from "../db.js";

import {
    GET_TRANSACTION_HISTORY,
} from "../sql/transactionHistoryQueries.js";

export const getTransactionHistory = async () => {
    const result = await pool.query(
        GET_TRANSACTION_HISTORY
    );

    return result.rows;
};