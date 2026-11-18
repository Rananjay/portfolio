import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import apiRoutes from "./server/routes/index.js";
import {
  Contact, Project, Qualification, User,
} from "./server/models/index.js";

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
}));
app.use(express.json({ limit: "100kb" }));

app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to Rananjay Chauhan's Portfolio API",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

app.use("/api", apiRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Endpoint not found." });
});

app.use((error, _req, res, _next) => {
  if (error.code === 11000) {
    return res.status(409).json({
      message: "A record with that unique value already exists.",
    });
  }

  if (
    error.name === "ValidationError" ||
    error.name === "CastError"
  ) {
    return res.status(400).json({
      message: "Invalid fields. Check required values, email, and dates.",
    });
  }

  if (error.status === 400) {
    return res.status(400).json({ message: error.message });
  }

  console.error("Request failed:", error.name);
  res.status(500).json({ message: "Internal server error." });
});

async function startServer() {
  for (const name of ["MONGODB_URI", "JWT_SECRET", "SETUP_KEY"]) {
    if (!process.env[name]) {
      console.error(`Missing environment setting: ${name}`);
      process.exit(1);
    }
  }

  if (process.env.JWT_SECRET.length < 32) {
    console.error("JWT_SECRET must contain at least 32 characters.");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "portfolio",
      serverSelectionTimeoutMS: 10000,
    });

    // Make all four collections visible even before records are inserted.
    await Promise.all(
      [Contact, Project, Qualification, User]
        .map((Model) => Model.init())
    );

    console.log("Connected database:", mongoose.connection.name);
    const collections = await mongoose.connection.db
  .listCollections({}, { nameOnly: true })
  .toArray();

console.log(
  "Existing collections:",
  collections.map((collection) => collection.name)
);
    console.log("Connected host:", mongoose.connection.host);

    app.listen(port, () => {
      console.log(`Portfolio API running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Startup failed:", {
  name: error.name,
  code: error.code,
  codeName: error.codeName,
});
    process.exit(1);
  }
}

startServer();