import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useWishlistStore = create((set, get) => ({
	wishlist: [],
	loading: false,
	error: null,
	getWishlist: async () => {
		set({ loading: true, error: null });
		try {
			const response = await axios.get("/wishlist");
			set({ wishlist: response.data.products, loading: false });
		} catch (error) {
			console.error("Error fetching wishlist:", error);
			set({ 
				error: error.response?.data?.message || "Failed to fetch wishlist", 
				loading: false,
				wishlist: [] 
			});
		}
	},
	addToWishlist: async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.post("/wishlist", { productId });
			set({ wishlist: response.data.products, loading: false });
			toast.success("Added to wishlist!");
			return true;
		} catch (error) {
			const errorMsg = error.response?.data?.message || "Failed to add to wishlist";
			toast.error(errorMsg);
			set({ loading: false });
			return false;
		}
	},
	removeFromWishlist: async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.delete(`/wishlist/${productId}`);
			set({ wishlist: response.data.products, loading: false });
			toast.success("Removed from wishlist");
			return true;
		} catch (error) {
			const errorMsg = error.response?.data?.message || "Failed to remove from wishlist";
			toast.error(errorMsg);
			set({ loading: false });
			return false;
		}
	},
	clearWishlist: async () => {
		set({ loading: true });
		try {
			await axios.delete("/wishlist");
			set({ wishlist: [], loading: false });
			toast.success("Wishlist cleared");
		} catch (error) {
			const errorMsg = error.response?.data?.message || "Failed to clear wishlist";
			toast.error(errorMsg);
			set({ loading: false });
		}
	},

	checkInWishlist: (productId) => {
		const { wishlist } = get();
		return wishlist.some(item => item._id === productId);
	},
	moveToCart: async (productId) => {
		set({ loading: true });
		try {
			await axios.post("/wishlist/move-to-cart", { productId });
			const response = await axios.get("/wishlist");
			set({ wishlist: response.data.products, loading: false });
			toast.success("Moved to cart! 🛒");
			return true;
		} catch (error) {
			const errorMsg = error.response?.data?.message || "Failed to move to cart";
			toast.error(errorMsg);
			set({ loading: false });
			return false;
		}
	},

	toggleWishlist: async (productId) => {
		const { wishlist } = get();
		const isInWishlist = wishlist.some(item => item._id === productId);
		
		if (isInWishlist) {
			return await get().removeFromWishlist(productId);
		} else {
			return await get().addToWishlist(productId);
		}
	},
}));