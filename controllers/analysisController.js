import * as analysisService from "../services/analysisService.js";

export const getCycleAnalysis = async (req, res) => {
  try {
    const { cycleId } = req.params;

    const analysis = await analysisService.getCycleAnalysis(cycleId);

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

export const getCurrentMonthFuelAnalysis = async (req, res) => {
  try {
    const analysis = await analysisService.getCurrentMonthFuelAnalysis();

    return res.json({
      success: true,
      message: "Current month fuel analysis fetched successfully.",
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