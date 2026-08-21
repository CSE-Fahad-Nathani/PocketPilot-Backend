import * as savingAllocationService from "../services/savingAllocationService.js";
import * as savingService from "../services/savingService.js";
import {
  assertBucketOwnedByUser,
  assertCycleOwnedByUser,
  requireUserId,
} from "../utils/ownership.js";

export const distributeSaving = async (req, res) => {
  try {
    const userId = requireUserId(req.body);
    const { savingId, allocations } = req.body;

    if (!savingId) {
      return res.status(400).json({
        success: false,
        message: "Saving ID is required.",
        data: null,
      });
    }

    if (!Array.isArray(allocations) || allocations.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one allocation is required.",
        data: null,
      });
    }

    const saving = await savingService.getSavingById(savingId);
    await assertCycleOwnedByUser(userId, saving.cycle_id);

    for (const allocation of allocations) {
      if (!allocation.bucketId) {
        return res.status(400).json({
          success: false,
          message: "Bucket ID is required.",
          data: null,
        });
      }

      if (
        allocation.amount === undefined ||
        Number(allocation.amount) <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Allocation amount must be greater than 0.",
          data: null,
        });
      }

      await assertBucketOwnedByUser(userId, allocation.bucketId);
    }

    const result = await savingAllocationService.distributeSaving(
      savingId,
      allocations
    );

    return res.status(201).json({
      success: true,
      message: "Saving distributed successfully.",
      data: result,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error.",
      data: null,
    });
  }
};

export const getPendingSavings = async (req, res) => {
  try {
    const userId = requireUserId(req.body);
    const savings = await savingAllocationService.getPendingSavings(userId);

    return res.status(200).json({
      success: true,
      message: "Pending savings fetched successfully.",
      data: savings,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};
