import * as incomeService from "../services/incomeService.js";
import {
  assertCycleOwnedByUser,
  requireUserId,
} from "../utils/ownership.js";

const INCOME_TYPES = [
  "Salary",
  "Bonus",
  "Gift",
  "Refund",
  "Cash",
  "Other",
];

export const createIncome = async (req, res) => {
  try {
    const userId = requireUserId(req.body);
    const {
      cycleId,
      type,
      amount,
      incomeDate,
      note = "",
    } = req.body;

    await assertCycleOwnedByUser(userId, cycleId);

    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Income type is required.",
        data: null,
      });
    }

    if (!INCOME_TYPES.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid income type.",
        data: null,
      });
    }

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0.",
        data: null,
      });
    }

    if (!incomeDate) {
      return res.status(400).json({
        success: false,
        message: "Income date is required.",
        data: null,
      });
    }

    const income = await incomeService.createIncome(
      cycleId,
      type,
      amount,
      incomeDate,
      note
    );

    return res.status(201).json({
      success: true,
      message: "Income created successfully.",
      data: income,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error.",
      data: null,
    });
  }
};

export const getIncome = async (req, res) => {
  try {
    const userId = requireUserId(req.body);
    const { cycleId } = req.body;

    await assertCycleOwnedByUser(userId, cycleId);

    const income = await incomeService.getIncome(cycleId);

    return res.json({
      success: true,
      message: "Income fetched successfully.",
      data: income,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error.",
      data: null,
    });
  }
};

export const updateIncome = async (req, res) => {
  try {
    const userId = requireUserId(req.body);
    const {
      id,
      type,
      amount,
      incomeDate,
      note = "",
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Income ID is required.",
        data: null,
      });
    }

    const existing = await incomeService.getIncomeById(id);
    await assertCycleOwnedByUser(userId, existing.cycle_id);

    if (!type || !INCOME_TYPES.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid income type.",
        data: null,
      });
    }

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0.",
        data: null,
      });
    }

    if (!incomeDate) {
      return res.status(400).json({
        success: false,
        message: "Income date is required.",
        data: null,
      });
    }

    const income = await incomeService.updateIncome(
      id,
      type,
      amount,
      incomeDate,
      note
    );

    return res.json({
      success: true,
      message: "Income updated successfully.",
      data: income,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error.",
      data: null,
    });
  }
};

export const deleteIncome = async (req, res) => {
  try {
    const userId = requireUserId(req.body);
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Income ID is required.",
        data: null,
      });
    }

    const existing = await incomeService.getIncomeById(id);
    await assertCycleOwnedByUser(userId, existing.cycle_id);

    const income = await incomeService.deleteIncome(id);

    return res.json({
      success: true,
      message: "Income deleted successfully.",
      data: income,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error.",
      data: null,
    });
  }
};
