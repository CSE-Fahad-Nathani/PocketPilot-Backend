import * as withdrawService from "../services/withdrawService.js";
import {
  assertBucketOwnedByUser,
  requireUserId,
} from "../utils/ownership.js";

export const withdrawFromBucket = async (req, res) => {
  try {
    const userId = requireUserId(req.body);
    const { bucketId, amount, title, note } = req.body;

    if (!bucketId || !amount || !title) {
      return res.status(400).json({
        success: false,
        message: "Bucket ID, amount and title are required.",
        data: null,
      });
    }

    await assertBucketOwnedByUser(userId, bucketId);

    const result = await withdrawService.withdrawFromBucket(
      bucketId,
      amount,
      title,
      note
    );

    return res.status(200).json({
      success: true,
      message: "Amount withdrawn successfully.",
      data: result,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};
