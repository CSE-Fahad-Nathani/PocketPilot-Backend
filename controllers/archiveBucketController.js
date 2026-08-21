import * as archiveBucketService from "../services/archiveBucketService.js";
import {
  assertBucketOwnedByUser,
  requireUserId,
} from "../utils/ownership.js";

export const archiveBucket = async (req, res) => {
  try {
    const userId = requireUserId(req.body);
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Bucket ID is required.",
        data: null,
      });
    }

    await assertBucketOwnedByUser(userId, id);

    const result = await archiveBucketService.archiveBucket(id);

    return res.status(200).json({
      success: true,
      message: "Bucket archived successfully.",
      data: result,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error.",
      data: null,
    });
  }
};
