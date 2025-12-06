import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
	products: [],
	loading: false,
	error: null,

	setProducts: (products) => set({ products }),
	
	createProduct: async (productData) => {
		set({ loading: true, error: null });
		try {
			const res = await axios.post("/products", productData);
			set((prevState) => ({
				products: [...prevState.products, res.data],
				loading: false,
			}));
			toast.success("Product created successfully");
		} catch (error) {
			console.error("Create product error:", error);
			const errorMsg = error.response?.data?.message || error.message || "Failed to create product";
			toast.error(errorMsg);
			set({ loading: false, error: errorMsg });
		}
	},
	
	fetchAllProducts: async () => {
		set({ loading: true, error: null });
		try {
			console.log("Fetching all products...");
			const response = await axios.get("/products");
			console.log("Products response:", response.data);
			const products = response.data.products || response.data || [];
			set({ products, loading: false });
		} catch (error) {
			console.error("Fetch all products error:", error);
			const errorMsg = error.response?.data?.message || error.message || "Failed to fetch products";
			set({ error: errorMsg, loading: false, products: [] });
			toast.error(errorMsg);
		}
	},
	
	fetchProductsByCategory: async (category) => {
		set({ loading: true, error: null });
		try {
			console.log("Fetching products for category:", category);
			const response = await axios.get(`/products/category/${category}`);
			console.log("Category products response:", response.data);
			
			// Gérer différents formats de réponse
			const products = response.data.products || response.data || [];
			set({ products, loading: false });
		} catch (error) {
			console.error("Fetch products by category error:", error);
			const errorMsg = error.response?.data?.message || error.message || "Failed to fetch products";
			set({ error: errorMsg, loading: false, products: [] });
			toast.error(errorMsg);
		}
	},
 
	deleteProduct: async (productId) => {
		set({ loading: true, error: null });
		try {
			await axios.delete(`/products/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.filter((product) => product._id !== productId),
				loading: false,
			}));
			toast.success("Product deleted successfully");
		} catch (error) {
			console.error("Delete product error:", error);
			const errorMsg = error.response?.data?.message || error.message || "Failed to delete product";
			set({ loading: false, error: errorMsg });
			toast.error(errorMsg);
		}
	},
	
	toggleFeaturedProduct: async (productId) => {
		set({ loading: true, error: null });
		try {
			const response = await axios.patch(`/products/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.map((product) =>
					product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
				),
				loading: false,
			}));
			toast.success("Product updated successfully");
		} catch (error) {
			console.error("Toggle featured error:", error);
			const errorMsg = error.response?.data?.message || error.message || "Failed to update product";
			set({ loading: false, error: errorMsg });
			toast.error(errorMsg);
		}
	},
	
	fetchFeaturedProducts: async () => {
		set({ loading: true, error: null });
		try {
			console.log("Fetching featured products...");
			const response = await axios.get("/products/featured");
			console.log("Featured products response:", response.data);
			const products = Array.isArray(response.data) ? response.data : [];
			set({ products, loading: false });
		} catch (error) {
			console.error("Fetch featured products error:", error);
			const errorMsg = error.response?.data?.message || error.message || "Failed to fetch products";
			set({ error: errorMsg, loading: false, products: [] });
		}
	},
}));