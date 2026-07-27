import * as transferService from "../services/transferService.js";

export const transferBetweenBuckets = async (
    req,
    res
) => {
    try {
        const {
            fromBucketId,
            toBucketId,
            amount,
            note,
        } = req.body;

        if (
            !fromBucketId ||
            !toBucketId ||
            !amount
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "From Bucket, To Bucket and Amount are required.",
                data: null,
            });
        }

        const result =
            await transferService.transferBetweenBuckets(
                fromBucketId,
                toBucketId,
                amount,
                note
            );

        return res.status(200).json({
            success: true,
            message: "Amount transferred successfully.",
            data: result,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message:
                error.message ||
                "Internal server error.",
            data: null,
        });
    }
};