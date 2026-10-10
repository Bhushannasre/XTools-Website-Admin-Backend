import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import dashboardRoutes from "./routes/dashboardRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import subscriberRoutes from "./routes/subscriberRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const REQUIRED_ENV = ["MONGO_URI", "JWT_SECRET", "CLIENT_URL"];
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`❌ Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const app = express();

const allowedOrigins = process.env.CLIENT_URL
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

console.log("🔧 CORS allowed origins:", allowedOrigins);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.trim().replace(/\/$/, "");

    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    console.warn(`🚫 CORS blocked: ${origin}`);
    return callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With"],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json({ limit: "8mb" }));

app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/admin", contactRoutes);
app.use("/api/admin", subscriberRoutes);
app.use("/api/admin", productRoutes);
app.use("/api/admin", userRoutes);

app.get("/", (req, res) => {
  res.json({ status: "Admin API is running" });
});

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);

  if (err.message?.startsWith("CORS:")) {
    return res.status(403).json({ error: err.message });
  }

  return res.status(err.status || 500).json({
    error: err.message || "Something went wrong",
  });
});

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected.");

    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`🚀 Admin server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Startup error:", err.message);
    process.exit(1);
  }
}

start();
