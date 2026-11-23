import mongoose from "mongoose";
import { Contact, Project, Qualification, User } from "./models/index.js";

const REQUIRED_SETTINGS = ["MONGODB_URI", "JWT_SECRET"];

export function missingSettings() {
  const missing = REQUIRED_SETTINGS.filter((name) => !process.env[name]);
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    missing.push("JWT_SECRET (must be at least 32 characters)");
  }
  return missing;
}

// Serverless functions reuse warm instances, so keep one shared connection promise.
let connectionPromise = globalThis.__portfolioMongo;

export function connectDatabase() {
  if (mongoose.connection.readyState === 1) return Promise.resolve(mongoose.connection);

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGODB_URI, {
        dbName: "portfolio",
        serverSelectionTimeoutMS: 10000,
      })
      .then(async () => {
        // Make all four collections visible even before records are inserted.
        await Promise.all([Contact, Project, Qualification, User].map((Model) => Model.init()));
        return mongoose.connection;
      })
      .catch((error) => {
        connectionPromise = undefined;
        globalThis.__portfolioMongo = undefined;
        throw error;
      });
    globalThis.__portfolioMongo = connectionPromise;
  }

  return connectionPromise;
}
