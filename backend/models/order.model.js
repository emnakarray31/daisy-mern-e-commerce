import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		orderNumber: {
			type: String,
			unique: true,
		},
		products: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				name: String,
				image: String,
				quantity: {
					type: Number,
					required: true,
					min: 1,
				},
				price: {
					type: Number,
					required: true,
					min: 0,
				},
				size: String,
				color: String,
			},
		],
		shippingAddress: {
			fullName: String,
			address: String,
			city: String,
			postalCode: String,
			country: String,
			phone: String,
		},
		subtotal: {
			type: Number,
			required: true,
			min: 0,
		},
		shippingCost: {
			type: Number,
			default: 0,
		},
		discount: {
			type: Number,
			default: 0,
		},
		totalAmount: {
			type: Number,
			required: true,
			min: 0,
		},
		couponCode: {
			type: String,
			default: null,
		},
		status: {
			type: String,
			enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
			default: "pending",
		},
		paymentMethod: {
			type: String,
			default: "stripe",
		},
		paymentStatus: {
			type: String,
			enum: ["pending", "paid", "failed", "refunded"],
			default: "pending",
		},
		stripeSessionId: {
			type: String,
			unique: true,
			sparse: true,
		},
		stripePaymentIntentId: {
			type: String,
		},
		paidAt: Date,
		shippedAt: Date,
		deliveredAt: Date,
		notes: String,
	},
	{ timestamps: true }
);
orderSchema.pre("save", async function (next) {
	if (!this.orderNumber) {
		const date = new Date();
		const year = date.getFullYear().toString().slice(-2);
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const random = Math.random().toString(36).substring(2, 8).toUpperCase();
		this.orderNumber = `DM${year}${month}-${random}`;
	}
	next();
});

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;