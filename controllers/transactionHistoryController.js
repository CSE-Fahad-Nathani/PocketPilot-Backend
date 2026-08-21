import { getTransactionHistory } from "../services/transactionHistoryService.js";
import { requireUserId } from "../utils/ownership.js";

export const fetchTransactionHistory = async (req, res) => {
  try {
    const userId = requireUserId(req.body);
    const history = await getTransactionHistory(userId);

    res.status(200).json({
      success: true,
      message: "Transaction history fetched successfully.",
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
