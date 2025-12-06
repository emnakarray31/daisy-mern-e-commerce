import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import {
	getMyOrders,
	getOrderById,
	getOrderByNumber,
	cancelOrder,
	getAllOrders,
	updateOrderStatus,
	getOrderStats,
	getOrderDetails
} from "../controllers/order.controller.js";

const router = express.Router();
router.get("/my-orders", protectRoute, getMyOrders);
router.get("/number/:orderNumber", protectRoute, getOrderByNumber);
router.patch("/:id/cancel", protectRoute, cancelOrder);
router.get("/:id", protectRoute, getOrderById);

router.get("/admin/all", protectRoute, adminRoute, getAllOrders);
router.get("/admin/stats", protectRoute, adminRoute, getOrderStats);
router.get("/admin/:id", protectRoute, adminRoute, getOrderDetails);
router.patch("/admin/:id/status", protectRoute, adminRoute, updateOrderStatus);

export default router;