import express from "express";
import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getFeaturedProducts,
	getProductsByCategory,
	getRecommendedProducts,
	toggleFeaturedProduct,
	getProductById,
	addReview,
	deleteReview,
	decrementStock,
	updateProduct
} from "../controllers/product.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();
router.get("/featured", getFeaturedProducts);
router.get("/recommendations", getRecommendedProducts);

router.get("/category/:category", getProductsByCategory);

router.get("/", getAllProducts);

router.post("/", protectRoute, adminRoute, createProduct);
router.post("/decrement-stock", protectRoute, decrementStock);


router.patch("/:id/toggle", protectRoute, adminRoute, toggleFeaturedProduct);

router.put("/:id", protectRoute, adminRoute, updateProduct);

router.delete("/:id/delete", protectRoute, adminRoute, deleteProduct);

router.post("/:id/reviews", protectRoute, addReview);
router.delete("/:id/reviews/:reviewId", protectRoute, deleteReview);

router.get("/:id", getProductById);

export default router;