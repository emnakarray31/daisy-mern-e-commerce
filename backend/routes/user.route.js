import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import {
	getAllUsers,
	getUserById,
	updateUserRole,
	deleteUser,
	getUserStats,
	createUser,
	updateUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/admin/all", protectRoute, adminRoute, getAllUsers);
router.get("/admin/stats", protectRoute, adminRoute, getUserStats);
router.get("/admin/:id", protectRoute, adminRoute, getUserById);

router.post("/admin/create", protectRoute, adminRoute, createUser);
router.put("/admin/:id", protectRoute, adminRoute, updateUser);

router.patch("/admin/:id/role", protectRoute, adminRoute, updateUserRole);
router.delete("/admin/:id", protectRoute, adminRoute, deleteUser);

export default router;