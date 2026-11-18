import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;
const requiredText = { type: String, required: true, trim: true, maxlength: 200 };
const emailField = { type: String, required: true, trim: true, lowercase: true, maxlength: 254, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ };

const contactSchema = new Schema({
  firstname: requiredText,
  lastname: requiredText,
  email: emailField,
  phone: { type: String, trim: true, maxlength: 30, default: "" },
  message: { type: String, trim: true, required: true, maxlength: 3000 },
}, { timestamps: true });

const portfolioFields = {
  title: requiredText, firstname: requiredText, lastname: requiredText, email: emailField,
  completion: { type: Date, required: true },
  description: { type: String, required: true, trim: true, maxlength: 5000 },
};

const userSchema = new Schema({
  name: requiredText,
  email: { ...emailField, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  tokenVersion: { type: Number, default: 0, select: false },
}, { timestamps: { createdAt: "created", updatedAt: "updated" } });

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  if (typeof this.password !== "string" || this.password.length < 12 || Buffer.byteLength(this.password, "utf8") > 72) {
    const error = new Error("Password must be at least 12 characters and at most 72 UTF-8 bytes.");
    error.status = 400;
    throw error;
  }
  this.password = await bcrypt.hash(this.password, 12);
  if (!this.isNew) this.tokenVersion = (this.tokenVersion || 0) + 1;
});

userSchema.set("toJSON", { transform(_document, result) {
  delete result.password;
  delete result.tokenVersion;
  return result;
} });

export const Contact = mongoose.model("Contact", contactSchema, "contacts");
export const Project = mongoose.model("Project", new Schema(portfolioFields), "projects");
export const Qualification = mongoose.model("Qualification", new Schema(portfolioFields), "qualifications");
export const User = mongoose.model("User", userSchema, "users");
