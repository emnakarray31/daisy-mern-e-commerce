import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
	cart: [],
	coupon: null,
	total: 0,
	subtotal: 0,
	isCouponApplied: false,
	isFreeShipping: false,

	getMyCoupon: async () => {
		try {
			const response = await axios.get("/coupons");
			set({ coupon: response.data });
		} catch (error) {
			console.error("Error fetching coupon:", error);
		}
	},

	applyCoupon: async (code) => {
		try {
			const { subtotal } = get();
			
			const response = await axios.post("/coupons/validate", { 
				code,
				cartTotal: subtotal
			});
			
			set({ 
				coupon: response.data.coupon, 
				isCouponApplied: true,
				isFreeShipping: response.data.coupon?.type === 'freeShipping'
			});
			get().calculateTotals();
			toast.success("Coupon applied successfully!");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to apply coupon");
		}
	},

	removeCoupon: () => {
		set({ coupon: null, isCouponApplied: false, isFreeShipping: false });
		get().calculateTotals();
		toast.success("Coupon removed");
	},

	getCartItems: async () => {
		try {
			const res = await axios.get("/cart");
			set({ cart: res.data });
			get().calculateTotals();
		} catch (error) {
			set({ cart: [] });
			toast.error(error.response?.data?.message || "An error occurred");
		}
	},

	clearCart: async () => {
		try { 
			await axios.delete("/cart");
			set({ 
				cart: [], 
				coupon: null, 
				total: 0, 
				subtotal: 0, 
				isCouponApplied: false, 
				isFreeShipping: false 
			});
			console.log("✅ Cart cleared successfully (both frontend and backend)");
		} catch (error) {
			console.error("Error clearing cart:", error); 
			set({ 
				cart: [], 
				coupon: null, 
				total: 0, 
				subtotal: 0, 
				isCouponApplied: false, 
				isFreeShipping: false 
			});
		}
	},
 
	addToCart: async (product, selectedSize = null, selectedColor = null, quantity = 1) => {
		try {
			 
			await axios.post("/cart", { 
				productId: product._id,
				quantity: quantity,
				selectedSize: selectedSize,
				selectedColor: selectedColor
			});
			
			toast.success(`${quantity} item(s) added to cart`);

			 
			await get().getCartItems();
		} catch (error) {
			toast.error(error.response?.data?.message || "An error occurred");
		}
	},

	removeFromCart: async (productId) => {
		await axios.delete(`/cart`, { data: { productId } });
		set((prevState) => ({ cart: prevState.cart.filter((item) => item._id !== productId) }));
		get().calculateTotals();
	},

	updateQuantity: async (productId, quantity) => {
		if (quantity === 0) {
			get().removeFromCart(productId);
			return;
		}

		await axios.put(`/cart/${productId}`, { quantity });
		set((prevState) => ({
			cart: prevState.cart.map((item) => (item._id === productId ? { ...item, quantity } : item)),
		}));
		get().calculateTotals();
	},

	calculateTotals: () => {
		const { cart, coupon } = get();
		const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
		let total = subtotal;

		if (coupon && coupon.type) {
			switch (coupon.type) {
				case 'percentage':
					let discount = (subtotal * coupon.discountValue) / 100;
					if (coupon.maxDiscount && discount > coupon.maxDiscount) {
						discount = coupon.maxDiscount;
					}
					total = subtotal - discount;
					break;
				
				case 'fixed':
					total = subtotal - coupon.discountValue;
					if (total < 0) total = 0;
					break;
				
				case 'freeShipping':
					total = subtotal;
					break;
				
				default:
					if (coupon.discountPercentage) {
						const oldDiscount = subtotal * (coupon.discountPercentage / 100);
						total = subtotal - oldDiscount;
					}
			}
		} else if (coupon && coupon.discountPercentage) {
			const discount = subtotal * (coupon.discountPercentage / 100);
			total = subtotal - discount;
		}

		set({ subtotal, total });
	},
}));