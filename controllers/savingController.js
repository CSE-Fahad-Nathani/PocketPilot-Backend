import * as savingService from "../services/savingService.js";

export const createSaving = async (req, res) => {
  try {
    const {
      cycleId,
      bucketId,
      type,
      title,
      amount,
      transactionDate,
      note,
    } = req.body;

    if (!cycleId) {
      return res.status(400).json({
        success: false,
        message: "Cycle ID is required.",
        data: null,
      });
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
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

export const getAllSavings = async (req, res) => {
  try {
    const savings = await savingService.getAllSavings();

    return res.json({
      success: true,
      message: "Savings fetched successfully.",
      data: savings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

export const getSavingById = async (req, res) => {
  try {
    const saving = await savingService.getSavingById(req.params.id);

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
    const saving = await savingService.updateSaving(
      req.params.id,
      req.body
    );

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
    const saving = await savingService.deleteSaving(req.params.id);

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