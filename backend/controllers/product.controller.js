import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";

let redis;
try {
	const redisModule = await import("../lib/redis.js");
	redis = redisModule.redis || redisModule.default;
} catch (error) {
	console.log("Redis not available, continuing without cache");
	redis = null;
}

export const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find({});
		res.json({ products });
	} catch (error) {
		console.log("Error in getAllProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getFeaturedProducts = async (req, res) => {
	try {
		let featuredProducts = null;
		if (redis) {
			featuredProducts = await redis.get("featured_products");
			if (featuredProducts) {
				return res.json(JSON.parse(featuredProducts));
			}
		}
		featuredProducts = await Product.find({ isFeatured: true }).lean();

		if (!featuredProducts) {
			return res.status(404).json({ message: "No featured products found" });
		}
		if (redis) {
			await redis.set("featured_products", JSON.stringify(featuredProducts));
		}

		res.json(featuredProducts);
	} catch (error) {
		console.log("Error in getFeaturedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

 
export const createProduct = async (req, res) => {
	try {
		const { 
			name, 
			description, 
			price, 
			image, 
			images, 
			category, 
			totalStock, 
			isFeatured, 
			colors, 
			variants, 
			tags 
		} = req.body;

		console.log("📝 Creating new product:", name);

 		if (!name || !price) {
			return res.status(400).json({ 
				success: false,
				message: "Name and price are required" 
			});
		}

 		const product = await Product.create({
			name,
			description: description || "",
			price,
			image: image || (images && images[0]) || "",
			images: images || [],
			category: category || "jeans",
			totalStock: totalStock || 0,
			isFeatured: isFeatured || false,
			colors: colors || [],
			variants: variants || [],
			tags: tags || [],
		});

		console.log("✅ Product created:", product._id, "-", product.name);

		res.status(201).json({
			success: true,
			message: "Product created successfully",
			product
		});
	} catch (error) {
		console.log("❌ Error in createProduct controller", error.message);
		res.status(500).json({ 
			success: false,
			message: "Server error", 
			error: error.message 
		});
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const { id } = req.params;
		
		console.log("🗑️ Deleting product:", id);

		const product = await Product.findById(id);

		if (!product) {
			console.log("❌ Product not found:", id);
			return res.status(404).json({ 
				success: false,
				message: "Product not found" 
			});
		}

		console.log("📦 Deleting:", product.name);

 		await Product.findByIdAndDelete(id);

		console.log("✅ Product deleted successfully");

		res.json({ 
			success: true,
			message: "Product deleted successfully" 
		});
	} catch (error) {
		console.log("❌ Error in deleteProduct controller", error.message);
		res.status(500).json({ 
			success: false,
			message: "Server error", 
			error: error.message 
		});
	}
};

export const getRecommendedProducts = async (req, res) => {
	try {
		const products = await Product.aggregate([
			{
				$sample: { size: 4 },
			},
			{
				$project: {
					_id: 1,
					name: 1,
					description: 1,
					image: 1,
					price: 1,
				},
			},
		]);

		res.json(products);
	} catch (error) {
		console.log("Error in getRecommendedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getProductsByCategory = async (req, res) => {
	const { category } = req.params;
	try {
		const products = await Product.find({ category });
		res.json({ products });
	} catch (error) {
		console.log("Error in getProductsByCategory controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const toggleFeaturedProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			product.isFeatured = !product.isFeatured;
			const updatedProduct = await product.save();
			await updateFeaturedProductsCache();
			res.json(updatedProduct);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.log("Error in toggleFeaturedProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

async function updateFeaturedProductsCache() {
	try {
		const featuredProducts = await Product.find({ isFeatured: true }).lean();
		
		if (redis) {
			await redis.set("featured_products", JSON.stringify(featuredProducts));
		}
	} catch (error) {
		console.log("error in update cache function");
	}
}

export const getProductById = async (req, res) => {
	try {
		const { id } = req.params;
		
		const product = await Product.findById(id).populate('reviews.user', 'name email');
		
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		res.json(product);

	} catch (error) {
		console.error("Error fetching product:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
 
export const addReview = async (req, res) => {
	try {
		const { id } = req.params;
		const { rating, comment, images } = req.body;
		const userId = req.user._id;

 		if (!rating || rating < 1 || rating > 5) {
			return res.status(400).json({ message: "Rating must be between 1 and 5" });
		}

		if (!comment || comment.trim().length < 10) {
			return res.status(400).json({ message: "Comment must be at least 10 characters" });
		}

		const product = await Product.findById(id);
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

 		const existingReview = product.reviews.find(
			review => review.user.toString() === userId.toString()
		);

		if (existingReview) {
			return res.status(400).json({ message: "You have already reviewed this product" });
		}

 		let uploadedImages = [];
		if (images && images.length > 0) {
			for (const image of images) {
				try {
					const result = await cloudinary.uploader.upload(image, {
						folder: "reviews",
						transformation: [
							{ width: 800, height: 800, crop: "limit" },
							{ quality: "auto" }
						]
					});
					uploadedImages.push(result.secure_url);
				} catch (uploadError) {
					console.error("Error uploading review image:", uploadError);
				}
			}
		}

 		product.reviews.push({
			user: userId,
			rating: Number(rating),
			comment: comment.trim(),
			images: uploadedImages
		});

 		const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
		product.averageRating = totalRating / product.reviews.length;

		await product.save();

 		const updatedProduct = await Product.findById(id).populate('reviews.user', 'name email');

		res.status(201).json({
			message: "Review added successfully",
			product: updatedProduct
		});

	} catch (error) {
		console.error("Error adding review:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

 export const updateReview = async (req, res) => {
	try {
		const { id, reviewId } = req.params;
		const { rating, comment, images, keepExistingImages } = req.body;
		const userId = req.user._id;

		const product = await Product.findById(id);
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		const reviewIndex = product.reviews.findIndex(
			review => review._id.toString() === reviewId
		);

		if (reviewIndex === -1) {
			return res.status(404).json({ message: "Review not found" });
		}

		const review = product.reviews[reviewIndex];

 		if (review.user.toString() !== userId.toString()) {
			return res.status(403).json({ message: "Not authorized to edit this review" });
		}

 		if (rating && (rating < 1 || rating > 5)) {
			return res.status(400).json({ message: "Rating must be between 1 and 5" });
		}

		if (comment && comment.trim().length < 10) {
			return res.status(400).json({ message: "Comment must be at least 10 characters" });
		}

 		let updatedImages = keepExistingImages ? review.images : [];
		
		if (images && images.length > 0) {
			for (const image of images) {
 				if (image.startsWith('data:')) {
					try {
						const result = await cloudinary.uploader.upload(image, {
							folder: "reviews",
							transformation: [
								{ width: 800, height: 800, crop: "limit" },
								{ quality: "auto" }
							]
						});
						updatedImages.push(result.secure_url);
					} catch (uploadError) {
						console.error("Error uploading review image:", uploadError);
					}
				} else {
 					updatedImages.push(image);
				}
			}
		}

 		if (rating) review.rating = Number(rating);
		if (comment) review.comment = comment.trim();
		review.images = updatedImages;
		review.updatedAt = new Date();
 
		const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
		product.averageRating = totalRating / product.reviews.length;

		await product.save();
		const updatedProduct = await Product.findById(id).populate('reviews.user', 'name email');

		res.json({
			message: "Review updated successfully",
			product: updatedProduct
		});

	} catch (error) {
		console.error("Error updating review:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const deleteReview = async (req, res) => {
	try {
		const { id, reviewId } = req.params;
		const userId = req.user._id;

		const product = await Product.findById(id);
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		const reviewIndex = product.reviews.findIndex(
			review => review._id.toString() === reviewId
		);

		if (reviewIndex === -1) {
			return res.status(404).json({ message: "Review not found" });
		}

		const review = product.reviews[reviewIndex];

		if (review.user.toString() !== userId.toString() && req.user.role !== 'admin') {
			return res.status(403).json({ message: "Not authorized to delete this review" });
		}

		if (review.images && review.images.length > 0) {
			for (const imageUrl of review.images) {
				try {
					const publicId = imageUrl.split("/").pop().split(".")[0];
					await cloudinary.uploader.destroy(`reviews/${publicId}`);
				} catch (error) {
					console.log("Error deleting review image from cloudinary:", error);
				}
			}
		}

		product.reviews.splice(reviewIndex, 1);

		if (product.reviews.length > 0) {
			const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
			product.averageRating = totalRating / product.reviews.length;
		} else {
			product.averageRating = 0;
		}

		await product.save();

		const updatedProduct = await Product.findById(id).populate('reviews.user', 'name email');

		res.json({ 
			message: "Review deleted successfully",
			product: updatedProduct
		});

	} catch (error) {
		console.error("Error deleting review:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const decrementStock = async (req, res) => {
	try {
		const { productId, size, quantity } = req.body;
		
		const product = await Product.findById(productId);
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}
		
		await product.decrementStock(size, quantity);
		
		res.json({ 
			message: "Stock updated", 
			product 
		});
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const updateProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const updateData = req.body;

		console.log("📝 Updating product:", id);
		console.log("📦 Update data:", updateData);
 
		const product = await Product.findByIdAndUpdate(
			id,
			updateData,
			{ new: true, runValidators: true }
		);

		if (!product) {
			return res.status(404).json({
				success: false,
				message: "Product not found"
			});
		}

		console.log("✅ Product updated successfully:", product.name);

		res.json({
			success: true,
			message: "Product updated successfully",
			product
		});
	} catch (error) {
		console.error("❌ Error updating product:", error.message);
		res.status(500).json({
			success: false,
			message: "Error updating product",
			error: error.message
		});
	}
};