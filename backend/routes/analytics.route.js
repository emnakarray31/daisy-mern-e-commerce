import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { 
	getAnalyticsData, 
	getDailySalesData,
	getTopProducts,
	getWishlistStats,
	getCategoryStats,
	getUserStats,
	getComprehensiveMetrics
} from "../controllers/analytics.controller.js";

const router = express.Router();
 
router.get("/", protectRoute, adminRoute, async (req, res) => {
	try {
		const analyticsData = await getAnalyticsData();

		const endDate = new Date();
		const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

		const dailySalesData = await getDailySalesData(startDate, endDate);

		res.json({
			analyticsData,
			dailySalesData,
		});
	} catch (error) {
		console.log("Error in analytics route", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
});
router.get("/top-products", protectRoute, adminRoute, getTopProducts);

router.get("/wishlist-stats", protectRoute, adminRoute, getWishlistStats);

router.get("/category-stats", protectRoute, adminRoute, getCategoryStats);

router.get("/user-stats", protectRoute, adminRoute, getUserStats);

router.get("/comprehensive", protectRoute, adminRoute, getComprehensiveMetrics);

export default router;