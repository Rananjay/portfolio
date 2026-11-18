import "dotenv/config";
import mongoose from "mongoose";
import { User } from "../server/models/index.js";

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!process.env.MONGODB_URI || !email || !password) {
  throw new Error("MONGODB_URI, ADMIN_EMAIL and ADMIN_PASSWORD are required.");
}

try {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: "portfolio" });
  let admin = await User.findOne({ email }).select("+tokenVersion");
  if (!admin) admin = new User({ name: "Portfolio Admin", email });
  admin.password = password;
  admin.role = "admin";
  await admin.save();
  console.log(`Admin ready: ${admin.email}`);
} finally {
  await mongoose.disconnect();
}
