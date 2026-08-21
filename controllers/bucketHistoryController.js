import { getBucketHistory } from "../services/bucketHistoryService.js";
import {
  assertBucketOwnedByUser,
  requireUserId,
} from "../utils/ownership.js";

export const fetchBucketHistory = async (req, res) => {
  try {
    const userId = requireUserId(req.body);
    const { bucketId, id } = req.body;
    const targetBucketId = bucketId ?? id;

    await assertBucketOwnedByUser(userId, targetBucketId);

    const history = await getBucketHistory(targetBucketId);

    res.status(200).json({
      success: true,
      message: "Bucket history fetched successfully.",
      data: history,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Something went wrong.",
      data: null,
    });
  }
};
