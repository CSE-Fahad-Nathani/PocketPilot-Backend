import * as analysisService from "../services/analysisService.js";
import * as cycleService from "../services/cycleService.js";
import {
  assertCycleOwnedByUser,
  requireUserId,
} from "../utils/ownership.js";

export const getCycleAnalysis = async (req, res) => {
  try {
    const userId = requireUserId(req.body);
    const { cycleId } = req.body;

    await assertCycleOwnedByUser(userId, cycleId);

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
    const userId = requireUserId(req.body);
    const activeCycle = await cycleService.getActiveCycle(userId);

    if (!activeCycle) {
      return res.json({
        success: true,
        message: "Current month fuel analysis fetched successfully.",
        data: {
          summary: {
            total_fuel_expense: 0,
            total_liters: 0,
            total_distance: 0,
            average_mileage: 0,
            best_mileage: 0,
            worst_mileage: 0,
            average_cost_per_fill: 0,
            average_liters_per_fill: 0,
            average_cost_per_liter: 0,
          },
          history: [],
        },
      });
    }

    await assertCycleOwnedByUser(userId, activeCycle.id);

    const analysis = await analysisService.getCurrentMonthFuelAnalysis(
      activeCycle.id
    );

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
