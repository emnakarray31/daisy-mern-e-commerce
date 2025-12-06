import Product from "../models/product.model.js";

export const getCartProducts = async (req, res) => {
	try {
		const products = await Product.find({ _id: { $in: req.user.cartItems.map(item => item.product) } });

		const cartItems = products.map((product) => {
			const item = req.user.cartItems.find((cartItem) => cartItem.product.toString() === product._id.toString());
			return { ...product.toJSON(), quantity: item.quantity };
		});

		res.json(cartItems);
	} catch (error) {
		console.log("Error in getCartProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const addToCart = async (req, res) => {
	try {
		const { productId, quantity = 1, selectedSize, selectedColor } = req.body;
		const user = req.user;
		const product = await Product.findById(productId);
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		if (product.totalStock < quantity) {
			return res.status(400).json({ 
				message: `Only ${product.totalStock} items available in stock` 
			});
		}

		const existingItem = user.cartItems.find((item) => item.product.toString() === productId);
		if (existingItem) {
			const newQuantity = existingItem.quantity + quantity;
			
			if (product.totalStock < newQuantity) {
				return res.status(400).json({ 
					message: `Cannot add ${quantity} more. Only ${product.totalStock - existingItem.quantity} items available` 
				});
			}
			
			existingItem.quantity = newQuantity;
		} else {
			user.cartItems.push({ product: productId, quantity: quantity });
		}

		await user.save();
		res.json(user.cartItems);
	} catch (error) {
		console.log("Error in addToCart controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const removeAllFromCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = req.user;
		if (!productId) {
			user.cartItems = [];
		} else {
			user.cartItems = user.cartItems.filter((item) => item.product.toString() !== productId);
		}
		await user.save();
		res.json(user.cartItems);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateQuantity = async (req, res) => {
	try {
		const { id: productId } = req.params;
		const { quantity } = req.body;
		const user = req.user;
		
		const product = await Product.findById(productId);
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		if (product.totalStock < quantity) {
			return res.status(400).json({ 
				message: `Only ${product.totalStock} items available in stock` 
			});
		}
		
		const existingItem = user.cartItems.find((item) => item.product.toString() === productId);

		if (existingItem) {
			if (quantity === 0) {
				user.cartItems = user.cartItems.filter((item) => item.product.toString() !== productId);
				await user.save();
				return res.json(user.cartItems);
			}

			existingItem.quantity = quantity;
			await user.save();
			res.json(user.cartItems);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.log("Error in updateQuantity controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};