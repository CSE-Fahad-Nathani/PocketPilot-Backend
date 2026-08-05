import * as trackedBalanceService from "../services/trackedBalanceService.js";

export const getTrackedBalanceSettings = async (req, res) => {
  try {
    const { cycleId } = req.params;
    const data = await trackedBalanceService.getTrackedBalanceSettings(cycleId);

    return res.json({
      success: true,
      message: "Tracked balance settings fetched successfully.",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

export const saveTrackedBalanceSettings = async (req, res) => {
  try {
    const { cycleId } = req.params;
    const { includeLeft, categoryIds } = req.body;

    const data = await trackedBalanceService.saveTrackedBalanceSettings(
      cycleId,
      { includeLeft, categoryIds }
    );

    return res.json({
      success: true,
      message: "Tracked balance settings saved successfully.",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};
