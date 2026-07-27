import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";
import cycleRoutes from "./routes/cycleRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import categoryTransferRoutes from "./routes/categoryTransferRoutes.js";
import savingRoutes from "./routes/savingRoutes.js";
import analysisRoutes from "./routes/analysisRoutes.js";
import savingBucketRoutes from "./routes/savingBucketRoutes.js";
import savingAllocationRoutes from "./routes/savingAllocationRoutes.js";
import withdrawRoutes from "./routes/withdrawRoutes.js";
import transferRoutes from "./routes/transferRoutes.js";
import archiveBucketRoutes from "./routes/archiveBucketRoutes.js";
import bucketHistoryRoutes from "./routes/bucketHistoryRoutes.js";
import transactionHistoryRoutes from "./routes/transactionHistoryRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/cycles", cycleRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/category-transfers", categoryTransferRoutes);
app.use("/api/savings", savingRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/saving-buckets", savingBucketRoutes);
app.use("/api/saving-allocations", savingAllocationRoutes);
app.use("/api/saving-buckets/withdraw", withdrawRoutes);
app.use("/api/saving-buckets/transfer",transferRoutes);
app.use("/api/saving-buckets/archive",archiveBucketRoutes);
app.use("/api/saving-buckets", bucketHistoryRoutes);
app.use("/api/transactions", transactionHistoryRoutes);




app.get("/test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      success: true,
      message: "PocketPilot Backend Running",
      time: result.rows[0].now,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});


app.get("/test", async (req, res) => {
    try {
      const result = await pool.query("SELECT NOW()");
  
      res.json({
        success: true,
        message: "PocketPilot Backend Running",
        time: result.rows[0].now,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  });




  

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});