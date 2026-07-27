import { getTransactionHistory } from "../services/transactionHistoryService.js";

export const fetchTransactionHistory = async (req, res) => {
    try {
        const history = await getTransactionHistory();

        res.status(200).json({
            success: true,
            message: "Transaction history fetched successfully.",
            data: history,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Something went wrong.",
        });
    }
};