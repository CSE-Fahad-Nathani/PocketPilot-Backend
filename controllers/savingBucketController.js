import * as savingBucketService from "../services/savingBucketService.js";

export const createSavingBucket = async (req, res) => {
  try {
    const {
      name,
      icon = "",
      color = "",
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Saving bucket name is required.",
        data: null,
      });
    }

    const bucket = await savingBucketService.createSavingBucket(
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
    const buckets = await savingBucketService.getSavingBuckets();

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