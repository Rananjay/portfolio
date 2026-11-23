import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import apiRoutes from "./server/routes/index.js";
import { connectDatabase, missingSettings } from "./server/db.js";

const app = express();

if (process.env.CLIENT_ORIGIN) {
  app.use(cors({ origin: process.env.CLIENT_ORIGIN.split(",").map((origin) => origin.trim()) }));
}
app.use(express.json({ limit: "100kb" }));

function welcome(_req, res) {
  res.json({
    message: "Welcome to Rananjay Chauhan's Portfolio API",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
}

app.get("/", welcome);

app.use("/api", async (req, res, next) => {
  const missing = missingSettings();
  if (missing.length > 0) {
    console.error("Missing environment settings:", missing.join(", "));
    return res.status(503).json({ message: "The API is not configured yet." });
  }

  try {
    await connectDatabase();
    next();
  } catch (error) {
    console.error("Database connection failed:", { name: error.name, code: error.code });
    res.status(503).json({ message: "The database is unavailable. Please try again later." });
  }
});

app.get("/api", welcome);
app.get("/api/health", welcome);
app.use("/api", apiRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Endpoint not found." });
});

app.use((error, _req, res, _next) => {
  if (error.code === 11000) {
    return res.status(409).json({ message: "A record with that unique value already exists." });
  }

  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({ message: "Invalid fields. Check required values, email, and dates." });
  }

  if (error.status === 400 || error.type === "entity.parse.failed") {
    return res.status(400).json({ message: error.status === 400 && error.message ? error.message : "Invalid request body." });
  }

  console.error("Request failed:", error.name);
  res.status(500).json({ message: "Internal server error." });
});

export default app;
