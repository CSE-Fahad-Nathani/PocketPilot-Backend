import * as archiveBucketService from "../services/archiveBucketService.js";

export const archiveBucket = async (req, res) => {
    try {
        const { id } = req.params;

        const result =
            await archiveBucketService.archiveBucket(id);

        return res.status(200).json({
            success: true,
            message: "Bucket archived successfully.",
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