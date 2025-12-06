import Wishlist from "../models/Wishlist.model.js";
import Product from "../models/product.model.js";

export const getWishlist = async (req, res) => {
	try {
		let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
			path: "products.product",
			select: "name description price image images category isFeatured colors variants totalStock averageRating",
		});
		if (!wishlist) {
			wishlist = await Wishlist.create({
				user: req.user._id,
				products: [],
			});
		}
		const validProducts = wishlist.products.filter(item => item.product !== null);

		res.json({
			products: validProducts.map(item => ({
				...item.product.toJSON(),
				addedAt: item.addedAt,
				wishlistItemId: item._id,
			})),
		});
	} catch (error) {
		console.error("Error in getWishlist controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getAllWishlists = async (req, res) => {
	try {
		const wishlists = await Wishlist.find()
			.populate({
				path: "products.product",
				select: "name description price image images category",
			})
			.populate({
				path: "user",
				select: "name email",
			});

		res.json({
			wishlists: wishlists.map(wishlist => ({
				_id: wishlist._id,
				user: wishlist.user,
				products: wishlist.products.filter(item => item.product !== null),
				createdAt: wishlist.createdAt,
				updatedAt: wishlist.updatedAt,
			})),
		});
	} catch (error) {
		console.error("Error in getAllWishlists controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const addToWishlist = async (req, res) => {
	try {
		const { productId } = req.body;

		const product = await Product.findById(productId);
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}
		let wishlist = await Wishlist.findOne({ user: req.user._id });

		if (!wishlist) {
			wishlist = await Wishlist.create({
				user: req.user._id,
				products: [{ product: productId }],
			});
		} else {
			const existingProduct = wishlist.products.find(
				item => item.product.toString() === productId
			);

			if (existingProduct) {
				return res.status(400).json({ message: "Product already in wishlist" });
			}

			wishlist.products.push({ product: productId });
			await wishlist.save();
		}

		await wishlist.populate({
			path: "products.product",
			select: "name description price image images category isFeatured colors variants totalStock averageRating",
		});

		const validProducts = wishlist.products.filter(item => item.product !== null);

		res.status(201).json({
			message: "Product added to wishlist",
			products: validProducts.map(item => ({
				...item.product.toJSON(),
				addedAt: item.addedAt,
				wishlistItemId: item._id,
			})),
		});
	} catch (error) {
		console.error("Error in addToWishlist controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const removeFromWishlist = async (req, res) => {
	try {
		const { productId } = req.params;

		const wishlist = await Wishlist.findOne({ user: req.user._id });

		if (!wishlist) {
			return res.status(404).json({ message: "Wishlist not found" });
		}
		wishlist.products = wishlist.products.filter(
			item => item.product.toString() !== productId
		);

		await wishlist.save();
		await wishlist.populate({
			path: "products.product",
			select: "name description price image images category isFeatured colors variants totalStock averageRating",
		});
		const validProducts = wishlist.products.filter(item => item.product !== null);

		res.json({
			message: "Product removed from wishlist",
			products: validProducts.map(item => ({
				...item.product.toJSON(),
				addedAt: item.addedAt,
				wishlistItemId: item._id,
			})),
		});
	} catch (error) {
		console.error("Error in removeFromWishlist controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const clearWishlist = async (req, res) => {
	try {
		const wishlist = await Wishlist.findOne({ user: req.user._id });

		if (!wishlist) {
			return res.status(404).json({ message: "Wishlist not found" });
		}

		wishlist.products = [];
		await wishlist.save();

		res.json({ message: "Wishlist cleared", products: [] });
	} catch (error) {
		console.error("Error in clearWishlist controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const checkInWishlist = async (req, res) => {
	try {
		const { productId } = req.params;

		const wishlist = await Wishlist.findOne({ user: req.user._id });

		if (!wishlist) {
			return res.json({ inWishlist: false });
		}

		const inWishlist = wishlist.products.some(
			item => item.product.toString() === productId
		);

		res.json({ inWishlist });
	} catch (error) {
		console.error("Error in checkInWishlist controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const moveToCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = req.user;

		const wishlist = await Wishlist.findOne({ user: user._id });
		if (wishlist) {
			wishlist.products = wishlist.products.filter(
				item => item.product.toString() !== productId
			);
			await wishlist.save();
		}
		const existingCartItem = user.cartItems.find(
			item => item.product.toString() === productId
		);

		if (existingCartItem) {
			existingCartItem.quantity += 1;
		} else {
			user.cartItems.push({ product: productId, quantity: 1 });
		}

		await user.save();

		res.json({
			message: "Product moved to cart",
			cartItems: user.cartItems,
		});
	} catch (error) {
		console.error("Error in moveToCart controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};