import * as categoryService from "../services/categoryService.js";
import {
  assertCycleOwnedByUser,
  requireUserId,
} from "../utils/ownership.js";

export const createCategory = async (req, res) => {
  try {
    const userId = requireUserId(req.body);
    const {
      cycleId,
      name,
      type,
      budget = 0,
      icon = "",
      color = "",
    } = req.body;

    await assertCycleOwnedByUser(userId, cycleId);

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
        data: null,
      });
    }

    if (!type?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category type is required.",
        data: null,
      });
    }

    const category = await categoryService.createCategory(
      cycleId,
      name.trim(),
      type.trim(),
      budget,
      icon,
      color
    );

    return res.status(201).json({
      success: true,
      message: "Category created successfully.",
      data: category,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error.",
      data: null,
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const userId = requireUserId(req.body);
    const { cycleId } = req.body;

    await assertCycleOwnedByUser(userId, cycleId);

    const categories = await categoryService.getCategories(cycleId);

    return res.json({
      success: true,
      message: "Categories fetched successfully.",
      data: categories,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error.",
      data: null,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const userId = requireUserId(req.body);
    const {
      id,
      name,
      budget = 0,
      icon = "",
      color = "",
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required.",
        data: null,
      });
    }

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
        data: null,
      });
    }

    const existingCategory = await categoryService.getCategoryById(id);
    await assertCycleOwnedByUser(userId, existingCategory.cycle_id);

    const category = await categoryService.updateCategory(
      id,
      name.trim(),
      existingCategory.type,
      budget,
      icon,
      color
    );

    return res.json({
      success: true,
      message: "Category updated successfully.",
      data: category,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error.",
      data: null,
    });
  }
};

export const importCategoriesFromCycle = async (req, res) => {
  try {
    const userId = requireUserId(req.body);
    const { targetCycleId, sourceCycleId, categoryIds } = req.body;

    if (!targetCycleId) {
      return res.status(400).json({
        success: false,
        message: "Target cycle ID is required.",
        data: null,
      });
    }

    if (!sourceCycleId) {
      return res.status(400).json({
        success: false,
        message: "Source cycle ID is required.",
        data: null,
      });
    }

    await assertCycleOwnedByUser(userId, targetCycleId);
    await assertCycleOwnedByUser(userId, sourceCycleId);

    const data = await categoryService.importCategoriesFromCycle(
      targetCycleId,
      sourceCycleId,
      categoryIds
    );

    return res.status(201).json({
      success: true,
      message: `${data.importedCount} budget${
        data.importedCount === 1 ? "" : "s"
      } imported successfully.`,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error.",
      data: null,
    });
  }
};

export const archiveCategory = async (req, res) => {
  try {
    const userId = requireUserId(req.body);
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required.",
        data: null,
      });
    }

    const existingCategory = await categoryService.getCategoryById(id);
    await assertCycleOwnedByUser(userId, existingCategory.cycle_id);

    const category = await categoryService.archiveCategory(id);

    return res.json({
      success: true,
      message: "Category archived successfully.",
      data: category,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error.",
      data: null,
    });
  }
};
