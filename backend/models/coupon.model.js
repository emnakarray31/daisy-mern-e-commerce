import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
	{
		code: {
			type: String,
			required: true,
			unique: true,
			uppercase: true,
			trim: true
		},
		type: {
			type: String,
			enum: ["percentage", "fixed", "freeShipping"],
			default: "percentage"
		},
		discountValue: {
			type: Number,
			required: true,
			min: 0
		},
		discountPercentage: {
			type: Number,
			min: 0,
			max: 100
		},
		minimumPurchase: {
			type: Number,
			default: 0
		},
		maxDiscount: {
			type: Number,
			default: null
		},
		expirationDate: {
			type: Date,
			required: true
		},
		isActive: {
			type: Boolean,
			default: true
		},
		isPublic: {
			type: Boolean,
			default: false
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			default: null
		},
		maxUses: {
			type: Number,
			default: null
		},
		usedCount: {
			type: Number,
			default: 0
		},
		usedBy: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}],
		onePerUser: {
			type: Boolean,
			default: true
		},
		description: {
			type: String,
			default: ""
		},
		applicableCategories: {
			type: [String],
			default: []
		},
		applicableProducts: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product"
		}]
	},
	{
		timestamps: true
	}
);

couponSchema.index({ code: 1 });
couponSchema.index({ isPublic: 1, isActive: 1 });
couponSchema.index({ userId: 1, isActive: 1 });

couponSchema.methods.isValid = function(userId = null, cartTotal = 0) {
	if (!this.isActive) {
		return { valid: false, message: "This coupon is no longer active" };
	}

	if (this.expirationDate < new Date()) {
		return { valid: false, message: "This coupon has expired" };
	}
	if (this.maxUses !== null && this.usedCount >= this.maxUses) {
		return { valid: false, message: "This coupon has reached its usage limit" };
	}

	if (!this.isPublic && this.userId) {
		if (!userId || this.userId.toString() !== userId.toString()) {
			return { valid: false, message: "This coupon is not available for your account" };
		}
	}
	if (this.isPublic && this.onePerUser && userId) {
		if (this.usedBy.some(id => id.toString() === userId.toString())) {
			return { valid: false, message: "You have already used this coupon" };
		}
	}

	if (cartTotal < this.minimumPurchase) {
		return { 
			valid: false, 
			message: `Minimum purchase of $${this.minimumPurchase.toFixed(2)} required` 
		};
	}

	return { valid: true, message: "Coupon is valid" };
};
couponSchema.methods.calculateDiscount = function(cartTotal) {
	let discount = 0;

	switch (this.type) {
		case "percentage":
			discount = (cartTotal * this.discountValue) / 100;
			if (this.maxDiscount !== null && discount > this.maxDiscount) {
				discount = this.maxDiscount;
			}
			break;
		
		case "fixed":
			discount = this.discountValue;
			if (discount > cartTotal) {
				discount = cartTotal;
			}
			break;
		
		case "freeShipping":
			discount = 0;
			break;
	}

	return Math.round(discount * 100) / 100; 
};

couponSchema.methods.markAsUsed = async function(userId) {
	this.usedCount += 1;
	
	if (userId && !this.usedBy.includes(userId)) {
		this.usedBy.push(userId);
	}

	if (!this.isPublic && this.userId) {
		this.isActive = false;
	}
	if (this.maxUses !== null && this.usedCount >= this.maxUses) {
		this.isActive = false;
	}

	await this.save();
};

couponSchema.virtual('displayText').get(function() {
	switch (this.type) {
		case "percentage":
			return `${this.discountValue}% OFF`;
		case "fixed":
			return `$${this.discountValue} OFF`;
		case "freeShipping":
			return "FREE SHIPPING";
		default:
			return "DISCOUNT";
	}
});
couponSchema.set('toJSON', { virtuals: true });
couponSchema.set('toObject', { virtuals: true });

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;