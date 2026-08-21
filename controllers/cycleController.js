import * as cycleService from "../services/cycleService.js";
import { requireUserId } from "../utils/ownership.js";

export const createCycle = async (req, res) => {
  try {
    const userId = requireUserId(req.body);
    const { cycleName, startDate } = req.body;

    if (!cycleName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Cycle name is required.",
        data: null,
      });
    }

    if (!startDate) {
      return res.status(400).json({
        success: false,
        message: "Start date is required.",
        data: null,
      });
    }

    const cycle = await cycleService.createCycle(
      userId,
      cycleName.trim(),
      startDate
    );

    return res.status(201).json({
      success: true,
      message: "Cycle created successfully.",
      data: cycle,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error.",
      data: null,
    });
  }
};

export const getActiveCycle = async (req, res) => {
  try {
    const userId = requireUserId(req.body);
    const cycle = await cycleService.getActiveCycle(userId);

    return res.json({
      success: true,
      message: "Active cycle fetched successfully.",
      data: cycle,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

export const getCycleHistory = async (req, res) => {
  try {
    const userId = requireUserId(req.body);
    const cycles = await cycleService.getCycleHistory(userId);

    return res.json({
      success: true,
      message: "Cycle history fetched successfully.",
      data: cycles,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error.",
      data: null,
    });
  }
};

export const verifyEndCycle = async (req, res) => {
  try {
    const userId = requireUserId(req.body);
    const { cycleId } = req.body;

    if (!cycleId) {
      return res.status(400).json({
        success: false,
        message: "Cycle ID is required.",
        data: null,
      });
    }

    const summary = await cycleService.verifyEndCycle(userId, cycleId);

    return res.json({
      success: true,
      message: "Cycle summary generated successfully.",
      data: summary,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

export const endCycle = async (req, res) => {
  try {
    const userId = requireUserId(req.body);
    const { cycleId, endDate } = req.body;

    if (!cycleId) {
      return res.status(400).json({
        success: false,
        message: "Cycle ID is required.",
        data: null,
      });
    }

    if (!endDate) {
      return res.status(400).json({
        success: false,
        message: "End date is required.",
        data: null,
      });
    }

    const cycle = await cycleService.endCycle(userId, endDate, cycleId);

    return res.json({
      success: true,
      message: "Cycle ended successfully.",
      data: cycle,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};
