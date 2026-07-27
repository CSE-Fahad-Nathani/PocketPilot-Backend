import * as withdrawService from "../services/withdrawService.js";

export const withdrawFromBucket = async (
    req,
    res
) => {
    try {
        const {
            bucketId,
            amount,
            title,
            note,
        } = req.body;

        if (!bucketId || !amount || !title) {
            return res.status(400).json({
                success: false,
                message:
                    "Bucket ID, amount and title are required.",
                data: null,
            });
        }

        const result =
            await withdrawService.withdrawFromBucket(
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