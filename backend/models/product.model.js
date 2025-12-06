import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		name: { 
			type: String, 
			required: true 
		},
		description: { 
			type: String, 
			required: true 
		},
		price: { 
			type: Number, 
			required: true,
			min: 0
		},
		image: { 
			type: String, 
			required: true 
		},
		images: {
			type: [String],
			default: []
		},
		category: { 
			type: String, 
			required: true,
			enum: ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags", "accessories"]
		},
		isFeatured: { 
			type: Boolean, 
			default: false 
		},
		colors: {
			type: [String],
			default: []
		},
		variants: [
			{
				size: {
					type: String,
					required: true
				},
				stock: {
					type: Number,
					required: true,
					min: 0,
					default: 0
				},
				priceAdjustment: {
					type: Number,
					default: 0
				}
			}
		],
		totalStock: {
			type: Number,
			default: 0
		},
		tags: {
			type: [String],
			default: []
		},
		reviews: [
			{
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
					required: true
				},
				rating: {
					type: Number,
					min: 1,
					max: 5,
					required: true
				},
				comment: {
					type: String,
					required: true
				},
				// NEW: Support for review images
				images: {
					type: [String],
					default: []
				},
				createdAt: {
					type: Date,
					default: Date.now
				},
				updatedAt: {
					type: Date,
					default: Date.now
				}
			}
		],
		averageRating: {
			type: Number,
			default: 0
		}
	},
	{ timestamps: true }
);

productSchema.pre('save', function(next) {
	if (this.variants && this.variants.length > 0) {
		this.totalStock = this.variants.reduce((total, variant) => total + variant.stock, 0);
	}
	next();
});

productSchema.methods.isAvailable = function(size) {
	const variant = this.variants.find(v => v.size === size);
	return variant && variant.stock > 0;
};

productSchema.methods.getStock = function(size) {
	const variant = this.variants.find(v => v.size === size);
	return variant ? variant.stock : 0;
};

productSchema.methods.decrementStock = async function(size, quantity = 1) {
	const variant = this.variants.find(v => v.size === size);
	if (!variant) {
		throw new Error('Size not available');
	}
	if (variant.stock < quantity) {
		throw new Error('Not enough stock');
	}
	variant.stock -= quantity;
	await this.save();
	return this;
};

const Product = mongoose.model("Product", productSchema);

export default Product;