import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import adminRoutes from "./routes/admin.js";
import vendorRoutes from "./routes/vendor.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Admin routes
app.use("/api/admin", adminRoutes);
app.use("/api/vendor", vendorRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ DB connection error:", err));

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
