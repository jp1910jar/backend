// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/product.js";
import salesRoutes from "./routes/sales.js"
import crmRoutes from "./routes/crmRoutes.js"; 


const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/crm", crmRoutes); 



// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/warehouse", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Start server
app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
