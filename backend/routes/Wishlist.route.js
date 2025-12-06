import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import {
	getWishlist,
	getAllWishlists,
	addToWishlist,
	removeFromWishlist,
	clearWishlist,
	checkInWishlist,
	moveToCart,
} from "../controllers/Wishlist.controller.js";

const router = express.Router();

router.get("/all-wishlists", protectRoute, adminRoute, getAllWishlists);

router.get("/", protectRoute, getWishlist);

router.post("/", protectRoute, addToWishlist);

router.delete("/:productId", protectRoute, removeFromWishlist);

router.delete("/", protectRoute, clearWishlist);

router.get("/check/:productId", protectRoute, checkInWishlist);

router.post("/move-to-cart", protectRoute, moveToCart);

export default router;