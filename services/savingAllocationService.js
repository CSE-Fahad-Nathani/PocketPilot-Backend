import pool from "../db.js";

import {
  CREATE_SAVING_ALLOCATION,
  GET_SAVING_BY_ID,
  GET_TOTAL_ALLOCATED,
  GET_SAVING_BUCKET_BY_ID,
  UPDATE_BUCKET_BALANCE,
  GET_PENDING_SAVINGS,
} from "../sql/savingAllocationQueries.js";
import {
  CREATE_BUCKET_TRANSACTION,
} from "../sql/bucketTransactionQueries.js";

export const distributeSaving = async (
  savingId,
  allocations
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Verify saving exists
    const savingResult = await client.query(
      GET_SAVING_BY_ID,
      [savingId]
    );

    if (!savingResult.rows.length) {
      const error = new Error("Saving not found.");
      error.statusCode = 404;
      throw error;
    }

    const saving = savingResult.rows[0];

    // Already allocated amount
    const allocatedResult = await client.query(
      GET_TOTAL_ALLOCATED,
      [savingId]
    );

    const alreadyAllocated = Number(
      allocatedResult.rows[0].total_allocated
    );

    // Amount being allocated now
    const currentAllocation = allocations.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

    if (
      alreadyAllocated + currentAllocation >
      Number(saving.amount)
    ) {
      const error = new Error(
        "Allocated amount exceeds available savings."
      );
      error.statusCode = 400;
      throw error;
    }

    // Insert allocations
    for (const allocation of allocations) {
      const bucket = await client.query(
        GET_SAVING_BUCKET_BY_ID,
        [allocation.bucketId]
      );

      if (!bucket.rows.length) {
        const error = new Error(
          `Saving bucket ${allocation.bucketId} not found.`
        );
        error.statusCode = 404;
        throw error;
      }

      await client.query(
        CREATE_SAVING_ALLOCATION,
        [
          savingId,
          allocation.bucketId,
          allocation.amount,
        ]
      );

      await client.query(
        UPDATE_BUCKET_BALANCE,
        [
          allocation.bucketId,
          allocation.amount,
        ]
      );

      await client.query(
        CREATE_BUCKET_TRANSACTION,
        [
            allocation.bucketId,
            "ALLOCATION",
            savingId,
            allocation.amount,
            saving.title,
            null,
        ]
    );
    }

    await client.query("COMMIT");

    return {
      saving,
      allocated: currentAllocation,
      remaining:
        Number(saving.amount) -
        alreadyAllocated -
        currentAllocation,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};



export const getPendingSavings = async () => {
  const result = await pool.query(GET_PENDING_SAVINGS);

  return result.rows;
};