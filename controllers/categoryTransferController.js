import * as categoryTransferService from "../services/categoryTransferService.js";

export const createTransfer = async (req, res) => {
  try {
    const {
      cycleId,
      fromCategoryId,
      toCategoryId,
      amount,
      transferDate,
      note = "",
    } = req.body;

    if (!cycleId) {
      return res.status(400).json({
        success: false,
        message: "Cycle ID is required.",
        data: null,
      });
    }

    if (!fromCategoryId) {
      return res.status(400).json({
        success: false,
        message: "From Category is required.",
        data: null,
      });
    }

    if (!toCategoryId) {
      return res.status(400).json({
        success: false,
        message: "To Category is required.",
        data: null,
      });
    }

    if (!transferDate) {
      return res.status(400).json({
        success: false,
        message: "Transfer date is required.",
        data: null,
      });
    }

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than zero.",
        data: null,
      });
    }

    const transfer = await categoryTransferService.createTransfer(
      cycleId,
      fromCategoryId,
      toCategoryId,
      amount,
      transferDate,
      note
    );

    return res.status(201).json({
      success: true,
      message: "Transfer created successfully.",
      data: transfer,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error.",
      data: null,
    });
  }
};

export const getTransfers = async (req, res) => {
  try {
    const { cycleId } = req.query;

    if (!cycleId) {
      return res.status(400).json({
        success: false,
        message: "Cycle ID is required.",
        data: null,
      });
    }

    const transfers = await categoryTransferService.getTransfers(cycleId);

    return res.json({
      success: true,
      message: "Transfers fetched successfully.",
      data: transfers,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error.",
      data: null,
    });
  }
};

export const getTransferById = async (req, res) => {
  try {
    const { id } = req.params;

    const transfer = await categoryTransferService.getTransferById(id);

    return res.json({
      success: true,
      message: "Transfer fetched successfully.",
      data: transfer,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error.",
      data: null,
    });
  }
};

export const updateTransfer = async (req, res) => {
  try {
    const {
      id,
      fromCategoryId,
      toCategoryId,
      amount,
      transferDate,
      note = "",
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Transfer ID is required.",
        data: null,
      });
    }

    if (!fromCategoryId) {
      return res.status(400).json({
        success: false,
        message: "From Category is required.",
        data: null,
      });
    }

    if (!toCategoryId) {
      return res.status(400).json({
        success: false,
        message: "To Category is required.",
        data: null,
      });
    }

    if (!transferDate) {
      return res.status(400).json({
        success: false,
        message: "Transfer date is required.",
        data: null,
      });
    }

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than zero.",
        data: null,
      });
    }

    const transfer = await categoryTransferService.updateTransfer(
      id,
      fromCategoryId,
      toCategoryId,
      amount,
      transferDate,
      note
    );

    return res.json({
      success: true,
      message: "Transfer updated successfully.",
      data: transfer,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error.",
      data: null,
    });
  }
};

export const deleteTransfer = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Transfer ID is required.",
        data: null,
      });
    }

    const transfer = await categoryTransferService.deleteTransfer(id);

    return res.json({
      success: true,
      message: "Transfer deleted successfully.",
      data: transfer,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error.",
      data: null,
    });
  }
};