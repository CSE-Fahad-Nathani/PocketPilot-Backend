import * as cycleService from "../services/cycleService.js";

export const createCycle = async (req, res) => {
  try {
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
      cycleName.trim(),
      startDate
    );

    return res.status(201).json({
      success: true,
      message: "Cycle created successfully.",
      data: cycle,
    });
  } catch (error) {
    if (
      error.message ===
      "Please end the current active cycle before creating a new one."
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
        data: null,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      data: null,
    });
  }
};

export const getActiveCycle = async (req, res) => {
  try {
    const cycle = await cycleService.getActiveCycle();

    return res.json({
      success: true,
      message: "Active cycle fetched successfully.",
      data: cycle,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

export const getCycleHistory = async (req, res) => {
  try {
    const cycles = await cycleService.getCycleHistory();

    return res.json({
      success: true,
      message: "Cycle history fetched successfully.",
      data: cycles,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      data: null,
    });
  }
};

export const getCycleAnalysis = async (req, res) => {
  try {
    const { cycleId } = req.params;

    const analysis = await cycleService.getCycleAnalysis(cycleId);

    return res.json({
      success: true,
      message: "Cycle analysis fetched successfully.",
      data: analysis,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};


export const verifyEndCycle = async (req, res) => {
  try {
    const { cycleId } = req.body;

    if (!cycleId) {
      return res.status(400).json({
        success: false,
        message: "Cycle ID is required.",
        data: null,
      });
    }

    const summary = await cycleService.verifyEndCycle(cycleId);

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

    const cycle = await cycleService.endCycle(
      endDate,
      cycleId
    );

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