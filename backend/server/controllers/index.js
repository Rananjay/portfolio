import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

const portfolioFields = ["title", "firstname", "lastname", "email", "completion", "description"];
const permittedFields = {
  contacts: ["firstname", "lastname", "email", "phone", "message"],
  projects: portfolioFields,
  qualifications: portfolioFields,
  profile: ["name", "email"],
};

function pickFields(body, resource) {
  const input = body || {};
  return Object.fromEntries(permittedFields[resource]
    .filter((field) => Object.prototype.hasOwnProperty.call(input, field))
    .map((field) => [field, input[field]]));
}

export function createController(Model, resource) {
  return {
    async list(_req, res) { res.json(await Model.find().sort({ _id: -1 })); },
    async read(req, res) {
      const document = await Model.findById(req.params.id);
      if (!document) return res.status(404).json({ message: "Record not found." });
      res.json(document);
    },
    async create(req, res) {
      const document = await Model.create(pickFields(req.body, resource));
      res.status(201).json(document);
    },
    async update(req, res) {
      const document = await Model.findById(req.params.id);
      if (!document) return res.status(404).json({ message: "Record not found." });
      document.set(pickFields(req.body, resource));
      await document.save();
      res.json(document);
    },
    async remove(req, res) {
      const document = await Model.findByIdAndDelete(req.params.id);
      if (!document) return res.status(404).json({ message: "Record not found." });
      res.json({ message: "Record deleted.", id: req.params.id });
    },
    async removeAll(_req, res) {
      const result = await Model.deleteMany({});
      res.json({ message: "Records deleted.", deletedCount: result.deletedCount });
    },
  };
}

export async function signup(req, res) {
  const { name, email, password } = req.body || {};
  const user = await User.create({ name, email, password, role: "user" });
  res.status(201).json(user);
}

export async function signin(req, res) {
  const { email, password } = req.body || {};
  if (typeof email !== "string" || typeof password !== "string") return res.status(400).json({ message: "Email and password are required." });
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password +tokenVersion");
  if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: "Invalid credentials." });
  const token = jwt.sign({ version: user.tokenVersion }, process.env.JWT_SECRET, { subject: user.id, expiresIn: "1h", algorithm: "HS256" });
  res.json({ token, user });
}

export async function signout(req, res) {
  await User.updateOne({ _id: req.user._id }, { $inc: { tokenVersion: 1 } });
  res.json({ message: "Signed out from all sessions." });
}

export async function getProfile(req, res) { res.json(req.user); }

export async function updateProfile(req, res) {
  req.user.set(pickFields(req.body, "profile"));
  await req.user.save();
  res.json(req.user);
}

export async function deleteProfile(req, res) {
  await User.findByIdAndDelete(req.user._id);
  res.json({ message: "Your account has been deleted." });
}
