import pool from "../db.js";

import { GET_TRANSACTION_HISTORY } from "../sql/transactionHistoryQueries.js";

export const getTransactionHistory = async (userId) => {
  const result = await pool.query(GET_TRANSACTION_HISTORY, [userId]);

  return result.rows;
};
