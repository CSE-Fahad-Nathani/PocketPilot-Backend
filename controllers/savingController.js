import * as savingService from "../services/savingService.js";
import {
  assertBucketOwnedByUser,
  assertCycleOwnedByUser,
  requireUserId,
} from "../utils/ownership.js";

export const createSaving = async (req, res) => {
  try {
    const userId = requireUserId(req.body);
    const {
      cycleId,
      bucketId,
      type,
      title,
      amount,
      transactionDate,
      note,
    } = req.body;

    await assertCycleOwnedByUser(userId, cycleId);

    if (bucketId) {
      await assertBucketOwnedByUser(userId, bucketId);
    }

    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Type is required.",
        data: null,
      });
    }

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required.",
        data: null,
      });
    }

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required.",
        data: null,
      });
    }

    if (!transactionDate) {
      return res.status(400).json({
        success: false,
        message: "Transaction date is required.",
        data: null,
      });
    }

    const saving = await savingService.createSaving({
      cycleId,
      bucketId,
      type,
      title: title.trim(),
      amount,
      transactionDate,
      note,
    });

    return res.status(201).json({
      success: true,
      message: "Saving created successfully.",
      data: saving,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

export const getAllSavings = async (req, res) => {
  try {
    const userId = requireUserId(req.body);
    const { cycleId } = req.body;

    if (cycleId) {
      await assertCycleOwnedByUser(userId, cycleId);
    }

    const savings = await savingService.getAllSavings(userId, cycleId);

    return res.json({
      success: true,
      message: "Savings fetched successfully.",
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

export const getSavingById = async (req, res) => {
  try {
    const userId = requireUserId(req.body);
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Saving ID is required.",
        data: null,
      });
    }

    const saving = await savingService.getSavingById(id);
    await assertCycleOwnedByUser(userId, saving.cycle_id);

    if (saving.bucket_id) {
      await assertBucketOwnedByUser(userId, saving.bucket_id);
    }

    return res.json({
      success: true,
      message: "Saving fetched successfully.",
      data: saving,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

export const updateSaving = async (req, res) => {
  try {
    const userId = requireUserId(req.body);
    const { id, bucketId } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Saving ID is required.",
        data: null,
      });
    }

    const existing = await savingService.getSavingById(id);
    await assertCycleOwnedByUser(userId, existing.cycle_id);

    if (bucketId) {
      await assertBucketOwnedByUser(userId, bucketId);
    } else if (existing.bucket_id) {
      await assertBucketOwnedByUser(userId, existing.bucket_id);
    }

    const saving = await savingService.updateSaving(id, req.body);

    return res.json({
      success: true,
      message: "Saving updated successfully.",
      data: saving,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

export const deleteSaving = async (req, res) => {
  try {
    const userId = requireUserId(req.body);
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Saving ID is required.",
        data: null,
      });
    }

    const existing = await savingService.getSavingById(id);
    await assertCycleOwnedByUser(userId, existing.cycle_id);

    const saving = await savingService.deleteSaving(id);

    return res.json({
      success: true,
      message: "Saving deleted successfully.",
      data: saving,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};
