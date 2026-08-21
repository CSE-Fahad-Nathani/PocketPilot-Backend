import * as savingBucketService from "../services/savingBucketService.js";
import { requireUserId } from "../utils/ownership.js";

export const createSavingBucket = async (req, res) => {
  try {
    const userId = requireUserId(req.body);
    const { name, icon = "", color = "" } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Saving bucket name is required.",
        data: null,
      });
    }

    const bucket = await savingBucketService.createSavingBucket(
      userId,
      name.trim(),
      icon,
      color
    );

    return res.status(201).json({
      success: true,
      message: "Saving bucket created successfully.",
      data: bucket,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error.",
      data: null,
    });
  }
};

export const getSavingBuckets = async (req, res) => {
  try {
    const userId = requireUserId(req.body);
    const buckets = await savingBucketService.getSavingBuckets(userId);

    return res.json({
      success: true,
      message: "Saving buckets fetched successfully.",
      data: buckets,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error.",
      data: null,
    });
  }
};
