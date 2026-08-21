import * as expenseService from "../services/expenseService.js";
import {
  assertCycleOwnedByUser,
  requireUserId,
} from "../utils/ownership.js";

export const createExpense = async (req, res) => {
  try {
    const userId = requireUserId(req.body);
    const {
      cycleId,
      categoryId,
      expenseDate,
      amount,
      reason,
      note = "",
      extraData = {},
    } = req.body;

    await assertCycleOwnedByUser(userId, cycleId);

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required.",
        data: null,
      });
    }

    if (!expenseDate) {
      return res.status(400).json({
        success: false,
        message: "Expense date is required.",
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

    if (!reason?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reason is required.",
        data: null,
      });
    }

    const expense = await expenseService.createExpense(
      cycleId,
      categoryId,
      expenseDate,
      amount,
      reason.trim(),
      note,
      extraData
    );

    return res.status(201).json({
      success: true,
      message: "Expense created successfully.",
      data: expense,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error.",
      data: null,
    });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const userId = requireUserId(req.body);
    const { cycleId } = req.body;

    await assertCycleOwnedByUser(userId, cycleId);

    const expenses = await expenseService.getExpenses(cycleId);

    return res.json({
      success: true,
      message: "Expenses fetched successfully.",
      data: expenses,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error.",
      data: null,
    });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const userId = requireUserId(req.body);
    const {
      id,
      categoryId,
      expenseDate,
      amount,
      reason,
      note = "",
      extraData = {},
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Expense ID is required.",
        data: null,
      });
    }

    const existing = await expenseService.getExpenseById(id);
    await assertCycleOwnedByUser(userId, existing.cycle_id);

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required.",
        data: null,
      });
    }

    if (!expenseDate) {
      return res.status(400).json({
        success: false,
        message: "Expense date is required.",
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

    if (!reason?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reason is required.",
        data: null,
      });
    }

    const expense = await expenseService.updateExpense(
      id,
      categoryId,
      expenseDate,
      amount,
      reason.trim(),
      note,
      extraData
    );

    return res.json({
      success: true,
      message: "Expense updated successfully.",
      data: expense,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error.",
      data: null,
    });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const userId = requireUserId(req.body);
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Expense ID is required.",
        data: null,
      });
    }

    const existing = await expenseService.getExpenseById(id);
    await assertCycleOwnedByUser(userId, existing.cycle_id);

    const expense = await expenseService.deleteExpense(id);

    return res.json({
      success: true,
      message: "Expense deleted successfully.",
      data: expense,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error.",
      data: null,
    });
  }
};

export const getExpenseById = async (req, res) => {
  try {
    const userId = requireUserId(req.body);
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Expense ID is required.",
        data: null,
      });
    }

    const expense = await expenseService.getExpenseById(id);
    await assertCycleOwnedByUser(userId, expense.cycle_id);

    return res.json({
      success: true,
      message: "Expense fetched successfully.",
      data: expense,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error.",
      data: null,
    });
  }
};
