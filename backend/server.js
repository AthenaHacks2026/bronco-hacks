const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const itemRoutes = require("./routes/itemRoutes"); // ✅ FIX: added import

const app = express();
const port = process.env.PORT || 3000;
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: allowedOrigin,
  })
);

// Basic routes
app.get("/", (req, res) => {
  res.send("Hi from the backend!");
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "backend", database: "connected" });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes); // ✅ FIX: now works correctly

// Start server
const startServer = async () => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in environment variables.");
    }

    await connectDB();

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();