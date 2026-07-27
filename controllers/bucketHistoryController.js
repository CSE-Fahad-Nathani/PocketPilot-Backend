import { getBucketHistory } from "../services/bucketHistoryService.js";

export const fetchBucketHistory = async (req, res) => {
    try {
        const { id } = req.params;

        const history = await getBucketHistory(id);

        res.status(200).json({
            success: true,
            message: "Bucket history fetched successfully.",
            data: history,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Something went wrong.",
        });
    }
};