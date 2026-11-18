import jwt from "jsonwebtoken";
import { timingSafeEqual } from "node:crypto";
import { User } from "../models/index.js";

export const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

export function requireSetupKey(req, res, next) {
  const supplied = Buffer.from(req.get("x-setup-key") || "");
  const expected = Buffer.from(process.env.SETUP_KEY || "");

  if (
    expected.length === 0 ||
    supplied.length !== expected.length ||
    !timingSafeEqual(supplied, expected)
  ) {
    return res.status(403).json({ message: "Invalid setup key." });
  }

  next();
}

export const requireAuth = asyncHandler(async (req, res, next) => {
  const authorization = req.get("authorization") || "";

  if (!authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Bearer token required." });
  }

  let payload;

  try {
    payload = jwt.verify(authorization.slice(7), process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }

  const user = await User.findById(payload.sub).select("+tokenVersion");

  if (!user || user.tokenVersion !== payload.version) {
    return res.status(401).json({ message: "Session is no longer valid." });
  }

  req.user = user;
  next();
});

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      message: "Admin permission is required for this action.",
    });
  }

  next();
}
