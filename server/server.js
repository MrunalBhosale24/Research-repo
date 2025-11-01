// server/server.js

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const paperRoutes = require("./routes/papers");

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Serve uploaded files ---
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- MongoDB Connection ---
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://localhost:27017/researchDB"; // fallback for local use

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/papers", paperRoutes);

// --- Default Route ---
app.get("/", (req, res) => {
  res.send("Research Paper Repository API is running!");
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
