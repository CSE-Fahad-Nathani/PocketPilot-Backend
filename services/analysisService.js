import pool from "../db.js";
import {
  GET_CYCLE_ANALYSIS,
  GET_CYCLE_INCOMES,
  GET_CYCLE_CATEGORIES,
  GET_CYCLE_EXPENSES,
  GET_CYCLE_SAVINGS,
  GET_CYCLE_FUEL_ANALYSIS,
  GET_CURRENT_MONTH_FUEL_ANALYSIS,
} from "../sql/analysisQueries.js";


export const getCycleAnalysis = async (cycleId) => {
  const [
    cycleResult,
    incomeResult,
    categoryResult,
    expenseResult,
    savingResult,
    fuelResult,
  ] = await Promise.all([
    pool.query(GET_CYCLE_ANALYSIS, [cycleId]),
    pool.query(GET_CYCLE_INCOMES, [cycleId]),
    pool.query(GET_CYCLE_CATEGORIES, [cycleId]),
    pool.query(GET_CYCLE_EXPENSES, [cycleId]),
    pool.query(GET_CYCLE_SAVINGS, [cycleId]),
    pool.query(GET_CYCLE_FUEL_ANALYSIS, [cycleId]),
  ]);

  if (!cycleResult.rows.length) {
    const error = new Error("Cycle not found.");
    error.statusCode = 404;
    throw error;
  }

  const fuelGraph = fuelResult.rows;

  const summary = {
    total_fuel_expense: 0,
    total_liters: 0,
    total_distance: 0,
    average_mileage: 0,
    best_mileage: 0,
    worst_mileage: 0,
    average_cost_per_fill: 0,
    average_liters_per_fill: 0,
    average_cost_per_liter: 0,
  };

  if (fuelGraph.length) {
    summary.total_fuel_expense = Number(
      fuelGraph.reduce((sum, item) => sum + Number(item.amount), 0).toFixed(2)
    );

    summary.total_liters = Number(
      fuelGraph.reduce((sum, item) => sum + Number(item.liters || 0), 0).toFixed(2)
    );

    summary.total_distance = Number(
      fuelGraph.reduce((sum, item) => sum + Number(item.distance || 0), 0).toFixed(2)
    );

    const mileages = fuelGraph
      .map((x) => Number(x.mileage))
      .filter((x) => !Number.isNaN(x));

    if (mileages.length) {
      summary.average_mileage = Number(
        (mileages.reduce((a, b) => a + b, 0) / mileages.length).toFixed(2)
      );

      summary.best_mileage = Math.max(...mileages);
      summary.worst_mileage = Math.min(...mileages);
    }

    summary.average_cost_per_fill = Number(
      (summary.total_fuel_expense / fuelGraph.length).toFixed(2)
    );

    summary.average_liters_per_fill = Number(
      (summary.total_liters / fuelGraph.length).toFixed(2)
    );

    if (summary.total_liters > 0) {
      summary.average_cost_per_liter = Number(
        (summary.total_fuel_expense / summary.total_liters).toFixed(2)
      );
    }
  }

  return {
    ...cycleResult.rows[0],
    incomes: incomeResult.rows,
    categories: categoryResult.rows,
    expenses: expenseResult.rows,
    savings: savingResult.rows,

    fuel_analysis: {
      summary,
      history: fuelGraph,
    },
  };
};



export const getCurrentMonthFuelAnalysis = async () => {
  const result = await pool.query(GET_CURRENT_MONTH_FUEL_ANALYSIS);

  const fuelGraph = result.rows;

  const summary = {
    total_fuel_expense: 0,
    total_liters: 0,
    total_distance: 0,
    average_mileage: 0,
    best_mileage: 0,
    worst_mileage: 0,
    average_cost_per_fill: 0,
    average_liters_per_fill: 0,
    average_cost_per_liter: 0,
  };

  if (fuelGraph.length) {
    summary.total_fuel_expense = Number(
      fuelGraph.reduce((sum, item) => sum + Number(item.amount), 0).toFixed(2)
    );

    summary.total_liters = Number(
      fuelGraph.reduce((sum, item) => sum + Number(item.liters || 0), 0).toFixed(2)
    );

    summary.total_distance = Number(
      fuelGraph.reduce((sum, item) => sum + Number(item.distance || 0), 0).toFixed(2)
    );

    const mileages = fuelGraph
      .map((x) => Number(x.mileage))
      .filter((x) => !Number.isNaN(x));

    if (mileages.length) {
      summary.average_mileage = Number(
        (mileages.reduce((a, b) => a + b, 0) / mileages.length).toFixed(2)
      );

      summary.best_mileage = Math.max(...mileages);
      summary.worst_mileage = Math.min(...mileages);
    }

    summary.average_cost_per_fill = Number(
      (summary.total_fuel_expense / fuelGraph.length).toFixed(2)
    );

    summary.average_liters_per_fill = Number(
      (summary.total_liters / fuelGraph.length).toFixed(2)
    );

    if (summary.total_liters > 0) {
      summary.average_cost_per_liter = Number(
        (summary.total_fuel_expense / summary.total_liters).toFixed(2)
      );
    }
  }

  return {
    summary,
    history: fuelGraph,
  };
};