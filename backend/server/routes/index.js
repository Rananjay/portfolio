import { Router } from "express";
import mongoose from "mongoose";
import { Contact, Project, Qualification, User } from "../models/index.js";
import { createController, signup, signin, signout, getProfile, updateProfile, deleteProfile } from "../controllers/index.js";
import { asyncHandler, requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();
router.post("/auth/signup", asyncHandler(signup));
router.post("/auth/signin", asyncHandler(signin));
router.get("/auth/signout", requireAuth, asyncHandler(signout));
router.post("/auth/signout", requireAuth, asyncHandler(signout));
router.route("/profile").all(requireAuth)
  .get(asyncHandler(getProfile))
  .put(asyncHandler(updateProfile))
  .delete(asyncHandler(deleteProfile));

for (const [resource, Model] of Object.entries({ contacts: Contact, projects: Project, qualifications: Qualification, users: User })) {
  const routes = Router();
  const controller = createController(Model, resource);
  routes.param("id", (_req, res, next, id) => {
    if (!mongoose.isObjectIdOrHexString(id)) return res.status(400).json({ message: "Invalid record ID." });
    next();
  });

  if (resource === "users") {
    routes.use(requireAuth, requireAdmin);
    routes.get("/", asyncHandler(controller.list));
    routes.get("/:id", asyncHandler(controller.read));
    routes.delete("/:id", asyncHandler(controller.remove));
  } else {
    const readers = resource === "contacts" ? [requireAuth, requireAdmin] : [];
    routes.get("/", ...readers, asyncHandler(controller.list));
    routes.get("/:id", ...readers, asyncHandler(controller.read));
    if (resource === "contacts") {
      // Visitors can submit a message but cannot read the private inbox.
      routes.post("/", asyncHandler(controller.create));
    } else {
      routes.post("/", requireAuth, requireAdmin, asyncHandler(controller.create));
    }
    routes.put("/:id", requireAuth, requireAdmin, asyncHandler(controller.update));
    routes.delete("/:id", requireAuth, requireAdmin, asyncHandler(controller.remove));
  }
  router.use(`/${resource}`, routes);
}

export default router;
