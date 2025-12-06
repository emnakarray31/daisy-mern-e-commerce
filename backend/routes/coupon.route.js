import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import {
	getCoupon,
	getMyCoupons,
	validateCoupon,
	useCoupon,
	getAllCoupons,
	createCoupon,
	updateCoupon,
	deleteCoupon,
	toggleCouponStatus,
	getCouponStats
} from "../controllers/coupon.controller.js";

const router = express.Router();
router.get("/my-coupons", protectRoute, getMyCoupons);
router.get("/", protectRoute, getCoupon);
router.post("/validate", protectRoute, validateCoupon);
router.post("/use", protectRoute, useCoupon);

router.get("/admin/all", protectRoute, adminRoute, getAllCoupons);

router.get("/admin/stats", protectRoute, adminRoute, getCouponStats);

router.post("/admin/create", protectRoute, adminRoute, createCoupon);

router.put("/admin/:id", protectRoute, adminRoute, updateCoupon);

router.delete("/admin/:id", protectRoute, adminRoute, deleteCoupon);

router.patch("/admin/:id/toggle", protectRoute, adminRoute, toggleCouponStatus);

export default router;